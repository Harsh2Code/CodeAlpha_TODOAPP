
const mongoose = require('mongoose');
const Task = require('../Models/Tasks');
const User = require('../Models/Users');
require('dotenv').config({ path: __dirname + '/../../.env.local' });


const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const tasks = await Task.find().populate('assignedTo');
        const users = await User.find();

        console.log('--- Tasks ---');
        tasks.forEach(task => {
            console.log(`Task: ${task.title}`);
            if (task.assignedTo && task.assignedTo.length > 0) {
                task.assignedTo.forEach(assignee => {
                    if (assignee) {
                        console.log(`  - Assigned to: ${assignee.username} (${assignee._id})`);
                    } else {
                        console.log(`  - Assigned to: Invalid user ID`);
                    }
                });
            } else {
                console.log('  - Not assigned to anyone');
            }
        });

        console.log('\n--- Users ---');
        users.forEach(user => {
            console.log(`User: ${user.username} (${user._id})`);
        });

    } catch (error) {
        console.error('Error verifying data:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

verifyData();
