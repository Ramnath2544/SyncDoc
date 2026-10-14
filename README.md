# SyncDoc 🚀

![SyncDoc](https://img.shields.io/badge/SyncDoc-Next--Gen-blue)
![Gemini 2.0](https://img.shields.io/badge/Gemini-2.0-purple)
![Three.js](https://img.shields.io/badge/Three.js-3D-green)
![Real-time](https://img.shields.io/badge/Real--time-Collaboration-orange)

A next-generation collaborative document editor with stunning 3D visuals and AI-powered assistance using Google Gemini 2.0.

## ✨ Features

### 🎨 Impressive 3D UI
- **Interactive 3D Hero Section**: Featuring:
  - Animated distorted sphere with metallic material
  - Floating document models with smooth animations
  - Glowing orbital rings
  - Particle system with 150+ particles
  - Auto-rotating camera with orbit controls
  - Environment reflections for realistic lighting
  - Gradient overlays and glassmorphism effects

### 🤖 Latest Google Gemini SDK Integration
- **Upgraded to `@google/genai`** (Latest Gen AI SDK)
- Powered by **Gemini 2.0 Flash** model
- AI capabilities:
  - Document summarization
  - Grammar and spell checking
  - Custom AI prompts
  - Real-time streaming responses

### 🌐 Real-time Collaboration
- Live document editing with multiple users
- Presence indicators with cursor tracking
- Instant synchronization using Yjs and HocusPocus
- WebSocket-based communication

### 💬 Built-in Chat
- Real-time messaging per document
- File and image sharing via Cloudinary
- Team communication while editing

### ☁️ Cloud Storage
- Cloudinary integration for media
- MongoDB for document persistence
- Secure authentication with JWT

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React version
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Modern utility-first CSS
- **Redux Toolkit** - State management
- **TipTap** - Rich text editor
- **React Router** - Navigation

### Backend
- **Node.js & Express** - Server runtime and framework
- **MongoDB & Mongoose** - Database
- **Socket.io** - WebSocket communication
- **@google/genai** - Latest Google Gen AI SDK for Gemini 2.0
- **HocusPocus** - Real-time collaboration server
- **Yjs** - CRDT for conflict-free editing
- **JWT** - Authentication
- **Cloudinary** - Media management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Required for @google/genai)
- MongoDB
- Google Gemini API Key ([Get it here](https://ai.google.dev/))
- Cloudinary Account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SyncDoc
```

2. **Setup Backend**
```bash
cd api
npm install
```

Create `api/.env`:
```env
MONGO=mongodb+srv://<user>:<password>@cluster.mongodb.net/syncdoc
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:3000
```

4. **Run the Application**

Backend (from `api/` directory):
```bash
npm run dev
```

Frontend (from `client/` directory):
```bash
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Collaboration Server: ws://localhost:1234

## 📦 New Dependencies Added

### Client
```json
{
  "three": "latest version",
  "@react-three/fiber": "latest version",
  "@react-three/drei": "latest version"
}
```

### API
```json
{
  "@google/genai": "latest version"
}
```

## 🎯 3D UI Components

### Hero3D Component Features
Located in `client/src/components/Hero3D.jsx`

1. **DistortedSphere**: Central animated sphere with distortion effects
2. **FloatingDocument**: Animated document models floating in 3D space
3. **GlowingRings**: Orbital rings with emissive materials
4. **Particles**: Dynamic particle system for ambient effects
5. **Environment**: HDR environment for realistic reflections
6. **OrbitControls**: Auto-rotating camera with user interaction

### Customization
- Adjust colors in material properties
- Modify animation speeds in `useFrame` hooks
- Change particle count and distribution
- Customize document positions and scales
- Modify camera angles and FOV

## 🤖 AI Integration - Google Gemini SDK

### Migration from Old to New SDK

**Old SDK** (`@google/generative-ai`):
```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const result = await model.generateContentStream(prompt);
for await (const chunk of result.stream) {
  const text = chunk.text();
}
```

**New SDK** (`@google/genai`):
```javascript
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const result = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-exp',
  contents: prompt,
});
for await (const chunk of result) {
  const text = chunk.text;
}
```

### Benefits of New SDK
- Improved developer experience
- Better TypeScript support
- Simplified API surface
- Support for latest Gemini 2.0 features
- Enhanced error handling

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT cookie
- `POST /api/auth/logout` - Logout and clear cookie

### Documents
- `POST /api/documents` - Create new document
- `GET /api/documents` - Get all user documents
- `GET /api/documents/:id` - Get single document
- `PUT /api/documents/:id/title` - Update document title
- `PUT /api/documents/:id/content` - Save document content
- `DELETE /api/documents/:id` - Delete document

### Collaborators
- `POST /api/documents/:id/collaborators` - Add collaborator
- `PUT /api/documents/:id/collaborators/:userId` - Update role
- `DELETE /api/documents/:id/collaborators/:userId` - Remove collaborator

### Messages
- `GET /api/messages/:documentId` - Get chat messages
- `POST /api/messages/:documentId` - Send text message
- `POST /api/messages/:documentId/upload` - Upload file

### AI Assistance
```
POST /api/ai/:documentId/stream
```

Request body:
```json
{
  "action": "summarize" | "grammar" | "custom",
  "customPrompt": "Your custom prompt here (required for 'custom' action)"
}
```

Response: Server-Sent Events (SSE) stream

## 🎨 UI Highlights

### Home Page
- Full-screen 3D hero section with Three.js
- Glassmorphism card effects
- Animated gradient backgrounds
- Smooth scroll indicator
- Feature cards with hover animations
- Call-to-action sections

### Responsive Design
- Mobile-first approach
- Touch-friendly 3D controls
- Adapts to all screen sizes
- Optimized performance on mobile

## 🔐 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Role-based access control (owner, editor, viewer)
- Environment variable protection
- Secure file uploads via Cloudinary

## 🌟 Performance Optimizations

### Frontend
- Vite for instant HMR
- Code splitting and lazy loading
- Three.js optimizations:
  - Efficient geometry reuse
  - Optimized particle systems
  - Frame rate management
  - WebGL context handling

### Backend
- MongoDB indexing
- Connection pooling
- Response caching where appropriate

## 📱 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 15+ ✅
- Edge 90+ ✅

**Note**: WebGL 2.0 support required for 3D features

## 🏗️ Project Structure

```
SyncDoc/
├── api/
│   ├── controllers/          # Business logic
│   │   ├── ai.controller.js      # Gemini AI integration
│   │   ├── auth.controller.js    # Authentication
│   │   ├── document.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── document.model.js
│   │   └── message.model.js
│   ├── routes/               # API routes
│   ├── utils/                # Utilities
│   ├── collaboration.js      # Yjs/HocusPocus setup
│   ├── index.js              # Express server
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Hero3D.jsx        # NEW: 3D hero section
│   │   │   ├── AiPanel.jsx       # AI assistance UI
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── EditorToolbar.jsx
│   │   │   ├── ShareModal.jsx
│   │   │   └── Topbar.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── Home.jsx          # UPDATED: 3D landing page
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── EditorPage.jsx
│   │   ├── redux/            # State management
│   │   └── utils/            # Helper functions
│   └── package.json
│
└── README.md
```

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Yjs Documentation](https://yjs.dev/)
- [TipTap Editor](https://tiptap.dev/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Yjs](https://yjs.dev/) - CRDT framework for collaboration
- [TipTap](https://tiptap.dev/) - Headless rich text editor
- [HocusPocus](https://tiptap.dev/hocuspocus) - Collaboration backend

## 📞 Support

For issues and questions:
- 📧 Email: ramnath2544@gmail.com
- 🐛 Open an issue on GitHub
- 📖 Check the [Gemini API docs](https://ai.google.dev/gemini-api/docs)

---

**Built with ❤️ using cutting-edge technologies**

*Powered by Gemini 2.0 • Visualized with Three.js • Synchronized with Yjs*
