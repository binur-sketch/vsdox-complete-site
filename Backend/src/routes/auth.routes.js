import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refresh);   // POST /api/auth/refresh  — no auth header needed

// Protected
router.post('/logout',          protect, logout);
router.get ('/me',              protect, getMe);
router.put ('/profile',         protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;