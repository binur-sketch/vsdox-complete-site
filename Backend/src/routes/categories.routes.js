import express from 'express';
import {
  getCategories, createCategory, deleteCategory,
  getTags, createTag, deleteTag
} from '../controllers/categories.controller.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', protect, createCategory);
router.delete('/categories/:id', protect, requireRole('admin', 'editor'), deleteCategory);

router.get('/tags', getTags);
router.post('/tags', protect, createTag);
router.delete('/tags/:id', protect, requireRole('admin', 'editor'), deleteTag);

export default router;