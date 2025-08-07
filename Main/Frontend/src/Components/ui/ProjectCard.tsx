
'use client';

const ProjectCardProps = {
  id: '',
  title: '',
  description: '',
  progress: 0,
  teamMembers: 0,
  dueDate: '',
  status: ['active' , 'completed' , 'paused'],
  priority: ['high', 'medium','low']
}

export default function ProjectCard({ 
  title, description, progress, teamMembers, dueDate, status, priority 
}) {
  const statusColors = {
    active: 'bg-green-900 text-green-300 border-green-800',
    completed: 'bg-blue-900 text-blue-300 border-blue-800',
    paused: 'bg-gray-700 text-gray-300 border-gray-600'
  };

  const priorityColors = {
    high: 'bg-red-900 text-red-300 border-red-800',
    medium: 'bg-yellow-900 text-yellow-300 border-yellow-800',
    low: 'bg-green-900 text-green-300 border-green-800'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-3">{description}</p>
        </div>
        
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-team-line text-gray-500"></i>
          </div>
          <span className="text-sm text-gray-400">{teamMembers} members</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-line text-gray-500"></i>
          </div>
          <span className="text-sm text-gray-400">{dueDate}</span>
        </div>
      </div>
    </div>
  );
}