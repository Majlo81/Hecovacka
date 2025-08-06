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
    origin: process.env.FRONTEND_URL || "https://hecovacka-pwa.windsurf.build",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: [
    "https://hecovacka-pwa.windsurf.build",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8090",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8090"
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Development-friendly limit
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with production support
const connectDB = async () => {
  try {
    let mongoURI;
    
    // Production or development with external MongoDB
    if (process.env.MONGODB_URI) {
      mongoURI = process.env.MONGODB_URI;
      console.log('🌐 Connecting to production MongoDB...');
    } 
    // Development with in-memory MongoDB
    else {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('🔥 Starting in-memory MongoDB for development...');
      const mongod = new MongoMemoryServer();
      await mongod.start();
      mongoURI = mongod.getUri();
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    if (process.env.MONGODB_URI) {
      console.log('✅ Production MongoDB connected successfully!');
    } else {
      console.log('✅ In-Memory MongoDB connected successfully!');
      console.log('🚀 Ready for testing - no external MongoDB needed!');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('⚠️ Continuing without database - frontend will work!');
  }
};

// Connect to database
connectDB();

// Basic API routes with demo data
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/hecovacky', require('./routes/hecovacky'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hecovačka server is running! 🔥',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hecovačka API v1.0',
    endpoints: {
      auth: '/api/auth',
      groups: '/api/groups',
      goals: '/api/goals',
      progress: '/api/progress',
      hecovacky: '/api/hecovacky'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join user to their groups for real-time updates
  socket.on('join-groups', (groupIds) => {
    groupIds.forEach(groupId => {
      socket.join(`group-${groupId}`);
      console.log(`👥 User ${socket.id} joined group ${groupId}`);
    });
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      '/health',
      '/api',
      '/api/auth',
      '/api/groups',
      '/api/goals',
      '/api/progress',
      '/api/hecovacky'
    ]
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Hecovačka server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Socket.io ready for real-time communication`);
});

module.exports = { app, io };
