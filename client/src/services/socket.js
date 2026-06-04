import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;
  
  // The proxy in vite config doesn't always handle websockets perfectly out of the box,
  // so we connect directly to the backend URL, but normally you'd use a window location
  socket = io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection Error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
