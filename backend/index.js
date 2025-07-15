import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import serverRoutes from './routes/server.js';
import messageRoutes from './routes/message.js';
import Message from './models/Message.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', serverRoutes);
app.use('/api', messageRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join channel', (channelId) => {
    socket.join(channelId);
    console.log(`Socket ${socket.id} joined channel ${channelId}`);
  });

  socket.on('leave channel', (channelId) => {
    socket.leave(channelId);
    console.log(`Socket ${socket.id} left channel ${channelId}`);
  });

  socket.on('chat message', async (msg) => {
    if (msg.channelId && msg.sender) {
      try {
        const newMsg = new Message({
          channelId: msg.channelId,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp || new Date(),
          file: msg.file,
        });
        await newMsg.save();
        io.to(msg.channelId).emit('chat message', newMsg); // <--- This is the key change!
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
