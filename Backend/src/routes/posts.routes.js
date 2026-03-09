import express from 'express';
import {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  withdrawPost,
  getRevisions,
  getPostPreview,
} from '../controllers/posts.controller.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Admin routes FIRST (must come before /:slug to avoid conflict) ────
router.get   ('/admin/all',           protect, getAllPosts);
router.post  ('/admin',               protect, createPost);
router.put   ('/admin/:id',           protect, updatePost);
router.patch ('/admin/:id/publish',   protect, publishPost);
router.patch ('/admin/:id/withdraw',  protect, withdrawPost);
router.delete('/admin/:id',           protect, requireRole('admin', 'editor'), deletePost);
router.get   ('/admin/:id/revisions', protect, getRevisions);
router.get   ('/admin/:id/preview',   protect, getPostPreview);

// ── Public routes AFTER (/:slug would swallow /admin/* if registered first) ──
router.get('/',      getPublishedPosts);  // GET /api/posts?page=&limit=&search=
router.get('/:slug', getPostBySlug);      // GET /api/posts/my-post-slug

export default router;