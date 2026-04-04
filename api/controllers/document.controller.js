import Document from "../models/document.model.js";
import { errorHandler } from "../utils/error.js";

export const createDocument = async (req, res, next) => {
  try {
    const newDoc = new Document({
      title: "Untitled Document",
      owner: req.user.id, 
    });
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({
      $or: [
        { owner: req.user.id },
        { "collaborators.userId": req.user.id },
      ],
    })
      .populate("owner", "username email profilePicture")
      .sort({ updatedAt: -1 }); 

    res.status(200).json(docs);
  } catch (err) {
    next(err);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("owner", "username email profilePicture")
      .populate("collaborators.userId", "username email profilePicture");

    if (!doc) return next(errorHandler(404, "Document not found"));

    const isOwner = doc.owner._id.toString() === req.user.id;
    const isCollaborator = doc.collaborators.some(
      (c) => c.userId._id.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return next(errorHandler(403, "You do not have access to this document"));
    }

    res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

export const updateDocumentTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return next(errorHandler(400, "Title cannot be empty"));
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) return next(errorHandler(404, "Document not found"));

    const isOwner = doc.owner.toString() === req.user.id;
    const isEditor = doc.collaborators.some(
      (c) => c.userId.toString() === req.user.id && c.role === "editor"
    );

    if (!isOwner && !isEditor) {
      return next(errorHandler(403, "You do not have permission to rename this document"));
    }

    doc.title = title.trim();
    const updatedDoc = await doc.save();
    res.status(200).json(updatedDoc);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return next(errorHandler(404, "Document not found"));

    if (doc.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Only the owner can delete this document"));
    }

    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateDocumentContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return next(errorHandler(404, "Document not found"));

    const isOwner = doc.owner.toString() === req.user.id;
    const isEditor = doc.collaborators.some(
      (c) => c.userId.toString() === req.user.id && c.role === "editor"
    );
    if (!isOwner && !isEditor) {
      return next(errorHandler(403, "You do not have permission to edit this document"));
    }

    doc.content = content;
    const updatedDoc = await doc.save();
    res.status(200).json(updatedDoc);
  } catch (err) {
    next(err);
  }
};