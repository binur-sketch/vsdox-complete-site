import pool from '../db.js';

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role          VARCHAR(20) DEFAULT 'author',
        avatar_url    TEXT,
        bio           TEXT,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );

      -- Token blacklist (for server-side logout)
      CREATE TABLE IF NOT EXISTS token_blacklist (
        token      TEXT PRIMARY KEY,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires
        ON token_blacklist(expires_at);

      -- Sliding-window sessions (replaces fixed 7d JWT TTL)
      CREATE TABLE IF NOT EXISTS sessions (
        id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        -- session_token is a secret stored client-side (httpOnly cookie or localStorage)
        -- used only for /auth/refresh — NOT the JWT itself
        session_token TEXT     UNIQUE NOT NULL,
        last_active  TIMESTAMP NOT NULL DEFAULT NOW(),
        idle_timeout  INT      NOT NULL DEFAULT 1800, -- seconds, from SESSION_IDLE_TIMEOUT env
        expires_at   TIMESTAMP NOT NULL,              -- hard absolute expiry
        created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        user_agent   TEXT,
        ip_address   TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user      ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token     ON sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires   ON sessions(expires_at);

      -- Categories
      CREATE TABLE IF NOT EXISTS categories (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(100) NOT NULL,
        slug        VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      -- Tags
      CREATE TABLE IF NOT EXISTS tags (
        id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
      );

      -- Posts
      CREATE TABLE IF NOT EXISTS posts (
        id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title              VARCHAR(255) NOT NULL,
        slug               VARCHAR(255) UNIQUE NOT NULL,
        body               TEXT,
        body_html          TEXT,
        excerpt            TEXT,
        status             VARCHAR(20) DEFAULT 'draft',
        author_id          UUID REFERENCES users(id) ON DELETE SET NULL,
        featured_image     TEXT,
        featured_image_alt TEXT,
        meta_title         VARCHAR(255),
        meta_description   TEXT,
        views              INT DEFAULT 0,
        reading_time       INT DEFAULT 0,
        published_at       TIMESTAMP,
        scheduled_at       TIMESTAMP,
        created_at         TIMESTAMP DEFAULT NOW(),
        updated_at         TIMESTAMP DEFAULT NOW(),
        deleted_at         TIMESTAMP
      );

      -- Post relations
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      );

      CREATE TABLE IF NOT EXISTS post_tags (
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        tag_id  UUID REFERENCES tags(id)  ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      );

      -- Post revisions
      CREATE TABLE IF NOT EXISTS post_revisions (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id   UUID REFERENCES posts(id) ON DELETE CASCADE,
        title     TEXT,
        body      TEXT,
        author_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Media
      CREATE TABLE IF NOT EXISTS media (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename      TEXT NOT NULL,
        original_name TEXT,
        url           TEXT NOT NULL,
        public_id     TEXT,
        file_type     VARCHAR(50),
        size          INT,
        alt_text      TEXT,
        uploader_id   UUID REFERENCES users(id),
        uploaded_at   TIMESTAMP DEFAULT NOW()
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_posts_slug         ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_status       ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
    `);

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('DB init error:', err);
  } finally {
    client.release();
    process.exit();
  }
};

initDB();