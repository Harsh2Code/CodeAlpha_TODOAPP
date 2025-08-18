const Task = require('../../Models/Tasks');
const Project = require('../../Models/Projects'); // Import Project model
const User = require('../../Models/Users'); // Import User model
const mongoose = require('mongoose'); // Import mongoose
const notificationController = require('../../Controllers/notificationController');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id })
            .populate('project', 'name')
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'username name email')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            error: 'Failed to fetch tasks',
            details: error.message 
        });
    }
};

exports.assignTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, project, assignedTo } = req.body;

        // Basic validation
        if (!title || !project) {
            return res.status(400).json({ message: 'Title and project are required.' });
        }

        // Ensure assignedTo is an array
        const assignees = Array.isArray(assignedTo) ? assignedTo : [];

        const newTask = new Task({
            title,
            description: description || '',
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority: priority || 'medium',
            project,
            assignedTo: assignees,
            createdBy: req.user.id,
        });

        await newTask.save();

        // Add the task to the project's tasks array
        await Project.findByIdAndUpdate(project, { $push: { tasks: newTask._id } });

        // Send notification to each assignee
        for (const assigneeId of assignees) {
            const assignerUser = await User.findById(new mongoose.Types.ObjectId(req.user.id));
            const assignerName = assignerUser ? assignerUser.name : 'Unknown';
            await notificationController.notificationService.taskAssigned(newTask, assigneeId, assignerName);
        }

        // Send notification to the assigner (Chief)
        const chiefAssignerUser = await User.findById(new mongoose.Types.ObjectId(req.user.id));
        const chiefAssignerName = chiefAssignerUser ? chiefAssignerUser.name : 'Unknown';
        const assigneeUsers = await User.find({ _id: { $in: assignees } });
        const assigneeNames = assigneeUsers.map(user => user.name);

        await notificationController.createNotification({
            userId: req.user.id,
            type: 'task_assigned_by_chief',
            title: 'Task Assigned',
            message: `You assigned task: ${newTask.title}`,
            priority: 'low',
            relatedId: newTask._id,
            relatedModel: 'Task',
            metadata: { 
                assigneeNames: assigneeNames.join(', ')
            }
        });

        const populatedTask = await Task.findById(newTask._id)
            .populate('project', 'name')
            .populate('assignedTo', 'username name email')
            .populate('createdBy', 'name email');

        res.status(201).json({ message: 'Task assigned successfully', task: populatedTask });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ 
            error: 'Failed to assign task',
            details: error.message 
        });
    }
};
