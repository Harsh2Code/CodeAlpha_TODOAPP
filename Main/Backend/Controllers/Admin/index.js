const User = require('../../Models/Users');
const Team = require('../../Models/Teams');
const Task = require('../../Models/Tasks');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
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
