import slugify from 'slugify';
import { marked } from 'marked';
import pool from '../db.js';
import { ServiceError } from './errors.js';
import { appConfig } from '../config/appConfig.js';

const parseNumber = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const limitRange = (value, { min = 1, max = 100 } = {}) =>
  Math.min(max, Math.max(min, value));

const calcReadingTime = (text) => Math.ceil((text || '').split(' ').length / 200);

const pad = (value) => String(value).padStart(2, '0');

const TIMEZONE_OFFSET_MINUTES = appConfig.timezoneOffsetMinutes;

const toUtcISOStringFromLocalInput = (localValue) => {
  if (!localValue) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(localValue.trim());
  if (!match) return null;
  const [, y, m, d, hh, mm] = match;
  const localMillis = Date.UTC(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(hh),
    Number(mm),
  );
  const utcMillis = localMillis - (TIMEZONE_OFFSET_MINUTES * 60 * 1000);
  return new Date(utcMillis).toISOString();
};

const toLocalInputValue = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localMillis = date.getTime() + (TIMEZONE_OFFSET_MINUTES * 60 * 1000);
  const localDate = new Date(localMillis);
  const year = localDate.getUTCFullYear();
  const month = pad(localDate.getUTCMonth() + 1);
  const day = pad(localDate.getUTCDate());
  const hour = pad(localDate.getUTCHours());
  const minute = pad(localDate.getUTCMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const normalizeScheduledInput = (status, scheduledInput) => {
  if (status !== 'scheduled') return null;
  if (!scheduledInput) {
    throw new ServiceError('Schedule date is required for scheduled posts', 400);
  }
  const iso = toUtcISOStringFromLocalInput(scheduledInput);
  if (!iso) {
    throw new ServiceError('Invalid schedule date', 400);
  }
  return new Date(iso);
};

const resolveDisplayDate = (p) => {
  if (p.status === 'scheduled' && p.scheduled_at) {
    return p.scheduled_at;
  }
  return p.published_at;
};

const formatForCard = (p) => ({
  id: p.id,
  slug: p.slug,
  status: p.status,
  category: p.category_name || 'General',
  date: resolveDisplayDate(p)
    ? new Date(resolveDisplayDate(p)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Draft',
  title: p.title,
  excerpt: p.excerpt || '',
  image: p.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
  author: p.author_name || 'VSDox Team',
  authorRole: p.author_role || '',
  body: p.body || '',
  body_html: p.body_html || '',
  reading_time: p.reading_time || 0,
  views: p.views || 0,
  meta_title: p.meta_title || '',
  meta_description: p.meta_description || '',
  categories: p.categories || [],
  tags: p.tags || [],
  scheduled_at: p.scheduled_at ? new Date(p.scheduled_at).toISOString() : null,
  scheduled_at_local: p.scheduled_at ? toLocalInputValue(p.scheduled_at) : '',
  published_at: p.published_at ? new Date(p.published_at).toISOString() : null,
  created_at: p.created_at ? new Date(p.created_at).toISOString() : null,
});

const POST_SELECT = `
  SELECT
    p.id, p.title, p.slug, p.body, p.excerpt, p.featured_image, p.status,
    p.published_at, p.reading_time, p.views, p.body_html,
    p.meta_title, p.meta_description,
    p.scheduled_at, p.created_at,
    u.name  AS author_name,
    u.role  AS author_role,
    u.avatar_url AS author_avatar,
    (
      SELECT c2.name FROM post_categories pc2
      JOIN   categories c2 ON c2.id = pc2.category_id
      WHERE  pc2.post_id = p.id
      LIMIT  1
    ) AS category_name,
    COALESCE(
      json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
      FILTER (WHERE c.id IS NOT NULL), '[]'
    ) AS categories,
    COALESCE(
      json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
      FILTER (WHERE t.id IS NOT NULL), '[]'
    ) AS tags
  FROM posts p
  LEFT JOIN users           u  ON u.id  = p.author_id
  LEFT JOIN post_categories pc ON pc.post_id = p.id
  LEFT JOIN categories      c  ON c.id  = pc.category_id
  LEFT JOIN post_tags        pt ON pt.post_id = p.id
  LEFT JOIN tags             t  ON t.id  = pt.tag_id
`;

const attachRelations = async (client, postId, categoryIds = [], tagIds = []) => {
  await client.query('DELETE FROM post_categories WHERE post_id = $1', [postId]);
  await client.query('DELETE FROM post_tags WHERE post_id = $1', [postId]);

  for (const cid of categoryIds) {
    await client.query(
      'INSERT INTO post_categories VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [postId, cid],
    );
  }

  for (const tid of tagIds) {
    await client.query(
      'INSERT INTO post_tags VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [postId, tid],
    );
  }
};

export const getPublishedPosts = async ({ page = 1, limit = 10, search } = {}) => {
  const safePage = limitRange(parseNumber(page, 1), { min: 1, max: 1000 });
  const safeLimit = limitRange(parseNumber(limit, 10), { min: 1, max: 100 });
  const offset = (safePage - 1) * safeLimit;

  const params = [];
  let where = `WHERE p.status = 'published' AND p.deleted_at IS NULL`;

  if (search) {
    params.push(`%${search}%`);
    where += ` AND (p.title ILIKE $${params.length} OR p.excerpt ILIKE $${params.length})`;
  }

  params.push(safeLimit, offset);

  const { rows } = await pool.query(`
    ${POST_SELECT}
    ${where}
    GROUP BY p.id, u.name, u.role, u.avatar_url
    ORDER BY p.published_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `, params);

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM posts WHERE status = 'published' AND deleted_at IS NULL`,
  );

  return {
    posts: rows.map(formatForCard),
    total: parseInt(countRows[0].count, 10),
    page: safePage,
    limit: safeLimit,
  };
};

export const getPostBySlug = async (slug) => {
  const { rows } = await pool.query(`
    ${POST_SELECT}
    WHERE p.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL
    GROUP BY p.id, u.name, u.role, u.avatar_url
  `, [slug]);

  if (!rows[0]) {
    throw new ServiceError('Post not found', 404);
  }

  await pool.query('UPDATE posts SET views = views + 1 WHERE slug = $1', [slug]);
  return formatForCard(rows[0]);
};

export const getPostPreview = async (id) => {
  const { rows } = await pool.query(`
    ${POST_SELECT}
    WHERE p.id = $1 AND p.deleted_at IS NULL
    GROUP BY p.id, u.name, u.role, u.avatar_url
  `, [id]);

  if (!rows[0]) {
    throw new ServiceError('Post not found', 404);
  }

  return formatForCard(rows[0]);
};

export const getAllPosts = async ({ page = 1, limit = 50, status } = {}) => {
  const safePage = limitRange(parseNumber(page, 1), { min: 1, max: 1000 });
  const safeLimit = limitRange(parseNumber(limit, 50), { min: 1, max: 200 });
  const offset = (safePage - 1) * safeLimit;

  const params = [];
  let where = `WHERE p.deleted_at IS NULL`;

  if (status) {
    params.push(status);
    where += ` AND p.status = $${params.length}`;
  }

  params.push(safeLimit, offset);

  const { rows } = await pool.query(`
    ${POST_SELECT}
    ${where}
    GROUP BY p.id, u.name, u.role, u.avatar_url
    ORDER BY p.updated_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `, params);

  return { posts: rows.map(formatForCard) };
};

const generateUniqueSlug = async (client, title) => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  const { rows: existing } = await client.query(
    'SELECT id, deleted_at FROM posts WHERE slug = $1',
    [baseSlug],
  );

  if (existing.length === 0) {
    return baseSlug;
  }

  const allDeleted = existing.every((row) => row.deleted_at !== null);
  if (allDeleted) {
    await client.query(
      'DELETE FROM posts WHERE slug = $1 AND deleted_at IS NOT NULL',
      [baseSlug],
    );
    return baseSlug;
  }

  let suffix = 2;
  while (true) {
    const candidate = `${baseSlug}-${suffix}`;
    const { rows: check } = await client.query(
      'SELECT id FROM posts WHERE slug = $1 AND deleted_at IS NULL',
      [candidate],
    );
    if (check.length === 0) {
      return candidate;
    }
    suffix += 1;
  }
};

export const createPost = async (payload, authorId) => {
  const client = await pool.connect();
  try {
    const {
      title,
      body,
      excerpt,
      status = 'draft',
      featured_image,
      featured_image_alt,
      meta_title,
      meta_description,
      category_ids = [],
      tag_ids = [],
      scheduled_at,
    } = payload;

    await client.query('BEGIN');
    const slug = await generateUniqueSlug(client, title);
    const body_html = marked(body || '');
    const reading_time = calcReadingTime(body);
    const published_at = status === 'published' ? new Date() : null;

    const scheduledDate = normalizeScheduledInput(status, scheduled_at);

    const { rows } = await client.query(`
      INSERT INTO posts
        (title, slug, body, body_html, excerpt, status, author_id,
         featured_image, featured_image_alt, meta_title, meta_description,
          reading_time, published_at, scheduled_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      title, slug, body, body_html, excerpt, status, authorId,
      featured_image, featured_image_alt, meta_title, meta_description,
      reading_time, published_at, scheduledDate,
    ]);

    await attachRelations(client, rows[0].id, category_ids, tag_ids);
    await client.query('COMMIT');

    return { id: rows[0].id, slug: rows[0].slug, status: rows[0].status };
  } catch (err) {
    console.error('CRITICAL ERROR IN createPost:', err);
    await client.query('ROLLBACK');
    throw err instanceof ServiceError ? err : new ServiceError(err.message);
  } finally {
    client.release();
  }
};

export const updatePost = async (id, payload, userId) => {
  const client = await pool.connect();
  try {
    const existing = await client.query(
      'SELECT * FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    if (!existing.rows[0]) {
      throw new ServiceError('Post not found', 404);
    }

    const prev = existing.rows[0];
    const {
      title,
      body,
      excerpt,
      status,
      featured_image,
      featured_image_alt,
      meta_title,
      meta_description,
      category_ids = [],
      tag_ids = [],
      scheduled_at,
    } = payload;

    await client.query(
      'INSERT INTO post_revisions (post_id, title, body, author_id) VALUES ($1,$2,$3,$4)',
      [id, prev.title, prev.body, userId],
    );

    const body_html = body ? marked(body) : prev.body_html;
    const reading_time = calcReadingTime(body || prev.body);
    const published_at = status === 'published' && !prev.published_at ? new Date() : prev.published_at;
    const scheduledDate = normalizeScheduledInput(status, scheduled_at);

    await client.query('BEGIN');
    const { rows } = await client.query(`
      UPDATE posts SET
        title              = COALESCE($1,  title),
        body               = COALESCE($2,  body),
        body_html          = COALESCE($3,  body_html),
        excerpt            = COALESCE($4,  excerpt),
        status             = COALESCE($5,  status),
        featured_image     = COALESCE($6,  featured_image),
        featured_image_alt = COALESCE($7,  featured_image_alt),
        meta_title         = COALESCE($8,  meta_title),
        meta_description   = COALESCE($9,  meta_description),
        reading_time       = $10,
        published_at       = $11,
        scheduled_at       = $12,
        updated_at         = NOW()
      WHERE id = $13
      RETURNING *
    `, [
      title, body, body_html, excerpt, status,
      featured_image, featured_image_alt,
      meta_title, meta_description,
      reading_time, published_at, scheduledDate, id,
    ]);

    await attachRelations(client, id, category_ids, tag_ids);
    await client.query('COMMIT');

    return { id: rows[0].id, slug: rows[0].slug, status: rows[0].status };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof ServiceError) throw err;
    throw new ServiceError(err.message);
  } finally {
    client.release();
  }
};

export const publishPost = async (id) => {
  const { rows } = await pool.query(`
    UPDATE posts
    SET    status       = 'published',
           published_at = COALESCE(published_at, NOW()),
           updated_at   = NOW()
    WHERE  id = $1 AND deleted_at IS NULL
    RETURNING id, slug, status, published_at
  `, [id]);

  if (!rows[0]) {
    throw new ServiceError('Post not found', 404);
  }

  return rows[0];
};

export const withdrawPost = async (id) => {
  const { rows } = await pool.query(`
    UPDATE posts
    SET    status     = 'draft',
           updated_at = NOW()
    WHERE  id = $1 AND deleted_at IS NULL
    RETURNING id, slug, status
  `, [id]);

  if (!rows[0]) {
    throw new ServiceError('Post not found', 404);
  }

  return rows[0];
};

export const deletePost = async (id) => {
  const { rows } = await pool.query(`
    UPDATE posts
    SET    deleted_at = NOW(),
           updated_at = NOW()
    WHERE  id = $1 AND deleted_at IS NULL
    RETURNING id, title
  `, [id]);

  if (!rows[0]) {
    throw new ServiceError('Post not found or already deleted', 404);
  }

  return rows[0];
};

export const getRevisions = async (id) => {
  const { rows } = await pool.query(`
    SELECT r.*, u.name AS author_name
    FROM   post_revisions r
    LEFT   JOIN users u ON u.id = r.author_id
    WHERE  r.post_id = $1
    ORDER  BY r.created_at DESC
  `, [id]);
  return rows;
};
