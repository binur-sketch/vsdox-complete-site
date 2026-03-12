import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Public
router.post('/register', authRateLimiter, register);
router.post('/login',    authRateLimiter, login);
router.post('/forgot-password', authRateLimiter, requestPasswordReset);
router.post('/reset-password',  authRateLimiter, resetPassword);
router.post('/refresh',  authRateLimiter, refresh);   // POST /api/auth/refresh — no auth header needed

// Protected
router.post('/logout',          protect, logout);
router.get ('/me',              protect, getMe);
router.put ('/profile',         protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;
