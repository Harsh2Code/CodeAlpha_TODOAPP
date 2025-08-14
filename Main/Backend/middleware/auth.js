const jwt = require('jsonwebtoken');
const User = require('../Models/Users'); // Adjust path if necessary

exports.auth = async (req, res, next) => {
  console.log('Auth middleware: Attempting to authenticate...');
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware: No token or invalid format.');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.replace('Bearer ', '');
  console.log('Auth middleware: Token received:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token decoded:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('Auth middleware: User not found for decoded ID.');
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    console.log('Auth middleware: User authenticated:', req.user.username);
    next();
  } catch (error) {
    console.log('Auth middleware: Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.isChief = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log('Checking isChief for user:', user.username, 'Role:', user.role);
    
    // Handle case-insensitive role checking and trim whitespace
    const userRole = user.role ? user.role.trim().toLowerCase() : '';
    
    // Allow both 'chief' and 'leader' roles
    if (userRole !== 'chief') {
      return res.status(403).json({ 
        message: 'Access denied: Chief/Leader role required',
        userRole: user.role,
        expectedRole: 'Chief or Leader'
      });
    }
    next();
  } catch (error) {
    console.error('Error in isChief middleware:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userRole = user.role ? user.role.trim().toLowerCase() : '';
    
    if (userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied: Admin role required',
        userRole: user.role,
        expectedRole: 'Admin'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.isMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userRole = user.role ? user.role.trim().toLowerCase() : '';
    
    // Allow 'member' role only for member endpoints
    if (userRole !== 'member') {
      return res.status(403).json({ 
        message: 'Access denied: Member role required',
        userRole: user.role,
        expectedRole: 'Member'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
