# SyncDoc

SyncDoc is a full-stack collaborative document editor built with the MERN stack. It combines real-time rich-text collaboration, document chat with file uploads, AI-assisted writing tools, and role-based access control in a single workspace.

## Features

- Real-time collaborative editing with Tiptap, Yjs, and Hocuspocus
- Document-specific chat with text, image, and file sharing
- Role-based access control for owners, editors, and viewers
- Google Gemini-powered document actions over SSE streaming
- JWT authentication with persisted client-side session state
- Responsive React UI built with Tailwind CSS and Flowbite React

## Tech Stack

**Frontend**

- React + Vite
- Tailwind CSS
- Flowbite React
- Redux Toolkit + Redux Persist
- Tiptap
- Yjs
- Socket.IO Client

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.IO
- Hocuspocus
- Cloudinary + Multer
- Google Generative AI SDK

## Project Structure

```text
SyncDoc/
|-- api/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- collaboration.js
|   |-- index.js
|   `-- package.json
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- redux/
|   |   `-- utils/
|   `-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Cloudinary account
- Google Gemini API key

### 1. Install dependencies

Install backend dependencies:

```bash
cd api
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

### 2. Configure environment variables

Create an `.env` file inside `api/` with these values:

```env
MONGO=mongodb+srv://<user>:<password>@cluster.mongodb.net/syncdoc
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### 3. Run the app

Start the backend from `api/`:

```bash
npm run dev
```

Start the frontend from `client/`:

```bash
npm run dev
```

### 4. Local ports

- Frontend: `http://localhost:5173`
- API server: `http://localhost:3000`
- Collaboration server: `ws://localhost:1234`

## API Overview

### Authentication

- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Log in and receive an auth cookie
- `POST /api/auth/logout` - Clear the auth cookie

### User

- `GET /api/user/test` - Test route

### Documents

- `POST /api/documents` - Create a new document
- `GET /api/documents` - List documents owned by or shared with the user
- `GET /api/documents/:id` - Get a single document with collaborators
- `PUT /api/documents/:id/title` - Rename a document
- `PUT /api/documents/:id/content` - Save document content
- `DELETE /api/documents/:id` - Delete a document

### Collaborators

- `POST /api/documents/:id/collaborators` - Invite a collaborator by email
- `PUT /api/documents/:id/collaborators/:userId` - Change collaborator role
- `DELETE /api/documents/:id/collaborators/:userId` - Remove a collaborator or leave a document

### Messages

- `GET /api/messages/:documentId` - Fetch chat history for a document
- `POST /api/messages/:documentId` - Send a text message
- `POST /api/messages/:documentId/upload` - Upload a file and send it into chat

### AI

- `POST /api/ai/:documentId/stream` - Stream AI output for `summarize`, `grammar`, or `custom` actions

## Real-Time Services

- Socket.IO server runs on `http://localhost:3000`
- Hocuspocus collaboration server runs on `ws://localhost:1234`

## Access Model

- `owner`: Full access, including document deletion and collaborator management
- `editor`: Can edit document content and rename the document
- `viewer`: Can access shared documents in read-only mode

## Notes

- The repository contains separate `api/` and `client/` apps. There is no root `package.json`.
- The frontend uses Vite proxying for `/api` requests and collaboration WebSocket traffic during local development.
- Chat transport uses Socket.IO, while document collaboration uses Yjs through Hocuspocus.

## Future Improvements

- Export documents as PDF, DOCX, or Markdown
- Add document version history and restore points
- Organize documents with folders or tags

## Contributing

Fork the repository, create a feature branch, and open a pull request. If the change is large, open an issue first to discuss the approach.

## Contact

For support or questions, open an issue or contact `ramnath2544@gmail.com`.
