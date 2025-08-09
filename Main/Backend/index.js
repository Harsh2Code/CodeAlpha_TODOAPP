const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routers/auth/auth-routes');

app.use('/api/auth', authRoutes);

const chiefRoutes = require('./routers/Chief/index.js');

app.use('/api/chief', chiefRoutes);

const adminRoutes = require('./routers/Admin/index.js');

app.use('/api/admin', adminRoutes);

const memberRoutes = require('./routers/Member/index.js');

app.use('/api/member', memberRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
