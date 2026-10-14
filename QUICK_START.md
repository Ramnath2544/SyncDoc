# 🚀 Quick Start Guide - SyncDoc

Get your SyncDoc application up and running in 5 minutes!

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed ([Download](https://nodejs.org/))
- [ ] MongoDB account ([Sign up](https://www.mongodb.com/cloud/atlas))
- [ ] Google Gemini API key ([Get it](https://ai.google.dev/))
- [ ] Cloudinary account ([Sign up](https://cloudinary.com/))
- [ ] Git installed ([Download](https://git-scm.com/))

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd SyncDoc
```

### 2. Backend Setup

```bash
# Navigate to API directory
cd api

# Install dependencies
npm install
```

Create `api/.env` file with the following:

```env
# MongoDB Connection
MONGO=mongodb+srv://username:password@cluster.mongodb.net/syncdoc

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Environment
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd ../client

# Install dependencies
npm install
```

Create `client/.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Getting API Keys

### MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

### Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new project or select existing
4. Generate and copy your API key

### Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

### JWT Secret

Generate a random string for JWT_SECRET:

```bash
# On Unix/Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

## ▶️ Running the Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
```

You should see:
```
✓ MongoDB connected
✓ Server running on port 3000
✓ Collaboration server running on port 1234
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
VITE v7.x.x ready in xxx ms

➜ Local:   http://localhost:5173/
```

### Option 2: Using Screen/Tmux (Unix/Mac/Linux)

```bash
# Terminal 1
screen -S api
cd api && npm run dev
# Press Ctrl+A then D to detach

# Terminal 2
screen -S client
cd client && npm run dev
# Press Ctrl+A then D to detach

# To reattach:
screen -r api    # or screen -r client
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **WebSocket**: ws://localhost:1234

## ✅ Verify Installation

### 1. Check Frontend
- Open http://localhost:5173
- You should see an impressive 3D hero section
- Try dark mode toggle

### 2. Test Registration
- Click "Get Started Free"
- Register a new account
- Verify email is working

### 3. Test Document Creation
- After login, create a new document
- Type something in the editor
- Check if it saves automatically

### 4. Test AI Features
- In any document, click the AI panel
- Try "Summarize" or "Grammar Check"
- Verify streaming responses work

### 5. Test Chat
- Open chat sidebar
- Send a message
- Upload an image

## 🐛 Troubleshooting

### Backend won't start

**Error: MongoDB connection failed**
```bash
# Check your MONGO connection string
# Ensure IP is whitelisted in MongoDB Atlas
# Verify username/password are correct
```

**Error: Port 3000 already in use**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix/Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Error: GEMINI_API_KEY not found**
```bash
# Make sure .env file exists in api/ directory
# Check file name is exactly .env (not .env.txt)
# Restart the server after creating .env
```

### Frontend won't start

**Error: Cannot find module**
```bash
# Delete node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

**Error: Failed to fetch**
```bash
# Ensure backend is running first
# Check VITE_API_URL in client/.env
# Verify no CORS issues in browser console
```

### 3D Scene not showing

**Black screen instead of 3D**
```bash
# Check browser console for WebGL errors
# Ensure browser supports WebGL 2.0
# Try updating graphics drivers
# Test in Chrome/Firefox/Edge (Safari may have issues)
```

**Performance issues**
```bash
# Reduce particle count in Hero3D.jsx
# Change from 150 to 50 particles
# Disable auto-rotate in OrbitControls
```

### AI not responding

**SSE stream fails**
```bash
# Verify GEMINI_API_KEY is correct
# Check Gemini API quota
# Look for errors in server logs
# Ensure document has content
```

## 📱 Testing on Mobile

1. Find your local IP:
```bash
# Windows:
ipconfig

# Unix/Mac/Linux:
ifconfig | grep inet
```

2. Update frontend .env:
```env
VITE_API_URL=http://YOUR_LOCAL_IP:3000
```

3. Access from mobile:
```
http://YOUR_LOCAL_IP:5173
```

## 🔒 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

Quick checklist:
- [ ] Update NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable logging
- [ ] Configure backups

## 📚 Next Steps

Now that you're up and running:

1. **Explore Features**: Try all collaboration features
2. **Read Documentation**: Check README.md for detailed features
3. **Customize 3D**: Modify `client/src/components/Hero3D.jsx`
4. **Test AI**: Try different Gemini prompts
5. **Invite Others**: Share documents with team members

## 🆘 Getting Help

If you're stuck:

1. Check this guide again
2. Review error messages carefully
3. Search issues on GitHub
4. Check browser console (F12)
5. Review server logs
6. Email: ramnath2544@gmail.com

## 🎉 Success!

Your SyncDoc installation is complete! You now have:

- ✅ Stunning 3D landing page with Three.js
- ✅ Real-time collaborative editing
- ✅ AI-powered writing assistance with Gemini 2.0
- ✅ Document chat with file sharing
- ✅ Secure authentication
- ✅ Cloud storage integration

**Start collaborating with your team today!** 🚀

---

**Need more help?** Check out:
- [README.md](./README.md) - Full documentation
- [GEMINI_SDK_MIGRATION.md](./GEMINI_SDK_MIGRATION.md) - SDK details
- [API Documentation](#) - Endpoint reference
