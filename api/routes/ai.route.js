import express from 'express';
import { streamAI } from '../controllers/ai.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/:documentId/stream', verifyToken, streamAI);

export default router;