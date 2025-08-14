const Task = require('../../Models/Tasks');
const Project = require('../../Models/Projects'); // Import Project model

exports.getTasks = async (req, res) => {
    try {
const tasks = await Task.find({})
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
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

        res.status(201).json({ message: 'Task assigned successfully', task: newTask });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ 
            error: 'Failed to assign task',
            details: error.message 
        });
    }
};
