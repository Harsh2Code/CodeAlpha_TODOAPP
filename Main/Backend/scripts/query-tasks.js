require('dotenv').config({ path: '../.env.local' });
const mongoose = require('mongoose');
const config = require('../config/config');
const Task = require('../Models/Tasks');

async function queryAllTasks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected successfully');

    // Query all tasks
    const tasks = await Task.find({})
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('\n=== All Tasks ===');
    console.log(`Total tasks found: ${tasks.length}\n`);

    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title}`);
      console.log(`   Description: ${task.description}`);
      console.log(`   Status: ${task.status}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Project: ${task.project?.name || 'N/A'}`);
      console.log(`   Assigned to: ${task.assignedTo.map(user => user.name).join(', ') || 'Unassigned'}`);
      console.log(`   Created by: ${task.createdBy?.name || 'Unknown'}`);
      console.log(`   Due date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}`);
      console.log(`   Created: ${new Date(task.createdAt).toLocaleString()}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('Error querying tasks:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

queryAllTasks();
