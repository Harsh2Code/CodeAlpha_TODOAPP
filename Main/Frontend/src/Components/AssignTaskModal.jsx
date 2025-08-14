import React, { useState, useEffect } from 'react';

const AssignTaskModal = ({ member, onClose, onAssignTask }) => {
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    project: '',
  });

  // You might want to fetch projects here or pass them as a prop
  const [projects, setProjects] = useState([]); 

  useEffect(() => {
    // Fetch projects that the chief can assign tasks to
    // This would typically be projects created by the chief or projects associated with their teams
    const fetchProjects = async () => {
      try {
        // Replace with your actual API endpoint for fetching chief's projects
        const response = await fetch('/api/chief/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data.projects || data); // Adjust based on your API response structure
        } else {
          console.error('Failed to fetch projects:', data.message);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssignTask(member.id, taskDetails);
    onClose();
  };

  if (!member) return null; // Don't render if no member is selected

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Assign Task to {member.name}</h3>
        
        <div className="mb-4 text-gray-300">
          <p><strong>Name:</strong> {member.name}</p>
          <p><strong>Role:</strong> {member.role}</p>
          {/* Add more member details as needed */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
            <input
              type="text"
              name="title"
              value={taskDetails.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={taskDetails.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskDetails.dueDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
            <select
              name="priority"
              value={taskDetails.priority}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
            <select
              name="project"
              value={taskDetails.project}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a project</option>
              {projects.map(proj => (
                <option key={proj._id} value={proj._id}>{proj.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;