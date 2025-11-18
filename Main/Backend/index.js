require('dotenv').config({ path: './.env.local' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Explicitly require all models to ensure they are registered with Mongoose
require('./Models/Users');
require('./Models/Tasks');
require('./Models/Projects');
require('./Models/Notification');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'https://projectmanagementtool-bbdi.onrender.com', 'http://localhost:5173', 'http://localhost:3001'] : ['https://projectmanagementtool-bbdi.onrender.com', 'http://localhost:5173', 'http://localhost:3001'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route - redirect to frontend
app.get('/', (req, res) => {
  res.redirect('https://projectmanagementtool-bbdi.onrender.com/');
});

mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routers/auth/auth-routes');
const chiefRoutes = require('./routers/Chief/index.js');
const adminRoutes = require('./routers/Admin/index.js');
const memberRoutes = require('./routers/Member/index.js');
const notificationRoutes = require('./routers/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/chief', chiefRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
