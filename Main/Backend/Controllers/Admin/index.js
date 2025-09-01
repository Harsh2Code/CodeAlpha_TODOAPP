const User = require('../../Models/Users');
const Team = require('../../Models/Teams');
const Task = require('../../Models/Tasks');
const Project = require('../../Models/Projects');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Get all projects
    const projects = await Project.find().populate({
      path: 'tasks',
      populate: [
        {
          path: 'assignedTo',
          select: 'username email'
        },
        {
          path: 'createdBy',
          select: 'username email'
        }
      ]
    });

    // Handle case where no projects exist
    if (projects.length === 0) {
      return res.json({
        activeProjects: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        overdueTasks: 0,
        teamMembers: 0,
        projects: [],
        upcomingTasks: [],
        recentActivity: []
      });
    }

    let totalTasks = 0;
    let tasksCompleted = 0;
    let overdueTasks = 0;
    const allTasks = [];

    projects.forEach(project => {
      totalTasks += project.tasks.length;
      tasksCompleted += project.tasks.filter(task => task.status === 'completed').length;
      overdueTasks += project.tasks.filter(task =>
        task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date()
      ).length;
      allTasks.push(...project.tasks);
    });

    // Get team members count
    const teamMembers = await User.countDocuments({ role: 'Member' });

    // Get upcoming tasks (next 7 days)
    const upcomingTasks = allTasks
      .filter(task =>
        task.status !== 'completed' &&
        task.dueDate &&
        new Date(task.dueDate) >= new Date() &&
        new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map(task => ({
        id: task._id,
        name: task.title,
        dueDate: task.dueDate,
        priority: task.priority || 'medium'
      }));

    // Format recent activity
    const recentActivity = allTasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(task => {
        return {
          id: task._id,
          user: {
            name: task.createdBy ? task.createdBy.username : 'Unknown',
            initial: task.createdBy ? task.createdBy.username.charAt(0).toUpperCase() : '?'
          },
          action: `created task`,
          target: task.title,
          time: new Date(task.createdAt).toLocaleDateString()
        };
      });

    res.json({
      activeProjects: projects.length,
      tasksCompleted,
      totalTasks,
      overdueTasks,
      teamMembers,
      projects,
      upcomingTasks,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('chief members');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('team assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
