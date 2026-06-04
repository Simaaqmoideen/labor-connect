require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { sequelize } = require('./models');
const initSocket = require('./socket');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const providerRoutes = require('./routes/provider.routes');
const workerRoutes = require('./routes/worker.routes');
const chatRoutes = require('./routes/chat.routes');
const locationRoutes = require('./routes/location.routes');
const jobRoutes = require('./routes/jobs.routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io to app so controllers can emit
app.set('io', io);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Initialize Socket.IO
initSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false })
  .then(() => {
    console.log('[DB] Connected and synced');
    server.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('[DB] Connection failed:', err);
    process.exit(1);
  });
