const Notification = require('../Models/Notification');
const User = require('../Models/Users');
const mongoose = require('mongoose');

// Get all notifications for a user
  const getNotifications = async (req, res) => {
    try {
      const userIdString = req.user.id;
      
      let userId;
      try {
        userId = new mongoose.Types.ObjectId(userIdString);
      } catch (err) {
        console.error('getNotifications: Error converting userId to ObjectId:', err);
        return res.status(400).json({ message: 'Invalid User ID format.' });
      }

      const { page = 1, limit = 20, unread = false } = req.query;

      const query = { userId };
      if (unread === 'true') {
        query.read = false;
      }

      // Fetch notifications with populated user details
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Enhanced notifications with user details
      const enhancedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const notificationObj = notification.toObject();
          
          // Replace user IDs with actual names in messages
          let enhancedMessage = notification.message;
          
          // For task-related notifications, populate user details
          if (notification.relatedModel === 'Task' && notification.relatedId) {
            try {
              const Task = require('../Models/Tasks');
              const User = require('../Models/Users');
              
              const task = await Task.findById(notification.relatedId)
                .populate('assignedTo', 'name username email')
                .populate('createdBy', 'name username email');
              
              if (task) {
                // Replace user IDs with names in messages
                if (task.assignedTo && task.assignedTo.length > 0) {
                  const assigneeNames = task.assignedTo.map(user => user.name || user.username).join(', ');
                  enhancedMessage = enhancedMessage.replace(/\b[a-f\d]{24}\b/g, assigneeNames);
                }
                
                if (task.createdBy && task.createdBy.name) {
                  enhancedMessage = enhancedMessage.replace(/\b[a-f\d]{24}\b/g, task.createdBy.name);
                }
                
                notificationObj.taskDetails = {
                  title: task.title,
                  assignedTo: task.assignedTo,
                  createdBy: task.createdBy
                };
              }
            } catch (error) {
              console.error('Error populating task details:', error);
            }
          }
          
          // Ensure message contains user names instead of IDs
          notificationObj.message = enhancedMessage;
          notificationObj.displayMessage = enhancedMessage;
          
          return notificationObj;
        })
      );

      const total = await Notification.countDocuments(query);

      res.json({
        notifications: enhancedNotifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('getNotifications: Error:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notification
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    console.error('createNotification: Error creating notification:', error);
    throw error;
  }
};

// Notification service for different events
const notificationService = {
  // Task completed notification
  taskCompleted: async (task, userId, completerUsername) => {
    return createNotification({
      userId,
      type: 'task_completed',
      title: 'Task Completed',
      message: `Task "${task.title}" completed by ${completerUsername}.`,
      priority: 'medium',
      relatedId: task._id,
      relatedModel: 'Task'
    });
  },

  // Task overdue notification
  taskOverdue: async (task, userId) => {
    return createNotification({
      userId,
      type: 'task_overdue',
      title: 'Task Overdue',
      message: `${task.title} is overdue`,
      priority: 'high',
      relatedId: task._id,
      relatedModel: 'Task'
    });
  },

  // Task assigned notification
  taskAssigned: async (task, assigneeId, assignerName) => {
    return createNotification({
      userId: assigneeId,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `${assignerName} assigned you: ${task.title}`,
      priority: 'medium',
      relatedId: task._id,
      relatedModel: 'Task'
    });
  },

  // Member promoted notification
  memberPromoted: async (userId, newRole, promotedBy) => {
    return createNotification({
      userId,
      type: 'member_promoted',
      title: 'Role Updated',
      message: `You have been promoted to ${newRole} by ${promotedBy}`,
      priority: 'medium'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createNotification,
  notificationService
};
