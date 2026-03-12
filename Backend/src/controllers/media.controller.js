import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import { appConfig } from '../config/appConfig.js';

// ── Resolve uploads directory ──────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Saves to:  E:\Blog\uploads\  (two levels up from src/controllers/)
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Create folder if it doesn't exist on first run
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Created uploads directory:', UPLOADS_DIR);
}

// ── Multer disk storage ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),

  filename: (req, file, cb) => {
    // Unique filename:  timestamp-randomhex.ext
    const ext      = path.extname(file.originalname).toLowerCase();
    const unique   = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    cb(null, unique);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)'));
  },
});

// ── Helpers ────────────────────────────────────────────────────────────

// Build the public URL for a stored file
const buildUrl = (req, filename) => {
  const configuredBase = appConfig.apiBaseUrl;
  const fallbackBase = `${req.protocol}://${req.get('host')}`;
  const base = configuredBase || fallbackBase;
  return `${base.replace(/\/$/, '')}/uploads/${filename}`;
};

// ── Upload ─────────────────────────────────────────────────────────────
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const url = buildUrl(req, req.file.filename);

    const { rows } = await pool.query(
      `INSERT INTO media
         (filename, original_name, url, public_id, file_type, size, uploader_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.file.filename,       // stored filename  (unique)
        req.file.originalname,   // original name the user uploaded
        url,                     // full public URL
        req.file.filename,       // public_id = filename (used for deletion)
        req.file.mimetype,
        req.file.size,
        req.user.id,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── List all media ─────────────────────────────────────────────────────
export const getMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `SELECT m.*, u.name AS uploader_name
       FROM media m
       LEFT JOIN users u ON u.id = m.uploader_id
       ORDER BY m.uploaded_at DESC
       LIMIT $1 OFFSET $2`,
      [Number(limit), Number(offset)]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Delete ─────────────────────────────────────────────────────────────
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM media WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Media not found' });

    const mediaUrl = rows[0].url;

    // Check if this image is referenced in any live (non-deleted) post
    const { rows: usages } = await pool.query(
      `SELECT id, title FROM posts
       WHERE  deleted_at IS NULL
       AND    (featured_image = $1 OR body LIKE $2 OR body_html LIKE $2)`,
      [mediaUrl, `%${mediaUrl}%`]
    );

    if (usages.length > 0) {
      return res.status(409).json({
        error: 'Image is in use',
        code:  'MEDIA_IN_USE',
        used_in: usages.map(p => ({ id: p.id, title: p.title })),
      });
    }

    // Safe to delete — remove physical file then DB row
    const filePath = path.join(UPLOADS_DIR, rows[0].filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM media WHERE id = $1', [id]);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Check usage ────────────────────────────────────────────────────────
// GET /api/media/:id/usage  — returns { in_use: bool, used_in: [{id,title}] }
export const checkMediaUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: media } = await pool.query('SELECT url FROM media WHERE id = $1', [id]);
    if (!media[0]) return res.status(404).json({ error: 'Media not found' });

    const { rows: usages } = await pool.query(
      `SELECT id, title FROM posts
       WHERE  deleted_at IS NULL
       AND    (featured_image = $1 OR body LIKE $2 OR body_html LIKE $2)`,
      [media[0].url, `%${media[0].url}%`]
    );

    res.json({ in_use: usages.length > 0, used_in: usages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
