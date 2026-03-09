import jwt  from 'jsonwebtoken';
import pool from '../db.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' });

  try {
    // 1. Check token blacklist (tokens blacklisted on logout)
    const blacklisted = await pool.query(
      'SELECT token FROM token_blacklist WHERE token = $1', [token]
    );
    if (blacklisted.rows[0])
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'TOKEN_REVOKED' });

    // 2. Verify JWT signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Validate the linked session (sid embedded in JWT payload)
    if (decoded.sid) {
      const { rows: sessions } = await pool.query(
        `SELECT id, user_id, last_active, idle_timeout, expires_at
         FROM   sessions
         WHERE  id = $1`,
        [decoded.sid]
      );
      const session = sessions[0];

      // Session deleted (logout) → instant rejection
      if (!session)
        return res.status(401).json({ error: 'Session ended. Please log in again.', code: 'TOKEN_REVOKED' });

      // Hard expiry
      if (new Date() > new Date(session.expires_at))
        return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'SESSION_EXPIRED' });

      // Idle timeout — time since last_active exceeds idle_timeout seconds
      const idleMs = session.idle_timeout * 1000;
      if (Date.now() - new Date(session.last_active).getTime() > idleMs)
        return res.status(401).json({
          error: `Session timed out after ${session.idle_timeout / 60} min of inactivity.`,
          code: 'SESSION_IDLE',
        });

      // ✅ Active — slide last_active (fire-and-forget, don't await to keep latency low)
      pool.query('UPDATE sessions SET last_active = NOW() WHERE id = $1', [session.id])
        .catch(err => console.error('Session slide error:', err.message));
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