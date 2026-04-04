import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    fileUrl: {
      type: String,   // Cloudinary URL (for file uploads — Checkpoint 25)
      default: null,
    },
    fileType: {
      type: String,   // "image" | "file"
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;