import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authConfig } from '../config/appConfig.js';

const JWT_TTL = authConfig.jwtTtl;

export const idleTimeoutSec = () => authConfig.sessionIdleTimeout;

export const maxAgeSec = () => authConfig.sessionMaxAge;

const makeSessionToken = () => crypto.randomBytes(40).toString('hex');

export const signJwt = (userId, sessionId) =>
  jwt.sign(
    { id: userId, sid: sessionId },
    authConfig.jwtSecret,
    { expiresIn: JWT_TTL },
  );

export const createSession = async (userId, meta = {}) => {
  const sessionToken = makeSessionToken();
  const hardExpiry = new Date(Date.now() + maxAgeSec() * 1000);
  const idleSec = idleTimeoutSec();

  const { rows } = await pool.query(
    `INSERT INTO sessions
       (user_id, session_token, idle_timeout, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, sessionToken, idleSec, hardExpiry, meta.userAgent || null, meta.ip || null],
  );

  return {
    jwtToken: signJwt(userId, rows[0].id),
    sessionToken,
    expiresAt: hardExpiry,
    idleTimeout: idleSec,
  };
};

export const fetchSessionWithUserByToken = async (sessionToken) => {
  const { rows } = await pool.query(
    `SELECT s.*, u.id AS uid, u.name, u.email, u.role, u.avatar_url, u.bio
     FROM   sessions s
     JOIN   users    u ON u.id = s.user_id
     WHERE  s.session_token = $1`,
    [sessionToken],
  );
  return rows[0] || null;
};

export const fetchSessionById = async (sessionId) => {
  const { rows } = await pool.query(
    `SELECT id, user_id, last_active, idle_timeout, expires_at
     FROM   sessions
     WHERE  id = $1`,
    [sessionId],
  );
  return rows[0] || null;
};

export const deleteSessionById = (sessionId) =>
  pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);

export const blacklistToken = (token, expiresAt) =>
  pool.query(
    'INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [token, expiresAt],
  );

export const isTokenBlacklisted = async (token) => {
  if (!token) return false;
  const { rows } = await pool.query(
    'SELECT token FROM token_blacklist WHERE token = $1',
    [token],
  );
  return Boolean(rows[0]);
};

export const slideSessionActivity = (sessionId) =>
  pool.query('UPDATE sessions SET last_active = NOW() WHERE id = $1', [sessionId])
    .catch((err) => console.error('Session slide error:', err.message));

export const sessionExpired = (session) =>
  new Date() > new Date(session.expires_at);

export const sessionIdle = (session) => {
  const idleMs = session.idle_timeout * 1000;
  return Date.now() - new Date(session.last_active).getTime() > idleMs;
};
