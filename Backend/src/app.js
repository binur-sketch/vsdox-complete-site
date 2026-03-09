import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

import authRoutes     from './routes/auth.routes.js';
import postsRoutes    from './routes/posts.routes.js';
import mediaRoutes    from './routes/media.routes.js';
import taxonomyRoutes from './routes/categories.routes.js';
import pool           from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded files as static ────────────────────────────────────
// Files in  E:\Blog\uploads\  are served at  http://localhost:5000/uploads/filename.jpg
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api',       taxonomyRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code:  err.code    || 'SERVER_ERROR',
  });
});

// ── Periodic cleanup — every 1 hour ──────────────────────────────────
const runCleanup = async () => {
  try {
    // Remove expired blacklisted tokens
    const { rowCount: bl } = await pool.query(
      'DELETE FROM token_blacklist WHERE expires_at < NOW()'
    );
    // Remove sessions that hit hard expiry OR have been idle past their timeout
    const { rowCount: ses } = await pool.query(
      `DELETE FROM sessions
       WHERE  expires_at < NOW()
       OR     (NOW() - last_active) > (idle_timeout * INTERVAL '1 second')`
    );
    if (bl + ses > 0)
      console.log(`Cleanup: removed ${bl} blacklisted token(s), ${ses} expired session(s)`);
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};
setInterval(runCleanup, 60 * 60 * 1000);
runCleanup();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`VSDox Blog API running on port ${PORT}`);
  console.log(`Uploads served at: http://localhost:${PORT}/uploads/`);
});

export default app;