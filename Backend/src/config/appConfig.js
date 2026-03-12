import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === null || value.trim() === '') {
    if (fallback !== undefined) {
      return typeof fallback === 'string' ? fallback : fallback;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
};

const getNumberEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === null || value.trim() === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing required numeric environment variable: ${key}`);
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

const getOptionalEnv = (key, fallback = '') => {
  const value = process.env[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  return value.trim();
};

const getOptionalNumberEnv = (key, fallback = undefined) => {
  const value = process.env[key];
  if (value === undefined || value === null || value.trim() === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
};

const getBooleanEnv = (key, fallback = false) => {
  const value = process.env[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return fallback;
};

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
];

const configuredOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '').split(','),
].map((origin) => origin?.trim()).filter(Boolean);

export const allowedOrigins = Array.from(new Set([
  ...DEFAULT_ALLOWED_ORIGINS,
  ...configuredOrigins,
]));

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
};

const timezone = getEnv('APP_TIMEZONE', 'Asia/Kolkata');
const timezoneOffsetMinutes = getNumberEnv('APP_TIMEZONE_OFFSET_MINUTES', 330);
const passwordResetExpiryMinutes = getNumberEnv('PASSWORD_RESET_EXPIRY_MINUTES', 60);
const emailHost = getOptionalEnv('EMAIL_HOST');
const emailPort = getOptionalNumberEnv('EMAIL_PORT', 587);
const emailSecure = getBooleanEnv('EMAIL_SECURE', emailPort === 465);
const emailUser = getOptionalEnv('EMAIL_USER');
const emailPass = getOptionalEnv('EMAIL_PASS');
const emailFrom = getOptionalEnv('EMAIL_FROM', 'VSDox <no-reply@vsdox.com>');

export const appConfig = {
  port: getNumberEnv('PORT', 5000),
  apiBaseUrl: getEnv('API_BASE_URL', 'http://localhost:5000'),
  timezone,
  timezoneOffsetMinutes,
  passwordResetExpiryMinutes,
  email: {
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    user: emailUser,
    pass: emailPass,
    from: emailFrom,
  },
};

if (!process.env.TZ) {
  process.env.TZ = timezone;
}

export const dbConfig = {
  connectionString: getEnv('DATABASE_URL'),
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export const authConfig = {
  jwtSecret: getEnv('JWT_SECRET'),
  jwtTtl: getEnv('JWT_TTL', '15m'),
  sessionIdleTimeout: getNumberEnv('SESSION_IDLE_TIMEOUT', 1800),
  sessionMaxAge: getNumberEnv('SESSION_MAX_AGE', 86400),
};

const authRateLimitWindowMinutes = getNumberEnv('AUTH_RATE_LIMIT_WINDOW_MINUTES', 15);
export const rateLimitConfig = {
  auth: {
    windowMs: authRateLimitWindowMinutes * 60 * 1000,
    maxRequests: getNumberEnv('AUTH_RATE_LIMIT_MAX_REQUESTS', 20),
  },
};
