const Project = require('../../Models/Projects');
const Task = require('../../Models/Tasks');
const mongoose = require('mongoose'); // Import mongoose
const User = require('../../Models/Users'); // Import User model
const { notificationService } = require('../../Controllers/notificationController');

exports.createProject = async (req, res) => {
    const { name, description, priority, teamId } = req.body;
    try {
        const project = new Project({ name, description, priority, chief: req.user.id, team: teamId });
        await project.save();
        res.status(201).json({ success: true, message: 'Project created successfully', project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ 
            error: 'Failed to create project',
            details: error.message 
        });
    }
};

exports.getProjects = async (req, res) => {
    try {
        console.log('req.user.id in getProjects:', req.user.id);
        const projects = await Project.find({ chief: req.user.id }).populate('tasks').populate({
            path: 'team',
            populate: {
                path: 'members',
                model: 'User',
                select: 'username email role'
            }
        });

        const projectsWithCompletion = projects.map(project => {
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
            const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            // Transform team members to include 'name' field for frontend compatibility
            if (project.team && project.team.members) {
                project.team.members = project.team.members.map(member => ({
                    id: member._id.toString(),
                    name: member.username,
                    email: member.email,
                    role: member.role,
                }));
            }

            return {
                ...project.toObject(), // Convert Mongoose document to plain object
                completionPercentage: parseFloat(completionPercentage.toFixed(2)) // Format to 2 decimal places
            };
        });

        console.log('Projects fetched (with populated team and completion percentage):', projectsWithCompletion);
        res.status(200).json(projectsWithCompletion);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ 
            error: 'Failed to fetch projects',
            details: error.message 
        });
    }
};

exports.updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, description, priority, status, team } = req.body;
    console.log('Received update project request for projectId:', projectId);
    console.log('Request body:', req.body);
    console.log('Received team ID:', team);

    let teamObjectId = null;
    if (team) {
        try {
            teamObjectId = new mongoose.Types.ObjectId(team);
            console.log('Casted team ObjectId:', teamObjectId);
            const existingTeam = await mongoose.model('Team').findById(teamObjectId);
            console.log('Existing team found:', !!existingTeam);
        } catch (e) {
            console.error('Error casting team ID to ObjectId:', e);
            // If casting fails, treat it as an invalid team ID
            teamObjectId = null;
        }
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update fields individually
        project.name = name;
        project.description = description;
        project.priority = priority;
        project.status = status;
        project.team = teamObjectId; // Explicitly set the team field

        await project.save(); // Save the updated project

        console.log('Project after update:', project);
        console.log('Project.team after update:', project.team);

        res.status(200).json({ success: true, message: 'Project updated successfully', project, updatedTeam: project.team });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ 
            error: 'Failed to update project',
            details: error.message 
        });
    }
};

exports.createTaskInProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, description, members, assignedTo, dueDate, priority } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const task = new Task({ title, description, members, assignedTo, dueDate, priority, project: projectId });
        await task.save();

        project.tasks.push(task._id);
        await project.save();

        res.status(201).json({ success: true, message: 'Task created successfully in project', task });
    } catch (error) {
        console.error('Error creating task in project:', error);
        res.status(500).json({ 
            error: 'Failed to create task in project',
            details: error.message 
        });
    }
};

exports.completeTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = 'completed';
        await task.save();

        // Update project completion percentage
        const project = await Project.findById(task.project).populate('tasks');
        if (project) {
            const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
            project.completionPercentage = (completedTasks / project.tasks.length) * 100;
            await project.save();
        }

        res.status(200).json({ success: true, message: 'Task marked as complete', task });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ 
            error: 'Failed to complete task',
            details: error.message 
        });
    }
};

exports.getProjectOverview = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId).populate('tasks').populate('chief', 'username').populate({
            path: 'team',
            populate: {
                path: 'leader',
                model: 'User'
            }
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project overview:', error);
        res.status(500).json({ 
            error: 'Failed to fetch project overview',
            details: error.message 
        });
    }
};