const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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
