const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time communication
const io = socketIo(server, {
  cors: {
    origin: "*", // Povolíme všetky origins pre production testing
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Trust proxy - potrebné pre Railway
app.set('trust proxy', 1);

// CORS - povolíme všetko pre production debugging
app.use(cors({
  origin: "*", // Dočasne povolíme všetky origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));

// Pre preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

// Security middleware - zmiernené pre debugging
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(morgan('combined')); // Logging

// Rate limiting - výrazne zmiernené pre development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Veľmi vysoký limit pre testing
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection s lepším error handlingom
const connectDB = async () => {
  try {
    let mongoURI;
    
    // Production MongoDB
    if (process.env.MONGODB_URI) {
      mongoURI = process.env.MONGODB_URI;
      console.log('🌐 Connecting to production MongoDB...');
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Production MongoDB connected successfully!');
    } 
    // Development with in-memory MongoDB
    else {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        console.log('🔥 Starting in-memory MongoDB for development...');
        const mongod = new MongoMemoryServer();
        await mongod.start();
        mongoURI = mongod.getUri();
        
        await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ In-Memory MongoDB connected successfully!');
        console.log('🚀 Ready for testing - no external MongoDB needed!');
      } catch (memoryDbError) {
        console.log('⚠️ In-memory MongoDB failed, continuing without database');
        console.error('Memory DB Error:', memoryDbError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️ Continuing without database - API will still work for testing!');
  }
};

// Connect to database
connectDB();

// Basic route pre root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🔥 Hecovačka API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      groups: '/api/groups',
      goals: '/api/goals',
      progress: '/api/progress',
      hecovacky: '/api/hecovacky'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hecovačka server is running! 🔥',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    cors: 'enabled'
  });
});

// API routes with demo data
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/hecovacky', require('./routes/hecovacky'));

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hecovačka API v1.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /login, /register)',
      groups: '/api/groups',
      goals: '/api/goals',
      progress: '/api/progress',
      hecovacky: '/api/hecovacky'
    },
    status: 'All systems operational',
    documentation: 'See README.md for API documentation'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join user to their groups for real-time updates
  socket.on('join-groups', (groupIds) => {
    if (Array.isArray(groupIds)) {
      groupIds.forEach(groupId => {
        socket.join(`group-${groupId}`);
        console.log(`👥 User ${socket.id} joined group ${groupId}`);
      });
    }
  });

  // Handle progress updates
  socket.on('progress-update', (data) => {
    socket.to(`group-${data.groupId}`).emit('member-progress-update', {
      userId: data.userId,
      userName: data.userName,
      progress: data.progress,
      goal: data.goal,
      timestamp: new Date()
    });
  });

  // Handle hecovačky (motivational messages)
  socket.on('send-hecovacka', (data) => {
    socket.to(`group-${data.groupId}`).emit('new-hecovacka', {
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      toUserId: data.toUserId,
      toUserName: data.toUserName,
      message: data.message,
      type: data.type,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Nekončíme proces v produkcii
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  // Nekončíme proces v produkcii
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
    availableEndpoints: [
      '/ (root)',
      '/health',
      '/api',
      '/api/auth',
      '/api/groups',
      '/api/goals',
      '/api/progress',
      '/api/hecovacky'
    ],
    timestamp: new Date().toISOString()
  });
});

// Port configuration
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hecovačka server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Socket.io ready for real-time communication`);
  console.log(`🔥 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
