import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import Document from './models/document.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const hocuspocus = new Server({
  port: 1234,
  timeout: 30000,

  async onAuthenticate({ token }) {
    if (!token) throw new Error('Unauthorized: No token provided');

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user };
    } catch (err) {
      throw new Error('Unauthorized: Invalid token');
    }
  },

  async onLoadDocument({ documentName, context }) {
    const docId = documentName;
    const userId = context.user.id;

    const doc = await Document.findById(docId);
    if (!doc) throw new Error('Document not found');

    const isOwner = doc.owner.toString() === userId;
    const isCollaborator = doc.collaborators.some(
      (c) => c.userId.toString() === userId,
    );

    if (!isOwner && !isCollaborator) {
      throw new Error('Forbidden: You do not have access to this document');
    }
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const doc = await Document.findById(documentName);
        return doc?.yjsState ? Buffer.from(doc.yjsState) : null;
      },
      store: async ({ documentName, state }) => {
        await Document.findByIdAndUpdate(documentName, {
          yjsState: state,
        });
      },
    }),
  ],
});

export default hocuspocus;
