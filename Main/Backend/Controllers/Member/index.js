const Task = require('../../Models/Tasks');
const User = require('../../Models/Users');
const Project = require('../../Models/Projects');

exports.updateChief = async (req, res) => {
    const { chiefId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { chief: chiefId },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('team');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedTo: req.user.id },
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to update it' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboardData = {
      features: [
        {
          id: 1,
          title: "Task Management",
          description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.",
          icon: "task",
          color: "blue"
        },
        {
          id: 2,
          title: "Team Collaboration",
          description: "Work together seamlessly with your team. Share updates, files, and communicate within the platform.",
          icon: "team",
          color: "green"
        },
        {
          id: 3,
          title: "Progress Tracking",
          description: "Visualize your project progress with charts and timelines. Stay updated on milestones and deadlines.",
          icon: "bar-chart",
          color: "purple"
        }
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberProjects = async (req, res) => {
    try {
        const memberId = req.user.id;
        const tasks = await Task.find({ assignedTo: memberId }).populate('project');
        const projectIds = [...new Set(tasks.map(task => task.project._id.toString()))];
        const projects = await Project.find({ _id: { $in: projectIds } });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching member projects:', error);
        res.status(500).json({ 
            error: 'Failed to fetch member projects',
            details: error.message 
        });
    }
};

exports.updateChief = async (req, res) => {
    const { chiefId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { chief: chiefId },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('team');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedTo: req.user.id },
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to update it' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboardData = {
      features: [
        {
          id: 1,
          title: "Task Management",
          description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.",
          icon: "task",
          color: "blue"
        },
        {
          id: 2,
          title: "Team Collaboration",
          description: "Work together seamlessly with your team. Share updates, files, and communicate within the platform.",
          icon: "team",
          color: "green"
        },
        {
          id: 3,
          title: "Progress Tracking",
          description: "Visualize your project progress with charts and timelines. Stay updated on milestones and deadlines.",
          icon: "bar-chart",
          color: "purple"
        }
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
