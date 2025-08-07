const Task = require('../../Models/Tasks');

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('team');
    res.json(tasks);
  } catch (error) {
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
