import express from 'express';
import { uploadMedia, getMedia, deleteMedia, upload } from '../controllers/media.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('image'), uploadMedia);
router.get('/', getMedia);
router.delete('/:id', deleteMedia);

export default router;