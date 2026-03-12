import crypto from 'crypto';
import pool from '../db.js';
import { appConfig } from '../config/appConfig.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const createPasswordResetRequest = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + (appConfig.passwordResetExpiryMinutes * 60 * 1000));

  await pool.query(
    `INSERT INTO password_reset_requests (user_id, token_hash, expires_at)
     VALUES ($1,$2,$3)`,
    [userId, tokenHash, expiresAt],
  );

  return { token, expires_at: expiresAt.toISOString() };
};

export const consumePasswordResetToken = async (token) => {
  const tokenHash = hashToken(token);
  const { rows } = await pool.query(
    `SELECT id, user_id
     FROM password_reset_requests
     WHERE token_hash = $1 AND used = FALSE AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );

  if (!rows[0]) return null;

  await pool.query('UPDATE password_reset_requests SET used = TRUE WHERE id = $1', [rows[0].id]);
  return rows[0].user_id;
};

export const hasActiveResetRequest = async (userId) => {
  const { rows } = await pool.query(
    `SELECT 1
     FROM password_reset_requests
     WHERE user_id = $1 AND used = FALSE AND expires_at > NOW()
     LIMIT 1`,
    [userId],
  );
  return rows.length > 0;
};
