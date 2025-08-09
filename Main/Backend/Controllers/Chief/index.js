const Team = require('../../Models/Teams');
const User = require('../../Models/Users');
const Task = require('../../Models/Tasks');
const mongoose = require('mongoose');

exports.createTeam = async (req, res) => {
  const { name, members } = req.body;
  const chief = req.user.id;
  try {
    // Ensure members is an array and filter out any invalid entries
    const validMembers = Array.isArray(members) ? members.filter(id => id && id.trim()) : [];
    
    const team = new Team({ 
      name, 
      chief, 
      members: validMembers,
    });
    await team.save();

    // Populate the team with member details
    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email role')
      .populate('chief', 'name email');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team: populatedTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ 
      error: 'Failed to create team',
      details: error.message 
    });
  }
};

exports.assignTask = async (req, res) => {
  const { title, description, teamId, assignedTo, dueDate } = req.body;
  try {
    const task = new Task({ title, description, team: teamId, assignedTo, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const chiefId = req.user.id;
    
    // Get teams where user is chief
    const teams = await Team.find({ chief: chiefId });
    const teamIds = teams.map(team => team._id);
    
    // Handle case where no teams exist
    if (teams.length === 0) {
      return res.json({
        activeProjects: 0,
        tasksCompleted: 0,
        teamMembers: 0,
        overdueTasks: 0,
        projects: [],
        upcomingTasks: [],
        recentActivity: []
      });
    }
    
    // Get all tasks for these teams
    const tasks = await Task.find({ team: { $in: teamIds } })
      .populate('team', 'name')
      .populate('assignedTo', 'name email');
    
    // Get team members
    const teamMembers = await User.find({ 
      $or: [
        { _id: { $in: teams.flatMap(team => team.members) } },
        { _id: chiefId }
      ]
    });
    
    // Calculate dashboard metrics
    const activeProjects = teams.length;
    const tasksCompleted = tasks.filter(task => task.status === 'completed').length;
    const overdueTasks = tasks.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < new Date()
    ).length;
    
    // Get upcoming tasks (next 7 days)
    const upcomingTasks = tasks
      .filter(task => 
        task.status !== 'completed' && 
        new Date(task.dueDate) >= new Date() &&
        new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      .slice(0, 5)
      .map(task => ({
        id: task._id,
        name: task.title,
        dueDate: task.dueDate,
        priority: task.priority || 'medium'
      }));
    
    // Format projects data
    const projects = teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description || 'No description provided',
      status: 'active',
      progress: Math.floor(Math.random() * 100),
      members: team.members.length,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    
    // Format recent activity
    const recentActivity = tasks.slice(0, 5).map(task => ({
      id: task._id,
      user: {
        name: 'System',
        initial: 'S'
      },
      action: `created task`,
      target: task.title,
      time: new Date(task.createdAt).toLocaleDateString()
    }));
    
    res.json({
      activeProjects,
      tasksCompleted,
      teamMembers: teamMembers.length,
      overdueTasks,
      projects,
      upcomingTasks,
      recentActivity
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ chief: req.user.id }, '_id name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllChiefs = async (req, res) => {
    try {
        const chiefs = await User.find({ role: 'Chief' }, '_id username');
        res.json(chiefs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
