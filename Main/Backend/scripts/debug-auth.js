// Debug script to test authentication flow
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const mongoose = require('mongoose');

async function debugAuth() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp');
    
    // Test token generation
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Generated test token:', token);
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Decoded token:', decoded);
      
      // Check user role
      console.log('User role:', testUser.role);
      console.log('User ID:', testUser._id);
    }
    
    // List all users with their roles
    const users = await User.find({}, 'username email role');
    console.log('All users:', users);
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    mongoose.disconnect();
  }
}

if (require.main === module) {
  debugAuth();
}

module.exports = { debugAuth };
