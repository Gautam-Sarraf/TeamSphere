import express from 'express';
import Server from '../models/Server.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new server
router.post('/server', async (req, res) => {
  const { name, ownerId } = req.body;
  try {
    const server = new Server({ name, owner: ownerId, members: [ownerId] });
    await server.save();
    // Create a default channel
    const channel = new Channel({ name: 'general', server: server._id });
    await channel.save();
    server.channels.push(channel._id);
    await server.save();
    res.status(201).json({ server, channel });
  } catch (err) {
    res.status(500).json({ message: 'Server creation failed', error: err.message });
  }
});

// Invite user to server
router.post('/server/:serverId/invite', async (req, res) => {
  const { email, invitedBy } = req.body;
  const { serverId } = req.params;
  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    server.invites.push({ email, invitedBy });
    await server.save();
    res.status(200).json({ message: 'User invited' });
  } catch (err) {
    res.status(500).json({ message: 'Invite failed', error: err.message });
  }
});

// Accept invite (user joins server)
router.post('/server/:serverId/join', async (req, res) => {
  const { userId } = req.body;
  const { serverId } = req.params;
  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    if (!server.members.includes(userId)) {
      server.members.push(userId);
      await server.save();
    }
    res.status(200).json({ message: 'Joined server' });
  } catch (err) {
    res.status(500).json({ message: 'Join failed', error: err.message });
  }
});

// Create a channel in a server
router.post('/server/:serverId/channel', async (req, res) => {
  const { name } = req.body;
  const { serverId } = req.params;
  try {
    const channel = new Channel({ name, server: serverId });
    await channel.save();
    const server = await Server.findById(serverId);
    server.channels.push(channel._id);
    await server.save();
    res.status(201).json({ channel });
  } catch (err) {
    res.status(500).json({ message: 'Channel creation failed', error: err.message });
  }
});

// Get all servers a user is a member of
router.get('/servers/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const servers = await Server.find({ members: userId }).populate('channels').exec();
    res.status(200).json(servers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch servers', error: err.message });
  }
});

export default router;
