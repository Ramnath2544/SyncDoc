import express from 'express';
import {
  getMessages,
  saveMessage,
  uploadFile,
} from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/:documentId', verifyToken, getMessages);
router.post('/:documentId', verifyToken, saveMessage);
router.post(
  '/:documentId/upload',
  verifyToken,
  upload.single('file'),
  uploadFile,
);

export default router;
