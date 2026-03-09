import slugify from 'slugify';
import { marked } from 'marked';
import pool from '../db.js';

const calcReadingTime = (text) => Math.ceil((text || '').split(' ').length / 200);

// Formats a DB row into the exact shape BlogCard expects
const formatForCard = (p) => ({
  id:     p.id,
  slug:   p.slug,
  status: p.status,

  // ── exact BlogCard prop names ──────────────────────────────────────
  category:   p.category_name  || 'General',
  date:       p.published_at
                ? new Date(p.published_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'Draft',
  title:      p.title,
  excerpt:    p.excerpt        || '',
  image:      p.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
  author:     p.author_name    || 'VSDox Team',
  authorRole: p.author_role    || '',

  // ── extra fields for single-post page ─────────────────────────────
  body:             p.body             || '',
  body_html:        p.body_html        || '',
  reading_time:     p.reading_time     || 0,
  views:            p.views            || 0,
  meta_title:       p.meta_title       || '',
  meta_description: p.meta_description || '',
  categories:       p.categories       || [],
  tags:             p.tags             || [],
});

const attachRelations = async (client, postId, category_ids = [], tag_ids = []) => {
  await client.query('DELETE FROM post_categories WHERE post_id = $1', [postId]);
  await client.query('DELETE FROM post_tags      WHERE post_id = $1', [postId]);
  for (const cid of category_ids) {
    await client.query('INSERT INTO post_categories VALUES ($1,$2) ON CONFLICT DO NOTHING', [postId, cid]);
  }
  for (const tid of tag_ids) {
    await client.query('INSERT INTO post_tags VALUES ($1,$2) ON CONFLICT DO NOTHING', [postId, tid]);
  }
};

// Reusable SELECT — returns all fields needed by formatForCard
const POST_SELECT = `
  SELECT
    p.id, p.title, p.slug, p.body, p.excerpt, p.featured_image, p.status,
    p.published_at, p.reading_time, p.views, p.body_html,
    p.meta_title, p.meta_description,
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

// ── PUBLIC: all published posts ────────────────────────────────────────
export const getPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const params = [];
    let where = `WHERE p.status = 'published' AND p.deleted_at IS NULL`;

    if (search) {
      params.push(`%${search}%`);
      where += ` AND (p.title ILIKE $${params.length} OR p.excerpt ILIKE $${params.length})`;
    }

    params.push(Number(limit), Number(offset));

    const { rows } = await pool.query(`
      ${POST_SELECT}
      ${where}
      GROUP BY p.id, u.name, u.role, u.avatar_url
      ORDER BY p.published_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM posts WHERE status = 'published' AND deleted_at IS NULL`
    );

    res.json({
      posts: rows.map(formatForCard),
      total: parseInt(countRows[0].count),
      page:  parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUBLIC: single post by slug ────────────────────────────────────────
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query(`
      ${POST_SELECT}
      WHERE p.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL
      GROUP BY p.id, u.name, u.role, u.avatar_url
    `, [slug]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });

    await pool.query('UPDATE posts SET views = views + 1 WHERE slug = $1', [slug]);
    res.json(formatForCard(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── ADMIN: preview any post by id (any status) ───────────────────────
export const getPostPreview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      ${POST_SELECT}
      WHERE p.id = $1 AND p.deleted_at IS NULL
      GROUP BY p.id, u.name, u.role, u.avatar_url
    `, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(formatForCard(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: all posts (any status) ─────────────────────────────────────
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    const params = [];
    let where = `WHERE p.deleted_at IS NULL`;

    if (status) {
      params.push(status);
      where += ` AND p.status = $${params.length}`;
    }

    params.push(Number(limit), Number(offset));

    const { rows } = await pool.query(`
      ${POST_SELECT}
      ${where}
      GROUP BY p.id, u.name, u.role, u.avatar_url
      ORDER BY p.updated_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    res.json({ posts: rows.map(formatForCard) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: create post ─────────────────────────────────────────────────
export const createPost = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title, body, excerpt,
      status        = 'draft',
      featured_image, featured_image_alt,
      meta_title, meta_description,
      category_ids  = [],
      tag_ids       = [],
      scheduled_at,
    } = req.body;

    const baseSlug     = slugify(title, { lower: true, strict: true });
    const body_html    = marked(body || '');
    const reading_time = calcReadingTime(body);
    const published_at = status === 'published' ? new Date() : null;

    await client.query('BEGIN');

    // ── Slug uniqueness: handle soft-deleted posts with the same slug ──
    // Strategy: if the base slug exists only as a soft-deleted row, reuse it
    // (hard-delete that row first). If it exists as a live row, append -2, -3…
    const { rows: existing } = await client.query(
      `SELECT id, deleted_at FROM posts WHERE slug = $1`, [baseSlug]
    );

    let slug = baseSlug;

    if (existing.length > 0) {
      const allDeleted = existing.every(r => r.deleted_at !== null);
      if (allDeleted) {
        // Safe to reuse: permanently remove the soft-deleted ghost rows
        await client.query(`DELETE FROM posts WHERE slug = $1 AND deleted_at IS NOT NULL`, [baseSlug]);
      } else {
        // A live post already has this slug — find a free numeric suffix
        let suffix = 2;
        while (true) {
          const candidate = `${baseSlug}-${suffix}`;
          const { rows: check } = await client.query(
            `SELECT id FROM posts WHERE slug = $1 AND deleted_at IS NULL`, [candidate]
          );
          if (check.length === 0) { slug = candidate; break; }
          suffix++;
        }
      }
    }

    const { rows } = await client.query(`
      INSERT INTO posts
        (title, slug, body, body_html, excerpt, status, author_id,
         featured_image, featured_image_alt, meta_title, meta_description,
         reading_time, published_at, scheduled_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      title, slug, body, body_html, excerpt, status, req.user.id,
      featured_image, featured_image_alt, meta_title, meta_description,
      reading_time, published_at, scheduled_at || null,
    ]);

    await attachRelations(client, rows[0].id, category_ids, tag_ids);
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Post created',
      post: { id: rows[0].id, slug: rows[0].slug, status: rows[0].status },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ── ADMIN: update post (full edit) ────────────────────────────────────
export const updatePost = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      title, body, excerpt, status,
      featured_image, featured_image_alt,
      meta_title, meta_description,
      category_ids = [], tag_ids = [],
      scheduled_at,
    } = req.body;

    const { rows: existing } = await client.query(
      'SELECT * FROM posts WHERE id = $1 AND deleted_at IS NULL', [id]
    );
    if (!existing[0]) return res.status(404).json({ error: 'Post not found' });

    const prev = existing[0];

    // save revision
    await client.query(
      'INSERT INTO post_revisions (post_id, title, body, author_id) VALUES ($1,$2,$3,$4)',
      [id, prev.title, prev.body, req.user.id]
    );

    const body_html    = body ? marked(body) : prev.body_html;
    const reading_time = calcReadingTime(body || prev.body);
    const published_at = status === 'published' && !prev.published_at ? new Date() : prev.published_at;

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
      reading_time, published_at, scheduled_at || null, id,
    ]);

    await attachRelations(client, id, category_ids, tag_ids);
    await client.query('COMMIT');

    res.json({
      message: 'Post updated',
      post: { id: rows[0].id, slug: rows[0].slug, status: rows[0].status },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ── ADMIN: publish ────────────────────────────────────────────────────
export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      UPDATE posts
      SET    status       = 'published',
             published_at = COALESCE(published_at, NOW()),
             updated_at   = NOW()
      WHERE  id = $1 AND deleted_at IS NULL
      RETURNING id, slug, status, published_at
    `, [id]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post published', post: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: withdraw (back to draft) ──────────────────────────────────
export const withdrawPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      UPDATE posts
      SET    status     = 'draft',
             updated_at = NOW()
      WHERE  id = $1 AND deleted_at IS NULL
      RETURNING id, slug, status
    `, [id]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post withdrawn to draft', post: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: soft delete ────────────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      UPDATE posts
      SET    deleted_at = NOW(),
             updated_at = NOW()
      WHERE  id = $1 AND deleted_at IS NULL
      RETURNING id, title
    `, [id]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found or already deleted' });
    res.json({ message: `"${rows[0].title}" has been deleted`, id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: revisions ──────────────────────────────────────────────────
export const getRevisions = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT r.*, u.name AS author_name
      FROM   post_revisions r
      LEFT   JOIN users u ON u.id = r.author_id
      WHERE  r.post_id = $1
      ORDER  BY r.created_at DESC
    `, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};