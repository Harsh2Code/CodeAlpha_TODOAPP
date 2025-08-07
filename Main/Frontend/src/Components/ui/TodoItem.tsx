
'use client';

import { useState } from 'react';

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  completed: boolean;
  project: string;
  notifications: string[];
  onToggleComplete: (id: string) => void;
}

export default function TodoItem({ 
  id, title, description, priority, assignee, assigneeAvatar, 
  dueDate, completed, project, notifications, onToggleComplete 
}: TodoItemProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  };

  const priorityBadgeColors = {
    high: 'bg-red-900 text-red-300 border-red-800',
    medium: 'bg-yellow-900 text-yellow-300 border-yellow-800',
    low: 'bg-green-900 text-green-300 border-green-800'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = new Date(dueDate) < new Date() && !completed;

  const handleSendNotification = () => {
    if (notificationMessage.trim()) {
      console.log('Notification sent to:', notifications, 'Message:', notificationMessage);
      setNotificationMessage('');
      setShowNotificationModal(false);
    }
  };

  return (
    <>
      <div className={`bg-gray-800 rounded-lg border-l-4 ${priorityColors[priority]} shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700 ${completed ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <button 
              onClick={() => onToggleComplete(id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                completed 
                  ? 'bg-green-600 border-green-600' 
                  : 'border-gray-600 hover:border-green-500'
              }`}
            >
              {completed && (
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`text-lg font-semibold ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityBadgeColors[priority]}`}>
                  {priority}
                </span>
              </div>
              <p className={`text-sm mb-3 ${completed ? 'text-gray-600' : 'text-gray-400'}`}>
                {description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                    {assigneeAvatar}
                  </div>
                  <span className="text-gray-400">{assignee}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-calendar-line text-gray-500"></i>
                  </div>
                  <span className={`${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                    {formatDate(dueDate)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-line text-gray-500"></i>
                  </div>
                  <span className="text-gray-400">{project}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button 
                onClick={() => setShowNotificationModal(true)}
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Send notification"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-notification-3-line"></i>
                </div>
              </button>
            )}
            
            {isOverdue && (
              <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-alarm-line"></i>
                </div>
                <span>Overdue</span>
              </div>
            )}
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-team-line text-gray-500"></i>
              </div>
              <span className="text-sm text-gray-400">Notifications sent to:</span>
              <div className="flex space-x-2">
                {notifications.map((person, index) => (
                  <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    {person}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Send Notification</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Notify team members about: <span className="font-medium text-white">{title}</span></p>
              <p className="text-sm text-gray-400">Recipients: {notifications.join(', ')}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg resize-none h-24 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your notification message..."
                maxLength={500}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendNotification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
