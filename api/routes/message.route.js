import express from 'express';
import { getMessages, saveMessage } from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/:documentId', verifyToken, getMessages);
router.post('/:documentId', verifyToken, saveMessage);

export default router;