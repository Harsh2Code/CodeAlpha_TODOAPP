import React from 'react';

function Projects() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-yellow-500 text-white text-center p-2">
        You are currently on a demo page.
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-gray-400">Manage your projects and track progress</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </div>
            <span>New Project</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-folder-line text-blue-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-gray-400 text-sm">Total Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-green-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-gray-400 text-sm">Active Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-time-line text-yellow-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            No projects yet. Click "New Project" to get started.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Projects;
