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
  console.log('Login function started.');
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in your environment variables');
    return res.status(500).json({ error: 'Server configuration error: JWT_SECRET is missing.' });
  }

  const { email, password } = req.body;
  console.log('Login attempt for email:', email);
  try {
    console.log('Searching for user in database...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Passwords matched.');

    console.log('Converting user to object...');
    const userObject = user.toObject();
    console.log('User object:', userObject);

    const userId = userObject._id.toString();
    console.log('User ID:', userId);

    const userRole = userObject.role || 'Member';
    console.log('User role:', userRole);

    console.log('Signing JWT token...');
    const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated.');

    const responseBody = {
      token,
      user: {
        id: userId,
        username: user.username || '',
        email: user.email || '',
        role: userRole,
        chief: user.chief || null,
      },
    };

    console.log('Sending response... Body:', JSON.stringify(responseBody, null, 2));
    res.json(responseBody);
    console.log('Response sent successfully.');
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

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('chief', 'username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
};
