import bcrypt       from 'bcryptjs';
import jwt          from 'jsonwebtoken';
import crypto       from 'crypto';
import pool         from '../db.js';

// ── Helpers ────────────────────────────────────────────────────────────

// Short-lived JWT — just an access ticket; sessions DB is the real authority
const JWT_TTL = process.env.JWT_TTL || '15m';

// Idle timeout in seconds (env: SESSION_IDLE_TIMEOUT, default 30 min)
const idleTimeoutSec = () =>
  parseInt(process.env.SESSION_IDLE_TIMEOUT || '1800', 10);

// Absolute hard session cap (env: SESSION_MAX_AGE, default 24 h)
const maxAgeSec = () =>
  parseInt(process.env.SESSION_MAX_AGE || '86400', 10);

const signJwt = (userId, sessionId) =>
  jwt.sign(
    { id: userId, sid: sessionId },
    process.env.JWT_SECRET,
    { expiresIn: JWT_TTL }
  );

const makeSessionToken = () => crypto.randomBytes(40).toString('hex');

// Create a session row and return a signed JWT + the opaque session token
const createSession = async (userId, meta = {}) => {
  const sessionToken = makeSessionToken();
  const idleSec      = idleTimeoutSec();
  const hardExpiry   = new Date(Date.now() + maxAgeSec() * 1000);

  const { rows } = await pool.query(
    `INSERT INTO sessions
       (user_id, session_token, idle_timeout, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, sessionToken, idleSec, hardExpiry, meta.userAgent || null, meta.ip || null]
  );

  const jwt_token = signJwt(userId, rows[0].id);
  return { jwt_token, session_token: sessionToken, expires_at: hardExpiry };
};

// ── Register ───────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'author' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows[0]) return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role, avatar_url, bio, created_at`,
      [name, email, password_hash, role]
    );

    const session = await createSession(rows[0].id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.status(201).json({
      token:         session.jwt_token,
      session_token: session.session_token,
      expires_at:    session.expires_at,
      user:          rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Login ──────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const session = await createSession(user.id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    const { password_hash, ...safeUser } = user;
    res.json({
      token:         session.jwt_token,       // short-lived JWT (15 min)
      session_token: session.session_token,   // opaque refresh token
      expires_at:    session.expires_at,      // hard session expiry
      idle_timeout:  idleTimeoutSec(),        // inform client of idle window
      user:          safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Refresh ── silently extend session, issue new JWT ─────────────────
// Called by frontend when JWT expires (401 TOKEN_EXPIRED) while session is active
export const refresh = async (req, res) => {
  try {
    const { session_token } = req.body;
    if (!session_token)
      return res.status(400).json({ error: 'session_token required', code: 'NO_SESSION' });

    const { rows } = await pool.query(
      `SELECT s.*, u.id AS uid, u.name, u.email, u.role, u.avatar_url, u.bio
       FROM   sessions s
       JOIN   users    u ON u.id = s.user_id
       WHERE  s.session_token = $1`,
      [session_token]
    );
    const session = rows[0];

    if (!session)
      return res.status(401).json({ error: 'Session not found. Please log in.', code: 'SESSION_NOT_FOUND' });

    // Hard expiry check
    if (new Date() > new Date(session.expires_at))
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'SESSION_EXPIRED' });

    // Idle timeout check — has it been more than idle_timeout seconds since last_active?
    const idleSec    = session.idle_timeout;
    const lastActive = new Date(session.last_active);
    const idleMs     = idleSec * 1000;
    if (Date.now() - lastActive.getTime() > idleMs)
      return res.status(401).json({ error: `Idle timeout (${idleSec / 60} min). Please log in again.`, code: 'SESSION_IDLE' });

    // Slide last_active
    await pool.query(
      'UPDATE sessions SET last_active = NOW() WHERE id = $1',
      [session.id]
    );

    const new_jwt = signJwt(session.uid, session.id);
    res.json({
      token:        new_jwt,
      idle_timeout: idleSec,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Logout — destroy session instantly ────────────────────────────────
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'No token provided' });

    // Decode to get session id (sid) without re-verifying — protect already verified
    const decoded = jwt.decode(token);

    // Delete the session — this instantly invalidates the session_token too
    if (decoded?.sid) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [decoded.sid]);
    }

    // Also blacklist the JWT itself so it can't be used for the remaining TTL window
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000); // fallback 15 min

    await pool.query(
      'INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [token, expiresAt]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get current user ───────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Update profile ─────────────────────────────────────────────────────
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
      [name, bio, avatar_url, req.user.id]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Change password ────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res.status(400).json({ error: 'Both current and new password are required' });
    if (new_password.length < 8)
      return res.status(400).json({ error: 'New password must be at least 8 characters' });

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const password_hash = await bcrypt.hash(new_password, 12);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, req.user.id]
    );
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};