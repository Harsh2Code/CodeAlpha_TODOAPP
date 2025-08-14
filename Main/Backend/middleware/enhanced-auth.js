const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided',
        details: 'Authorization header must be in format: Bearer <token>'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        details: 'Token valid but user does not exist'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        details: 'Please login again'
      });
    }
    
    return res.status(401).json({ 
      message: 'Invalid token',
      details: error.message
    });
  }
};

exports.isChief = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userRole = user.role ? user.role.trim().toLowerCase() : '';
    
    // Allow both 'chief' and 'leader' roles
    if (!['chief', 'leader'].includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied',
        details: `User role '${user.role}' is not authorized. Required: Chief or Leader`
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Role check failed',
      details: error.message
    });
  }
};
