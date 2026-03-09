import slugify from 'slugify';
import pool from '../db.js';

export const getCategories = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  res.json(rows);
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const { rows } = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *',
      [name, slug, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTags = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tags ORDER BY name ASC');
  res.json(rows);
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const { rows } = await pool.query(
      'INSERT INTO tags (name, slug) VALUES ($1,$2) ON CONFLICT (slug) DO UPDATE SET name = $1 RETURNING *',
      [name, slug]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    await pool.query('DELETE FROM tags WHERE id = $1', [req.params.id]);
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};