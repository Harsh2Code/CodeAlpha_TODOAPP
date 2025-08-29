import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { getBackendUrl } from '../api';

const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const setUrl = async () => {
        const url = await getBackendUrl();
        setBackendUrl(url);
    };
    setUrl();
  }, []);

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    if (!user || !backendUrl) {
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user || !backendUrl) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (user && backendUrl) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, backendUrl]);

  const getNotificationIcon = (type) => {
    const icons = {
      task_completed: 'ri-checkbox-circle-line',
      task_overdue: 'ri-time-line',
      task_assigned: 'ri-user-add-line',
      member_promoted: 'ri-user-star-line',
      task_pending: 'ri-loader-4-line',
      task_running_late: 'ri-alert-line',
      project_created: 'ri-folder-line',
      team_invitation: 'ri-team-line',
      task_assigned_by_chief: 'ri-send-plane-line',
      task_completed_notification: 'ri-checkbox-circle-fill'
    };
    return icons[type] || 'ri-notification-3-line';
  };

  const getNotificationColor = (type) => {
    const colors = {
      task_completed: 'text-green-500',
      task_overdue: 'text-red-500',
      task_assigned: 'text-blue-500',
      member_promoted: 'text-purple-500',
      task_pending: 'text-yellow-500',
      task_running_late: 'text-orange-500',
      project_created: 'text-indigo-500',
      team_invitation: 'text-pink-500',
      task_assigned_by_chief: 'text-purple-500',
      task_completed_notification: 'text-green-500'
    };
    return colors[type] || 'text-gray-500';
  };

  const formatNotificationMessage = (notification) => {
    // If task details are available, enhance the message with user names
    if (notification.taskDetails) {
      const { taskDetails } = notification;
      
      switch (notification.type) {
        case 'task_assigned':
          if (taskDetails.assignedTo && taskDetails.assignedTo.length > 0) {
            const assigneeNames = taskDetails.assignedTo.map(user => user.name || user.username).join(', ');
            return `Task "${taskDetails.title}" assigned to ${assigneeNames}`;
          }
          break;
          
        case 'task_assigned_by_chief':
          if (taskDetails.assignedTo && taskDetails.assignedTo.length > 0) {
            const assigneeNames = taskDetails.assignedTo.map(user => user.name || user.username).join(', ');
            return `You assigned task: ${taskDetails.title} to ${assigneeNames}`;
          }
          break;
          
        case 'task_completed':
          if (taskDetails.createdBy && taskDetails.createdBy.name) {
            return `Task "${taskDetails.title}" completed by ${taskDetails.createdBy.name}`;
          }
          break;
          
        default:
          // For other types, return the original message
          return notification.message;
      }
    }
    
    // Return original message if no enhancement is needed
    return notification.message;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const markAsRead = async (id) => {
    if (!backendUrl) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backendUrl}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!backendUrl) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backendUrl}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowNotifications(!showNotifications);
          if (!showNotifications) {
            fetchNotifications();
          }
        }}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        <i className="ri-notification-3-line text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <i className="ri-notification-off-line text-4xl text-gray-500 mb-2"></i>
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-gray-700/50' : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)} bg-gray-700`}>
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {notification.title}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
