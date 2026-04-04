import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';                    
import { Server as SocketServer } from 'socket.io';     
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import documentRoutes from "./routes/document.route.js";
import messageRoutes from './routes/message.route.js';  
import hocuspocus from "./collaboration.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const httpServer = createServer(app);                   

const io = new SocketServer(httpServer, {               
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
  });

  socket.on('send-message', ({ documentId, message }) => {
    io.to(documentId).emit('receive-message', message);
  });

  socket.on('leave-document', (documentId) => {
    socket.leave(documentId);
  });

  socket.on('disconnect', () => {});
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/documents", documentRoutes);
app.use('/api/messages', messageRoutes);               

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});

hocuspocus.listen().then(() => {
  console.log('Hocuspocus collaboration server running on port 1234');
});