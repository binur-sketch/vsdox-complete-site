import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import {
  blacklistToken,
  createSession,
  deleteSessionById,
  fetchSessionWithUserByToken,
  idleTimeoutSec,
  sessionExpired,
  sessionIdle,
  signJwt,
  slideSessionActivity,
} from '../services/auth.service.js';
import {
  createPasswordResetRequest,
  consumePasswordResetToken,
  hasActiveResetRequest,
} from '../services/passwordReset.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'author' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows[0]) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role, avatar_url, bio, created_at`,
      [name, email, password_hash, role],
    );

    const session = await createSession(rows[0].id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.status(201).json({
      token: session.jwtToken,
      session_token: session.sessionToken,
      expires_at: session.expiresAt,
      idle_timeout: session.idleTimeout,
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const session = await createSession(user.id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    const { password_hash, ...safeUser } = user;
    res.json({
      token: session.jwtToken,
      session_token: session.sessionToken,
      expires_at: session.expiresAt,
      idle_timeout: session.idleTimeout,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { session_token } = req.body;
    if (!session_token) {
      return res.status(400).json({ error: 'session_token required', code: 'NO_SESSION' });
    }

    const session = await fetchSessionWithUserByToken(session_token);
    if (!session) {
      return res.status(401).json({ error: 'Session not found. Please log in.', code: 'SESSION_NOT_FOUND' });
    }

    if (sessionExpired(session)) {
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'SESSION_EXPIRED' });
    }

    if (sessionIdle(session)) {
      return res.status(401).json({
        error: `Idle timeout (${session.idle_timeout / 60} min). Please log in again.`,
        code: 'SESSION_IDLE',
      });
    }

    await slideSessionActivity(session.id);
    const newToken = signJwt(session.uid, session.id);

    res.json({
      token: newToken,
      idle_timeout: session.idle_timeout,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    const decoded = jwt.decode(token);
    if (decoded?.sid) {
      await deleteSessionById(decoded.sid);
    }

    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    await blacklistToken(token, expiresAt);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.user.id],
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE users
       SET name       = COALESCE($1, name),
           bio        = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, role, avatar_url, bio`,
      [name, bio, avatar_url, req.user.id],
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const password_hash = await bcrypt.hash(new_password, 12);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, req.user.id],
    );
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!rows[0]) {
      return res.json({
        message: 'If the email exists, you will receive password reset instructions shortly.',
      });
    }

    const { id: userId } = rows[0];
    const alreadyQueued = await hasActiveResetRequest(userId);
    if (alreadyQueued) {
      return res.status(429).json({
        error: 'A reset request is already pending. Please wait until the previous token expires before requesting again.',
      });
    }

    const { token, expires_at } = await createPasswordResetRequest(rows[0].id);
    await sendPasswordResetEmail({
      to: email,
      token,
      expiresAt: expires_at,
    });
    res.json({
      message: 'If the email exists, you will receive password reset instructions shortly.',
      expires_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const userId = await consumePasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, userId],
    );

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
