
const mongoose = require('mongoose');
const User = require('../Models/Users');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');

const envConfig = {};
envFile.split('\n').forEach(line => {
    const firstEquals = line.indexOf('=');
    if (firstEquals !== -1) {
        const key = line.slice(0, firstEquals).trim();
        const value = line.slice(firstEquals + 1).trim();
        envConfig[key] = value;
    }
});

process.env.MONGODB_URI = envConfig.MONGODB_URI;

const updateLeaderRole = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const result = await User.updateMany({ role: 'Leader' }, { $set: { role: 'Member' } });

        console.log(`${result.nModified} users updated from Leader to Member`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error updating user roles:', error);
    }
};

updateLeaderRole();


