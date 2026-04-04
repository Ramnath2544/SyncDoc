import { GoogleGenerativeAI } from '@google/generative-ai';
import Document from '../models/document.model.js';
import { errorHandler } from '../utils/error.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (node.content) return node.content.map(extractText).join(' ');
  return '';
}

export const streamAI = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { action } = req.body;
    const { customPrompt } = req.body;

    const doc = await Document.findById(documentId);
    if (!doc) return next(errorHandler(404, 'Document not found'));

    const isOwner = doc.owner.toString() === req.user.id;
    const isCollaborator = doc.collaborators.some(
      (c) => c.userId.toString() === req.user.id,
    );
    if (!isOwner && !isCollaborator) {
      return next(errorHandler(403, 'Access denied'));
    }

    const docText =
      extractText(doc.content) || 'The document is currently empty.';

    let prompt = '';
    if (action === 'summarize') {
      prompt = `Please provide a clear, concise summary of the following document in 3-5 bullet points. Focus on the key ideas and main takeaways.\n\nDocument:\n${docText}`;
    } else if (action === 'grammar') {
      prompt = `Please review the following document and fix all grammar, spelling, punctuation, and tone issues. Return the corrected version with a brief note about what was changed.\n\nDocument:\n${docText}`;
    } else if (action === 'custom' && customPrompt) {
      prompt = `You are a helpful writing assistant. Here is a document:\n\n${docText}\n\nUser request: ${customPrompt}`;
    } else {
      return next(errorHandler(400, 'Invalid action'));
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } else {
      next(err);
    }
  }
};
