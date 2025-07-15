// src/utils/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Change if backend is deployed elsewhere

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export default getSocket;
