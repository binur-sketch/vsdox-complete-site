import jwt  from 'jsonwebtoken';
import pool from '../db.js';
import { authConfig } from '../config/appConfig.js';
import {
  fetchSessionById,
  isTokenBlacklisted,
  sessionExpired,
  sessionIdle,
  slideSessionActivity,
} from '../services/auth.service.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' });

  try {
    if (await isTokenBlacklisted(token))
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'TOKEN_REVOKED' });

    // 2. Verify JWT signature + expiry
    const decoded = jwt.verify(token, authConfig.jwtSecret);

    // 3. Validate the linked session (sid embedded in JWT payload)
    if (decoded.sid) {
      const session = await fetchSessionById(decoded.sid);

      if (!session)
        return res.status(401).json({ error: 'Session ended. Please log in again.', code: 'TOKEN_REVOKED' });

      if (sessionExpired(session))
        return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'SESSION_EXPIRED' });

      if (sessionIdle(session))
        return res.status(401).json({
          error: `Session timed out after ${session.idle_timeout / 60} min of inactivity.`,
          code: 'SESSION_IDLE',
        });

      slideSessionActivity(session.id);
    }

    // 4. Confirm user still exists
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, bio FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!rows[0])
      return res.status(401).json({ error: 'User not found', code: 'USER_NOT_FOUND' });

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired. Please refresh.', code: 'TOKEN_EXPIRED' });
    return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Insufficient permissions', code: 'FORBIDDEN' });
  next();
};
