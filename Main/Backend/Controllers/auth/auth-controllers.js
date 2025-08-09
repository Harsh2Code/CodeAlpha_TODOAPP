const User = require('../../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('Received registration data:', { username, email, role });
  try {
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Creating new user instance...');
    const user = new User({ username, email, password: hashedPassword, role });
    console.log('Attempting to save user to database...');
    await user.save();
    console.log('User saved successfully!');
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === 11000) {
      console.log('Attempted to register with existing email:', email);
      return res.status(400).json({ error: 'Email already registered.' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in your environment variables');
    return res.status(500).json({ error: 'Server configuration error: JWT_SECRET is missing.' });
  }

  const { email, password } = req.body; // Changed from username to email
  console.log('Login attempt for email:', email);
  try {
    const user = await User.findOne({ email }); // Changed from username to email
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found. Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Password matched. Generating token...');
    const userObject = user.toObject();
    const userId = userObject._id.toString();
    const userRole = userObject.role || 'Member';
    const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for email:', email);
    res.json({ token, user: { id: userId, role: userRole } }); // Added user role to response
  } catch (error) {
    console.error('Detailed error during login:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
