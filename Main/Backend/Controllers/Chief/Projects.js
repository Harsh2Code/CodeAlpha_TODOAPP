const Project = require('../../Models/Projects');
const Task = require('../../Models/Tasks');

exports.createProject = async (req, res) => {
    const { name, description, priority } = req.body;
    try {
        const project = new Project({ name, description, priority, chief: req.user.id });
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
        const projects = await Project.find({ chief: req.user.id }).populate('tasks');
        res.status(200).json(projects);
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
    const { name, description, priority, status } = req.body;
    console.log('Received update project request for projectId:', projectId);
    console.log('Request body:', req.body);
    try {
        const project = await Project.findByIdAndUpdate(
            projectId,
            { name, description, priority, status },
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project updated successfully', project });
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
        const project = await Project.findById(projectId).populate('tasks').populate('chief', 'username');
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