# 📝 SyncDoc - Real-Time Collaborative Editor

A comprehensive, modern **full-stack collaborative document workspace** built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. 
Supports **real-time multiplayer rich-text editing** (powered by Yjs and Tiptap), **live document-specific chat** with file uploads, **Gemini AI integration** for document insights, dark mode, and precise **role-based collaborator management**.

---

## 📖 Table of Contents

- [Features](#-features)
- [Documentation](#-documentation)
- [Usage (Role-Based Access)](#-usage-role-based-access)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Commit History Highlights](#-commit-history-highlights)
- [Future Enhancements](#️-future-enhancements)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## ✨ Features

### 🖥️ Frontend (React + Tailwind CSS + Flowbite)
- **Modern & Responsive UI:** Built with **Tailwind CSS** and **Flowbite React** for a clean, accessible workspace.
- **Tiptap Editor:** Highly customizable rich-text editor supporting headings, code blocks, formatting, and live character counts.
- **Dark Mode:** Built-in dark/light mode toggle with state persistence for comfortable late-night writing.
- **Global State Management:** Uses **Redux Toolkit** and **Redux Persist** to manage user authentication and theme preferences seamlessly.

### ⚙️ Backend & API (Node.js + Express)
- **Robust API Routing:** Dedicated RESTful routes for Authentication, Documents, Chat Messages, and AI actions.
- **Real-Time WebSockets:** Dual WebSocket implementation using **Socket.io** for live chat and a dedicated **Hocuspocus Server** for Yjs document synchronization.
- **Cloud File Storage:** Integrated **Cloudinary** via Multer to handle profile pictures, image attachments, and file sharing within document chats.

### 🤖 Collaboration & AI 
- **Live Multiplayer Editing:** Real-time presence indicators (colored cursors and user avatars) powered by Yjs.
- **Document Chat:** Sidebar chat specific to each document, allowing users to converse, share images, and upload files while editing.
- **Gemini AI Insights:** Integrated Google Generative AI (`gemini-2.5-flash`) streams real-time responses to summarize documents, fix grammar, or answer custom prompts directly within the editor.

---

## 📚 Documentation
Here is a list of the primary API routes derived from the SyncDoc application structure.

**Authentication Routes**
- `POST /api/auth/register` - Creates a new user account.
- `POST /api/auth/login` - Authenticates a user and sets an `httpOnly` JWT access token.
- `POST /api/auth/logout` - Clears the user's session cookie.

**Document Routes**
- `POST /api/documents` - Creates a new untitled document.
- `GET /api/documents` - Retrieves all documents owned by or shared with the user.
- `GET /api/documents/:id` - Retrieves a specific document and its metadata.
- `PUT /api/documents/:id/title` - Updates the document's title.
- `PUT /api/documents/:id/content` - Auto-saves the Tiptap JSON content state.
- `DELETE /api/documents/:id` - Deletes a document entirely.

**Collaborator Routes**
- `POST /api/documents/:id/collaborators` - Invites a user to a document via email.
- `PUT /api/documents/:id/collaborators/:userId` - Updates a collaborator's role (`editor` or `viewer`).
- `DELETE /api/documents/:id/collaborators/:userId` - Removes a collaborator or allows a user to leave a document.

**Message & Upload Routes**
- `GET /api/messages/:documentId` - Fetches the chat history for a document.
- `POST /api/messages/:documentId` - Sends a text message to the document chat.
- `POST /api/messages/:documentId/upload` - Uploads a file/image to Cloudinary and sends it as a chat message.

**AI Routes**
- `POST /api/ai/:documentId/stream` - Initiates a Server-Sent Events (SSE) stream for Gemini AI actions (summarize, grammar, custom).

**WebSocket Servers**
- `ws://localhost:3000` - Main server (Socket.io for Chat).
- `ws://localhost:1234` - Hocuspocus server (Yjs document synchronization).

---

## 👥 Usage (Role-Based Access)
Document permissions are strictly enforced on both the client and server sides across three tiers:

- **Viewers:** Can read the document content, view live cursors, and read the chat history. They cannot edit content, rename the document, or interact with the AI assistant.
- **Editors:** Can actively edit the document content, utilize the Gemini AI Insights panel, participate in the chat (send text/files), and rename the document.
- **Owners:** The creator of the document. Has all Editor privileges, plus the exclusive ability to invite new collaborators, alter roles, remove users, and delete the document permanently.

---

## 🚀 Tech Stack

**Frontend:** - React.js (Vite)
- Tailwind CSS & Flowbite-React (UI Components)
- Redux Toolkit & Redux Persist (State)
- Tiptap & Yjs (Rich-Text Editor & CRDT logic)
- Socket.io-client (Chat)

**Backend:** - Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- JSON Web Tokens (JWT) & bcryptjs (Security)
- @hocuspocus/server (WebSocket Collaboration backend)
- Google Generative AI SDK (Gemini AI integration)
- Cloudinary & Multer (Storage)

---

## 📂 Project Structure

```text
syncdoc-api/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (EditorToolbar, ChatSidebar, AiPanel, ShareModal)
│   │   ├── pages/              # App routes (Login, Register, Dashboard, Editor)
│   │   ├── redux/              # Redux slices (theme, user)
│   │   └── utils/              # Client-side helpers (random colors for cursors)
│   └── package.json
├── api/                        # Express Backend
│   ├── controllers/            # Business logic (ai, auth, document, message)
│   ├── models/                 # Database Schemas (User, Document, Message)
│   ├── routes/                 # API Endpoints
│   ├── utils/                  # Middleware (JWT verification, Cloudinary setup, Error handling)
│   ├── collaboration.js        # Hocuspocus Yjs Server logic
│   └── index.js                # Main Express server and Socket.io setup
└── package.json                # Server dependencies and scripts

---

🔧 Getting Started
1. Install dependencies
Run this in both your root directory and the client directory.

Bash
npm install
cd client
npm install

---

Variable,Description,Example
MONGO,Database Connection URI,mongodb+srv://<user>:<pwd>@cluster...
JWT_SECRET,Secret for Auth Tokens,supersecret123
CLOUDINARY_CLOUD_NAME,Cloudinary Name,your_cloud_name
CLOUDINARY_API_KEY,Cloudinary API Key,123456789012345
CLOUDINARY_API_SECRET,Cloudinary Secret,abcdefghijklmnopqrstuvwxyz
GEMINI_API_KEY,Google Generative AI Key,AIzaSyB...

---

### 3. Run the development servers

**Backend (Runs Express on 3000, Hocuspocus on 1234):**

```bash
npm run dev

Frontend (Runs Vite on 5173):

```bash
cd client
npm run dev

---

## 📈 Commit History Highlights
- **Foundation:** Initialized Vite React client with Tailwind CSS, Flowbite, and set up the Express/MongoDB backend.
- **Authentication & State:** Implemented Redux Toolkit, Redux Persist, and a custom JWT authentication loop (Register/Login).
- **Dashboard & UI:** Built the Dashboard UI for managing document cards, executing CRUD operations, and implemented global Dark Mode.
- **Collaborative Editor Engine:** Integrated the Tiptap editor shell alongside Yjs and the Hocuspocus server for robust, real-time multiplayer editing and content persistence.
- **Role-Based Collaboration:** Added a secure invite system, allowing document owners to assign Editor or Viewer roles to other registered users via email.
- **Real-Time Communication:** Integrated Socket.io and Cloudinary to create a persistent, document-specific chat sidebar supporting text, images, and file attachments.
- **AI Integration:** Implemented the Google Gemini AI Insights panel, utilizing Server-Sent Events (SSE) to stream real-time grammar corrections and summaries directly into the workspace.

---

## 🛠️ Future Enhancements
- 📄 **Export Options:** Allow users to export documents as PDF, Word, or Markdown files.
- 🕒 **Version History:** Implement snapshotting to allow users to view and restore previous versions of a document.
- 🗂️ **Folders & Organization:** Add the ability to group documents into folders or tag them for easier sorting in the Dashboard.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and open a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact
For support or inquiries, please open an issue or email: [ramnath2544@gmail.com](mailto:ramnath2544@gmail.com).


