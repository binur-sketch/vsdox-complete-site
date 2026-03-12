import express from 'express';
import { uploadMedia, getMedia, deleteMedia, checkMediaUsage, upload } from '../controllers/media.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post  ('/upload',    upload.single('image'), uploadMedia);
router.get   ('/',          getMedia);
router.get   ('/:id/usage', checkMediaUsage);   // GET /api/media/:id/usage
router.delete('/:id',       deleteMedia);        // DELETE /api/media/:id

export default router;