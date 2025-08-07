
'use client';

interface Phase {
  name: string;
  completed: boolean;
  current?: boolean;
}

interface ProjectFlowProps {
  project: {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'active' | 'completed' | 'paused';
    priority: 'high' | 'medium' | 'low';
    phases: Phase[];
  };
}

export default function ProjectFlow({ project }: ProjectFlowProps) {
  const { title, description, progress, status, priority, phases } = project;
  
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
    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
        
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Project Flow</h4>
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {phases.map((phase, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex flex-col items-center min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  phase.completed 
                    ? 'bg-green-600 border-green-500 text-white' 
                    : phase.current 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}>
                  {phase.completed ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-check-line"></i>
                    </div>
                  ) : phase.current ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-play-line"></i>
                    </div>
                  ) : (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-time-line"></i>
                    </div>
                  )}
                </div>
                <span className={`text-sm mt-2 text-center whitespace-nowrap ${
                  phase.completed 
                    ? 'text-green-400' 
                    : phase.current 
                      ? 'text-blue-400' 
                      : 'text-gray-500'
                }`}>
                  {phase.name}
                </span>
                {phase.current && (
                  <span className="text-xs text-blue-400 mt-1">In Progress</span>
                )}
              </div>
              
              {index < phases.length - 1 && (
                <div className={`w-12 h-0.5 ${
                  phases[index + 1].completed || phase.completed 
                    ? 'bg-green-500' 
                    : 'bg-gray-600'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            Completed: {phases.filter(p => p.completed).length} of {phases.length} phases
          </span>
          <span className="text-gray-400">
            Next: {phases.find(p => !p.completed)?.name || 'All phases complete'}
          </span>
        </div>
      </div>
    </div>
  );
}