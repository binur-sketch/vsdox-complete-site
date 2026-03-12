import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '../config/appConfig.js';

export const authRateLimiter = rateLimit({
  windowMs: rateLimitConfig.auth.windowMs,
  max: rateLimitConfig.auth.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication requests. Please try again later.',
  },
});
