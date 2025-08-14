const mongoose = require('mongoose');
const User = require('../Models/Users');
require('dotenv').config();

async function checkUserRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'username role');
    console.log('User roles:');
    users.forEach(user => {
      console.log(\`Username: \${user.username}, Role: "\${user.role}"\`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking user roles:', error);
  }
}

checkUserRoles();
