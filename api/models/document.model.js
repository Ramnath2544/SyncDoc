import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["editor", "viewer"], // owner is stored separately
      default: "viewer",
    },
  },
  { _id: false } // Don't create a separate _id for each collaborator entry
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
      trim: true,
      maxlength: 200,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Stores Tiptap/Yjs JSON
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
  },
  { timestamps: true } 
);

const Document = mongoose.model("Document", documentSchema);
export default Document;