# 🏗️ SyncDoc Architecture

## System Overview

SyncDoc is a full-stack collaborative document editor with real-time synchronization, AI assistance, and stunning 3D visuals.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                     (React 19 + Vite)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │   3D Hero      │  │   Dashboard    │  │    Editor     │ │
│  │  (Three.js)    │  │     Page       │  │     Page      │ │
│  │                │  │                │  │               │ │
│  │ • Sphere       │  │ • Documents    │  │ • TipTap      │ │
│  │ • Particles    │  │ • Grid View    │  │ • Toolbar     │ │
│  │ • Rings        │  │ • Search       │  │ • AI Panel    │ │
│  │ • Documents    │  │ • Create New   │  │ • Chat        │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Redux Store (State Management)           │  │
│  │  • User State  • Theme State  • Redux Persist        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
         HTTP/REST API              WebSocket/Yjs
                │                           │
        ┌───────▼───────┐          ┌────────▼────────┐
        │               │          │                 │
        │  Express API  │          │  HocusPocus     │
        │   Port 3000   │          │    Port 1234    │
        │               │          │                 │
        └───────┬───────┘          └────────┬────────┘
                │                           │
    ┌───────────┴───────────────────────────┴──────────────┐
    │                    SERVER SIDE                         │
    │              (Node.js + Express)                       │
    ├────────────────────────────────────────────────────────┤
    │                                                         │
    │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
    │  │    Routes    │  │ Controllers  │  │   Models    │ │
    │  │              │  │              │  │             │ │
    │  │ • /api/auth  │  │ • Auth       │  │ • User      │ │
    │  │ • /api/docs  │  │ • Document   │  │ • Document  │ │
    │  │ • /api/ai    │  │ • AI         │  │ • Message   │ │
    │  │ • /api/msg   │  │ • Message    │  │             │ │
    │  └──────────────┘  └──────────────┘  └─────────────┘ │
    │                                                         │
    │  ┌──────────────────────────────────────────────────┐ │
    │  │              Middleware & Utils                   │ │
    │  │  • JWT Verification  • Error Handling            │ │
    │  │  • Cloudinary Setup  • CORS Config               │ │
    │  └──────────────────────────────────────────────────┘ │
    │                                                         │
    └───────────┬─────────────────┬─────────────────────────┘
                │                 │
        ┌───────▼───────┐ ┌──────▼──────────┐
        │               │ │                  │
        │   MongoDB     │ │  Google Gemini   │
        │   Database    │ │   AI Service     │
        │               │ │  (Gemini 2.0)    │
        │ • Users       │ │                  │
        │ • Documents   │ │ • Summarize      │
        │ • Messages    │ │ • Grammar        │
        │               │ │ • Custom AI      │
        └───────────────┘ └──────────────────┘
                
         ┌───────────────┐
         │               │
         │  Cloudinary   │
         │  CDN Service  │
         │               │
         │ • Images      │
         │ • Files       │
         │ • Avatars     │
         └───────────────┘
```

## Data Flow

### 1. Document Creation Flow
```
User → Dashboard → POST /api/documents → MongoDB
                                       ↓
                    Response with new document ID
                                       ↓
            Redirect to Editor → Load document
```

### 2. Real-time Collaboration Flow
```
User A types → Yjs CRDT → HocusPocus Server → Broadcast
                                               ↓
              User B ← WebSocket ← Yjs Provider ← Update
```

### 3. AI Assistance Flow
```
User → AI Panel → POST /api/ai/:docId/stream
                         ↓
         Extract document content from MongoDB
                         ↓
         Send to Google Gemini 2.0 Flash
                         ↓
         Stream response via SSE (Server-Sent Events)
                         ↓
         Display in real-time to user
```

### 4. Chat Message Flow
```
User → Chat Input → Socket.io Emit
                         ↓
            Save to MongoDB (Message model)
                         ↓
         Broadcast to all users in document room
                         ↓
         Other users receive via Socket.io
```

### 5. File Upload Flow
```
User → Select File → Multer Middleware → Cloudinary
                                          ↓
                        Generate URL and metadata
                                          ↓
                    Save message with file URL to MongoDB
                                          ↓
                        Broadcast via Socket.io
                                          ↓
                    Display in chat with preview
```

## Component Architecture

### Frontend Component Hierarchy

```
App.jsx
├── ThemeProvider
│   └── RouterProvider
│       ├── Topbar (navigation)
│       │   ├── Logo
│       │   ├── Theme Toggle
│       │   └── User Menu
│       │
│       ├── Home Page
│       │   ├── Hero3D (3D Scene)
│       │   │   ├── DistortedSphere
│       │   │   ├── FloatingDocuments
│       │   │   ├── GlowingRings
│       │   │   ├── Particles
│       │   │   ├── Environment
│       │   │   └── OrbitControls
│       │   ├── Features Section
│       │   └── CTA Section
│       │
│       ├── Dashboard Page
│       │   ├── Document Grid
│       │   ├── Create Button
│       │   └── Document Cards
│       │
│       ├── Editor Page
│       │   ├── EditorToolbar
│       │   │   ├── Format Buttons
│       │   │   ├── Save Indicator
│       │   │   └── Share Button
│       │   ├── TipTap Editor
│       │   │   ├── Collaboration Extension
│       │   │   ├── Cursor Extension
│       │   │   └── Character Count
│       │   ├── AiPanel (sidebar)
│       │   │   ├── Action Buttons
│       │   │   ├── Custom Prompt Input
│       │   │   └── Response Display
│       │   └── ChatSidebar
│       │       ├── Message List
│       │       ├── File Previews
│       │       └── Input Form
│       │
│       ├── Login Page
│       ├── Register Page
│       └── Footer
```

## API Endpoint Architecture

### Authentication Endpoints
```
POST   /api/auth/register      Create new user account
POST   /api/auth/login         Login and receive JWT cookie
POST   /api/auth/logout        Clear authentication cookie
```

### Document Endpoints
```
POST   /api/documents              Create new document
GET    /api/documents              Get all user's documents
GET    /api/documents/:id          Get single document
PUT    /api/documents/:id/title    Update document title
PUT    /api/documents/:id/content  Save document content
DELETE /api/documents/:id          Delete document
```

### Collaborator Endpoints
```
POST   /api/documents/:id/collaborators          Add collaborator
PUT    /api/documents/:id/collaborators/:userId  Update role
DELETE /api/documents/:id/collaborators/:userId  Remove collaborator
```

### Message Endpoints
```
GET    /api/messages/:documentId          Get chat history
POST   /api/messages/:documentId          Send text message
POST   /api/messages/:documentId/upload   Upload and share file
```

### AI Endpoints
```
POST   /api/ai/:documentId/stream    Stream AI assistance
  Body: { 
    action: "summarize" | "grammar" | "custom",
    customPrompt: "string (for custom action)"
  }
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Document Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: Object (TipTap JSON),
  owner: ObjectId (ref: User),
  collaborators: [{
    userId: ObjectId (ref: User),
    role: String (enum: ['viewer', 'editor']),
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Document),
  senderId: ObjectId (ref: User),
  text: String,
  fileUrl: String (optional),
  fileType: String (optional),
  createdAt: Date
}
```

## Technology Stack Breakdown

### Frontend Core
- **React 19.1.1**: UI framework with latest features
- **Vite 7.1.2**: Ultra-fast build tool and dev server
- **React Router 7.8.2**: Client-side routing

### 3D Graphics
- **Three.js 0.186.1**: 3D rendering engine
- **@react-three/fiber 9.8.1**: React renderer for Three.js
- **@react-three/drei 10.7.9**: Helper components

### State Management
- **Redux Toolkit 2.9.0**: State management
- **Redux Persist 6.0.0**: Persist state to localStorage
- **React Redux 9.2.0**: React bindings

### Styling
- **Tailwind CSS 4.1.12**: Utility-first CSS
- **Flowbite React 0.12.7**: Component library

### Editor
- **TipTap 2.27.2**: Headless rich text editor
- **Yjs 13.6.30**: CRDT for collaboration
- **@hocuspocus/provider 3.4.4**: Yjs provider

### Backend Core
- **Node.js**: JavaScript runtime
- **Express 5.1.0**: Web framework
- **MongoDB 8.23.0**: NoSQL database
- **Mongoose 8.23.0**: ODM for MongoDB

### Real-time
- **Socket.io 4.8.3**: WebSocket library
- **@hocuspocus/server 3.4.4**: Collaboration backend

### AI
- **@google/genai 2.29.1**: Google Gemini SDK
- **Gemini 2.0 Flash**: AI model

### Authentication & Security
- **JWT 9.0.3**: JSON Web Tokens
- **bcryptjs 3.0.2**: Password hashing
- **cookie-parser 1.4.7**: Parse cookies

### File Management
- **Cloudinary 1.41.3**: Cloud storage
- **Multer 2.1.1**: File upload handling

## Security Architecture

### Authentication Flow
```
1. User registers/logs in
2. Server hashes password with bcrypt
3. Server generates JWT token
4. Token stored in HTTP-only cookie
5. Client includes cookie in requests
6. Server verifies token on protected routes
```

### Authorization Levels
```
Document Owner
└── Can do everything
    └── Delete document
    └── Manage collaborators
    └── Edit content
    └── View

Document Editor
└── Can edit and use features
    └── Edit content
    └── Use AI
    └── Send messages
    └── Rename document

Document Viewer
└── Can only view
    └── Read content
    └── View messages
    └── Use read-only AI (summarize)
```

### API Security
- JWT token verification middleware
- Role-based access control
- Input validation
- XSS protection
- CORS configuration
- Environment variables for secrets

## Performance Optimizations

### Frontend
1. **Code Splitting**: Routes loaded on demand
2. **Lazy Loading**: Components loaded when needed
3. **Memoization**: React.memo for expensive components
4. **Debouncing**: Editor save operations
5. **Virtual DOM**: React's efficient updates
6. **3D Optimization**: Instancing, LOD, efficient shaders

### Backend
1. **Database Indexing**: Fast queries
2. **Connection Pooling**: Efficient DB connections
3. **Caching Ready**: Redis integration points
4. **Compression**: Gzip/Brotli ready
5. **Efficient Queries**: Populate only needed fields

### Real-time
1. **Delta Syncing**: Yjs sends only changes
2. **Binary Protocol**: Efficient WebSocket encoding
3. **Room Isolation**: Separate document spaces
4. **Connection Pooling**: Reuse connections

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (JWT in cookies)
- Session store ready (Redis)
- Load balancer ready
- CDN for static assets (Cloudinary)

### Database Scaling
- MongoDB sharding ready
- Read replicas support
- Index optimization
- Query optimization

### Real-time Scaling
- Socket.io adapter for multiple servers
- Redis pub/sub for cross-server events
- Room-based isolation

## Deployment Architecture

### Production Setup (Recommended)
```
┌──────────────────────────────────────────┐
│         Load Balancer (Nginx)            │
│    (SSL Termination, Static Files)       │
└────────────┬────────────────────┬────────┘
             │                    │
    ┌────────▼────────┐  ┌────────▼────────┐
    │  Frontend (CDN) │  │  API Servers    │
    │    (Vite Build) │  │  (Node.js x N)  │
    └─────────────────┘  └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
          ┌─────────▼──────┐          ┌──────────▼─────────┐
          │  MongoDB Atlas │          │  Cloudinary CDN    │
          │  (Replica Set) │          │  (Media Storage)   │
          └────────────────┘          └────────────────────┘
                    │
          ┌─────────▼──────────┐
          │  Google Cloud      │
          │  (Gemini API)      │
          └────────────────────┘
```

## Development Workflow

### Local Development
```
1. Start MongoDB (local or Atlas)
2. Start backend: cd api && npm run dev
3. Start frontend: cd client && npm run dev
4. Access at http://localhost:5173
```

### Production Build
```
1. Build frontend: cd client && npm run build
2. Serve static files with nginx
3. Run backend: cd api && npm start
4. Use PM2 for process management
```

## Monitoring & Logging (Recommended)

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)

### Logging
- Winston for structured logging
- Log aggregation (ELK Stack)
- Real-time alerts (PagerDuty)

## Backup Strategy (Recommended)

### Database
- Automated daily backups (MongoDB Atlas)
- Point-in-time recovery
- Cross-region replication

### Media Files
- Cloudinary automatic backups
- Versioning enabled
- Disaster recovery plan

---

## 🔍 Key Architectural Decisions

### Why Three.js for 3D?
- Industry standard
- Great React integration (R3F)
- Excellent performance
- Large community

### Why Yjs for Collaboration?
- CRDT ensures conflict-free merges
- Offline support
- Efficient binary protocol
- Battle-tested

### Why Gemini 2.0?
- Latest AI capabilities
- Fast streaming responses
- Good context understanding
- Cost-effective

### Why MongoDB?
- Flexible schema for documents
- Good performance
- Easy horizontal scaling
- Rich query capabilities

---

**Architecture designed for scalability, performance, and maintainability** 🏗️
