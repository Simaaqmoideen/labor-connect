const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role }
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.role} ${socket.user.id} (${socket.id})`);

    // Join personal room based on role and id
    const personalRoom = `user_${socket.user.role}_${socket.user.id}`;
    socket.join(personalRoom);

    // Join a specific job room for chat
    socket.on('join_job_room', (jobId) => {
      socket.join(`job_${jobId}`);
      console.log(`[Socket] User ${socket.user.id} joined job room: job_${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
};
