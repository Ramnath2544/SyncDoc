import express from "express";
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocumentContent,
  updateDocumentTitle,
  deleteDocument,
} from "../controllers/document.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// All document routes are protected
router.post("/", verifyToken, createDocument);
router.get("/", verifyToken, getDocuments);
router.get("/:id", verifyToken, getDocument);
router.put("/:id/title", verifyToken, updateDocumentTitle);
router.delete("/:id", verifyToken, deleteDocument);
router.put("/:id/content", verifyToken, updateDocumentContent);

export default router;