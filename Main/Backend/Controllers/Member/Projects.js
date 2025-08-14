const Project = require('../../Models/Projects');
const Task = require('../../Models/Tasks');

exports.getDetailedProjects = async (req, res) => {
    try {
        const memberId = req.user.id;

        // 1. Find projects based on assigned tasks
        const tasks = await Task.find({ assignedTo: memberId }).populate('project');
        const projectsFromTasks = tasks.map(task => task.project);

        // 2. Find teams the member belongs to
        const Team = require('../../Models/Teams');
        const memberTeams = await Team.find({ members: memberId });
        const teamIds = memberTeams.map(team => team._id);

        // 3. Find projects associated with these teams
        const projectsFromTeams = await Project.find({ team: { $in: teamIds } });

        // Combine and get unique projects
        const allProjects = [...projectsFromTasks, ...projectsFromTeams];
        const uniqueProjectIds = [...new Set(allProjects.map(project => project._id.toString()))];

        // Get detailed project data with task breakdown
        const projects = await Project.find({ _id: { $in: uniqueProjectIds } })
            .populate('chief', 'username')
            .populate('team', 'name');

        // Get detailed task information for each project
        const detailedProjects = await Promise.all(
            projects.map(async (project) => {
                const projectTasks = await Task.find({ project: project._id })
                    .populate('assignedTo', 'username email')
                    .populate('createdBy', 'username email');

                const taskStats = {
                    total: projectTasks.length,
                    pending: projectTasks.filter(task => task.status === 'pending').length,
                    inProgress: projectTasks.filter(task => task.status === 'in-progress').length,
                    completed: projectTasks.filter(task => task.status === 'completed').length,
                    highPriority: projectTasks.filter(task => task.priority === 'high').length,
                    mediumPriority: projectTasks.filter(task => task.priority === 'medium').length,
                    lowPriority: projectTasks.filter(task => task.priority === 'low').length
                };

                // Calculate dynamic completion percentage
                const completionPercentage = projectTasks.length > 0 
                    ? Math.round((taskStats.completed / projectTasks.length) * 100) 
                    : 0;

                // Get recent tasks (last 5)
                const recentTasks = projectTasks
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 5);

                return {
                    ...project.toObject(),
                    taskStats,
                    completionPercentage,
                    recentTasks,
                    tasks: projectTasks
                };
            })
        );

        res.status(200).json(detailedProjects);
    } catch (error) {
        console.error('Error fetching detailed member projects:', error);
        res.status(500).json({
            error: 'Failed to fetch detailed member projects',
            details: error.message
        });
    }
};

exports.getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const memberId = req.user.id;

        const tasks = await Task.find({ 
            project: projectId,
            assignedTo: memberId 
        })
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .populate('project', 'name')
        .sort({ createdAt: -1 });

        const taskStats = {
            total: tasks.length,
            pending: tasks.filter(task => task.status === 'pending').length,
            inProgress: tasks.filter(task => task.status === 'in-progress').length,
            completed: tasks.filter(task => task.status === 'completed').length
        };

        res.status(200).json({
            tasks,
            stats: taskStats
        });
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        res.status(500).json({
            error: 'Failed to fetch project tasks',
            details: error.message
        });
    }
};
