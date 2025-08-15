import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900">
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to <span className="text-blue-400 font-['Pacifico']">ProjectFlow</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Streamline your project management with our comprehensive platform featuring todo lists, 
            team collaboration, and project flow tracking.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              href="/preview/dc2e455e-4b9c-499c-9a40-b264f94431bb/1694150/dashboard"
            >
              Get Started
            </a>
            <a 
              className="bg-gray-800 text-gray-300 px-8 py-3 rounded-lg font-medium border border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              href="/preview/dc2e455e-4b9c-499c-9a40-b264f94431bb/1694150/projects"
            >
              View Projects
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 rounded-lg p-8 shadow-sm text-center border border-gray-700">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-blue-400 text-3xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Smart Todo Lists
            </h3>
            <p className="text-gray-400">
              Create, manage, and track tasks with priority levels and team assignments
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-sm text-center border border-gray-700">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-notification-3-line text-green-400 text-3xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Team Notifications
            </h3>
            <p className="text-gray-400">
              Send instant notifications to team members about task updates and progress
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-sm text-center border border-gray-700">
            <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-team-line text-purple-400 text-3xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Team Management
            </h3>
            <p className="text-gray-400">
              Create and manage teams with role-based access and collaboration tools
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Project Flow Tracking
            </h3>
            <p className="text-gray-400 mb-6">
              Visualize your project progress with our intuitive flow tracking system. 
              See what's complete, what's in progress, and what's next in the pipeline.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Real-time progress tracking
              </li>
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Visual project timelines
              </li>
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Milestone tracking
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Collaborative Features
            </h3>
            <p className="text-gray-400 mb-6">
              Work seamlessly with your team using our built-in collaboration tools 
              designed to keep everyone on the same page.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Team-wide notifications
              </li>
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Task assignment system
              </li>
              <li className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-3">
                  <i className="ri-check-line text-green-400"></i>
                </div>
                Project activity feeds
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
