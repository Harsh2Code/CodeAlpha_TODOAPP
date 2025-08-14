const Team = require('../../Models/Teams');
const User = require('../../Models/Users');
const Task = require('../../Models/Tasks');
const Project = require('../../Models/Projects');
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
      members: [...validMembers, chief],
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
    console.log("Chief ID:", chiefId);
    
    // Get projects where user is chief
    const projects = await Project.find({ chief: chiefId }).populate({
      path: 'tasks',
      populate: {
        path: 'assignedTo',
        select: 'username email'
      }
    });
    console.log("Projects found:", projects.length);
    console.log("Projects data (first project tasks):", projects.length > 0 ? projects[0].tasks : "No projects");

    // Handle case where no projects exist
    if (projects.length === 0) {
      return res.json({
        activeProjects: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        overdueTasks: 0,
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
      console.log("Processing project:", project.name);
      totalTasks += project.tasks.length;
      tasksCompleted += project.tasks.filter(task => task.status === 'completed').length;
      overdueTasks += project.tasks.filter(task => 
        task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date()
      ).length;
      allTasks.push(...project.tasks);
    });
    console.log("Total tasks collected:", allTasks.length);

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
    console.log("Upcoming tasks:", upcomingTasks.length);
    
    // Format recent activity
    const recentActivity = allTasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(task => {
        const assignedUser = task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo[0] : null;
        const userName = assignedUser ? assignedUser.username : 'N/A';
        const userInitial = assignedUser ? assignedUser.username.charAt(0).toUpperCase() : 'N/A';

        return {
          id: task._id,
          user: {
            name: userName,
            initial: userInitial
          },
          action: `created task`,
          target: task.title,
          time: new Date(task.createdAt).toLocaleDateString()
        };
      });
    console.log("Recent activity:", recentActivity.length);
    
    res.json({
      activeProjects: projects.length,
      tasksCompleted,
      totalTasks,
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
    const chiefId = req.user.id;

    // Find all teams managed by this chief
    const teams = await Team.find({ chief: chiefId });

    // Collect all unique member IDs from these teams, including the chief themselves
    let memberIds = new Set([chiefId]); // Start with the chief's ID
    teams.forEach(team => {
      team.members.forEach(memberId => memberIds.add(memberId.toString()));
    });

    // Convert Set to Array
    const uniqueMemberIds = Array.from(memberIds);

    // Find all users whose IDs are in the collected list
    const users = await User.find({ _id: { $in: uniqueMemberIds } }, '_id username email role'); // Select username instead of name if that's the field you use
    res.json(users);
  } catch (error) {
    console.error('Error fetching assignable users:', error); // Add more specific error logging
    res.status(500).json({ error: 'Failed to fetch assignable users', details: error.message });
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
