import Message from '../models/message.model.js';
import Document from '../models/document.model.js';
import { errorHandler } from '../utils/error.js';

export const getMessages = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const doc = await Document.findById(documentId);
    if (!doc) return next(errorHandler(404, 'Document not found'));

    const isOwner = doc.owner.toString() === req.user.id;
    const isCollaborator = doc.collaborators.some(
      (c) => c.userId.toString() === req.user.id
    );
    if (!isOwner && !isCollaborator) {
      return next(errorHandler(403, 'Access denied'));
    }

    const messages = await Message.find({ documentId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: 1 }) 
      .limit(100);            

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const saveMessage = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { text, fileUrl, fileType, fileName } = req.body;

    if (!text && !fileUrl) {
      return next(errorHandler(400, 'Message cannot be empty'));
    }

    const message = new Message({
      documentId,
      sender: req.user.id,
      text,
      fileUrl,
      fileType,
      fileName,
    });

    const saved = await message.save();
    const populated = await saved.populate('sender', 'username profilePicture');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};