const Team = require('../../Models/Teams');
const User = require('../../Models/Users');
const Task = require('../../Models/Tasks');

exports.createTeam = async (req, res) => {
  const { name, members } = req.body;
  const chief = req.user.id;
  try {
    const team = new Team({ name, chief, members });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
