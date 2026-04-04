import express from "express";
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocumentTitle,
  updateDocumentContent,
  deleteDocument,
  addCollaborator,          // <-- Add
  updateCollaboratorRole,   // <-- Add
  removeCollaborator,       // <-- Add
} from "../controllers/document.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createDocument);
router.get("/", verifyToken, getDocuments);
router.get("/:id", verifyToken, getDocument);
router.put("/:id/title", verifyToken, updateDocumentTitle);
router.put("/:id/content", verifyToken, updateDocumentContent);
router.delete("/:id", verifyToken, deleteDocument);

router.post("/:id/collaborators", verifyToken, addCollaborator);
router.put("/:id/collaborators/:userId", verifyToken, updateCollaboratorRole);
router.delete("/:id/collaborators/:userId", verifyToken, removeCollaborator);

export default router;