const Task = require('../../Models/Tasks');
const User = require('../../Models/Users');
const mongoose = require('mongoose'); // Import mongoose

exports.getMemberTasks = async (req, res) => {
    try {
        console.log("Attempting to fetch member tasks...");
        console.log("Type of req.user.id:", typeof req.user.id);
        console.log("req.user.id:", req.user.id);

        // Ensure memberId is a string representation of ObjectId
        const memberId = req.user.id ? req.user.id.toString() : null;
        console.log("Converted Member ID:", memberId);

        if (!memberId) {
            return res.status(401).json({ message: "Unauthorized: Member ID not found or invalid." });
        }

        // Find the current member's user document to get their chief's ID
        const memberUser = await User.findById(memberId);
        if (!memberUser || !memberUser.chief) {
            return res.status(404).json({ message: "Member or associated chief not found." });
        }
        const memberChiefId = memberUser.chief;
        console.log("Member's Chief ID:", memberChiefId);

        const query = {
            assignedTo: new mongoose.Types.ObjectId(memberId),
            createdBy: new mongoose.Types.ObjectId(memberChiefId)
        };
        console.log("MongoDB Query:", JSON.stringify(query));

        // Find tasks assigned to the current member AND created by their chief
        const tasks = await Task.find(query)
        .populate('createdBy', 'username')
        .populate('assignedTo', 'username')
        .populate('project', 'name');

        console.log("Tasks found for member and their chief:", tasks.length);

        res.status(200).json({ tasks: tasks });
    } catch (error) {
        console.error("Error fetching member tasks:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectTasksForMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const memberId = req.user.id ? req.user.id.toString() : null;

        if (!memberId || !projectId) {
            return res.status(400).json({ message: "Bad Request: Member ID or Project ID not found." });
        }

        const memberUser = await User.findById(memberId);
        if (!memberUser || !memberUser.chief) {
            return res.status(404).json({ message: "Member or associated chief not found." });
        }
        const memberChiefId = memberUser.chief;

        const query = {
            project: new mongoose.Types.ObjectId(projectId),
            assignedTo: new mongoose.Types.ObjectId(memberId),
            createdBy: new mongoose.Types.ObjectId(memberChiefId)
        };

        const tasks = await Task.find(query)
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username')
            .populate('project', 'name');

        res.status(200).json(tasks);

    } catch (error) {
        console.error("Error fetching project tasks for member:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.markTaskAsComplete = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.status = 'completed';
        await task.save();

        res.status(200).json({ message: "Task marked as completed successfully!", task });
    } catch (error) {
        console.error("Error marking task as complete:", error);
        res.status(500).json({ message: error.message });
    }
};
