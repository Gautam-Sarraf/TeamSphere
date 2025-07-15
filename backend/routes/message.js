import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Fetch chat history for a channel
router.get('/channel/:channelId/history', async (req, res) => {
  const { channelId } = req.params;
  try {
    const messages = await Message.find({ channelId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

export default router;
