import Document from "../models/document.model.js";
import { errorHandler } from "../utils/error.js";

// POST /api/documents — Create a new document
export const createDocument = async (req, res, next) => {
  try {
    const newDoc = new Document({
      title: "Untitled Document",
      owner: req.user.id, // comes from verifyToken middleware
    });
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    next(err);
  }
};

// GET /api/documents — Get all docs for current user (owned + collaborated)
export const getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({
      $or: [
        { owner: req.user.id },
        { "collaborators.userId": req.user.id },
      ],
    })
      .populate("owner", "username email profilePicture")
      .sort({ updatedAt: -1 }); // Most recently updated first

    res.status(200).json(docs);
  } catch (err) {
    next(err);
  }
};

// GET /api/documents/:id — Get a single document
export const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("owner", "username email profilePicture")
      .populate("collaborators.userId", "username email profilePicture");

    if (!doc) return next(errorHandler(404, "Document not found"));

    // Check if user has access (owner or collaborator)
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

// PUT /api/documents/:id/title — Rename a document
export const updateDocumentTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return next(errorHandler(400, "Title cannot be empty"));
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) return next(errorHandler(404, "Document not found"));

    // Only owner or editors can rename
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

// DELETE /api/documents/:id — Delete a document (owner only)
export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return next(errorHandler(404, "Document not found"));

    // Only the owner can delete
    if (doc.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Only the owner can delete this document"));
    }

    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    next(err);
  }
};