const Task = require('../../Models/Tasks');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ chief: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            error: 'Failed to fetch tasks',
            details: error.message 
        });
    }
};
