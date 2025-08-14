const Task = require('../../Models/Tasks');
const User = require('../../Models/Users');
const Project = require('../../Models/Projects');
const Team = require('../../Models/Teams');

exports.updateChief = async (req, res) => {
    console.log('updateChief controller: Received request to update chief.');
    const { chiefEmail } = req.body;
    try {
        // Find the chief by email and ensure they have the 'Chief' role
        const chiefUser = await User.findOne({ email: chiefEmail, role: 'Chief' });

        if (!chiefUser) {
            console.log('updateChief controller: Chief not found or invalid email.');
            return res.status(404).json({ message: 'Chief not found or invalid email' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { chief: chiefUser._id }, // Use the found chief's _id
            { new: true }
        );

        if (!user) {
            console.log('updateChief controller: Member not found.');
            return res.status(404).json({ message: 'Member not found' });
        }
        console.log('updateChief controller: Chief updated successfully for user:', user.username);
        res.json(user);
    } catch (error) {
        console.error('updateChief controller: Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyTasks = async (req, res) => {
  console.log('req.user in getMyTasks:', req.user);
  try {
    const userId = req.user.id;
    
    // Find all tasks for all non-admin users
    const tasks = await Task.find({ assignedTo: userId })
      .populate('project', 'name chief')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    console.log('Found tasks:', tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

        // 1. Find projects based on assigned tasks
        const tasks = await Task.find({ assignedTo: memberId }).populate('project');
        const projectsFromTasks = tasks.map(task => task.project);

        // 2. Find teams the member belongs to
        const memberTeams = await Team.find({ members: memberId });
        const teamIds = memberTeams.map(team => team._id);

        // 3. Find projects associated with these teams
        const projectsFromTeams = await Project.find({ team: { $in: teamIds } });

        // Combine and get unique projects
        const allProjects = [...projectsFromTasks, ...projectsFromTeams];
        const uniqueProjectIds = [...new Set(allProjects.map(project => project._id.toString()))];

        const projects = await Project.find({ _id: { $in: uniqueProjectIds } })
            .populate('chief', 'username')
            .populate('team', 'name'); // Populate team name for better context

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching member projects:', error);
        res.status(500).json({
            error: 'Failed to fetch member projects',
            details: error.message
        });
    }
};

exports.getChiefActivity = async (req, res) => {
    try {
        const memberId = req.user.id;
        const member = await User.findById(memberId).populate('chief', 'username email');

        if (!member || !member.chief) {
            return res.status(404).json({ message: 'Chief not found for this member' });
        }

        const chiefId = member.chief._id;

        // Fetch projects created by the chief
        const chiefProjects = await Project.find({ chief: chiefId })
            .populate('chief', 'username email')
            .sort({ createdAt: -1 })
            .limit(5); // Limit to recent projects

        // Fetch tasks created by the chief (or assigned by the chief)
        // For simplicity, let's fetch tasks where chief is the creator
        const chiefTasks = await Task.find({ createdBy: chiefId })
            .populate('assignedTo', 'username email')
            .populate('project', 'name')
            .sort({ createdAt: -1 })
            .limit(5); // Limit to recent tasks

        res.status(200).json({
            chief: member.chief,
            projects: chiefProjects,
            tasks: chiefTasks,
        });

    } catch (error) {
        console.error('Error fetching chief activity:', error);
        res.status(500).json({
            error: 'Failed to fetch chief activity',
            details: error.message
        });
    }
};

exports.getMemberTeams = async (req, res) => {
    try {
        const memberId = req.user.id;
        // Find teams where the member is part of (e.g., in members array or as a chief)
        // This logic needs to be refined based on your Team model structure
        const teams = await Team.find({
            $or: [
                { members: memberId },
                { chief: memberId } // Assuming a chief can also be considered part of the team for display
            ]
        }).populate('members', 'username email').populate('chief', 'username email');

        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching member teams:', error);
        res.status(500).json({
            error: 'Failed to fetch member teams',
            details: error.message
        });
    }
};
