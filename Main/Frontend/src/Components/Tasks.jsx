import React from 'react';

function Tasks() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div role="alert" className="alert alert-warning alert-soft flex justify-between mt-0 rounded-tr-none rounded-tl-none">
        <span className='ml-8'>You are at demo. for full access Register AND Login.</span>
        <button className="btn btn-sm btn-primary mr-8" onClick={() => setShowModal(true)}>Add Chief</button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Todo Lists</h1>
            <p className="text-gray-400">Manage tasks and send notifications to team members</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </div>
            <span>New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-list-check text-blue-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-gray-400 text-sm">Total Tasks</p>
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
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-gray-400 text-sm">Completed</p>
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
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-alarm-line text-red-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-gray-400 text-sm">High Priority</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            <button className="px-4 py-2 text-sm font-medium rounded-l-lg transition-colors cursor-pointer whitespace-nowrap bg-blue-600 text-white">
              All Tasks
            </button>
            <button className="px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap text-gray-400 hover:text-white">
              Pending
            </button>
            <button className="px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap text-gray-400 hover:text-white">
              Completed
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-r-lg transition-colors cursor-pointer whitespace-nowrap text-gray-400 hover:text-white">
              High Priority
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <button className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors border-gray-600 hover:border-green-500"></button>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Complete website redesign mockups
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-900 text-red-300 border-red-800">
                      high
                    </span>
                  </div>
                  <p className="text-sm mb-3 text-gray-400">
                    Create high-fidelity mockups for the new company website including desktop and mobile versions
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        SC
                      </div>
                      <span className="text-gray-400">Sarah Chen</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-calendar-line text-gray-500"></i>
                      </div>
                      <span className="text-red-400">Dec 28</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-folder-line text-gray-500"></i>
                      </div>
                      <span className="text-gray-400">Website Redesign</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" title="Send notification">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-notification-3-line"></i>
                  </div>
                </button>
                <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-alarm-line"></i>
                  </div>
                  <span>Overdue</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-team-line text-gray-500"></i>
                </div>
                <span className="text-sm text-gray-400">Notifications sent to:</span>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Mike Johnson
                  </span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Emma Davis
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <button className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors border-gray-600 hover:border-green-500"></button>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Setup CI/CD pipeline
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-900 text-yellow-300 border-yellow-800">
                      medium
                    </span>
                  </div>
                  <p className="text-sm mb-3 text-gray-400">
                    Configure automated testing and deployment pipeline for the mobile app project
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        AK
                      </div>
                      <span className="text-gray-400">Alex Kumar</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-calendar-line text-gray-500"></i>
                      </div>
                      <span className="text-red-400">Dec 29</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-folder-line text-gray-500"></i>
                      </div>
                      <span className="text-gray-400">Mobile App Development</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" title="Send notification">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-notification-3-line"></i>
                  </div>
                </button>
                <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-alarm-line"></i>
                  </div>
                  <span>Overdue</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-team-line text-gray-500"></i>
                </div>
                <span className="text-sm text-gray-400">Notifications sent to:</span>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Lisa Wang
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <button className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors border-gray-600 hover:border-green-500"></button>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      User feedback analysis
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-900 text-green-300 border-green-800">
                      low
                    </span>
                  </div>
                  <p className="text-sm mb-3 text-gray-400">
                    Analyze recent user feedback and create improvement recommendations
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        ED
                      </div>
                      <span className="text-gray-400">Emma Davis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-calendar-line text-gray-500"></i>
                      </div>
                      <span className="text-red-400">Jan 2</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-folder-line text-gray-500"></i>
                      </div>
                      <span className="text-gray-400">Marketing Campaign</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" title="Send notification">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-notification-3-line"></i>
                  </div>
                </button>
                <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-alarm-line"></i>
                  </div>
                  <span>Overdue</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-team-line text-gray-500"></i>
                </div>
                <span className="text-sm text-gray-400">Notifications sent to:</span>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Sarah Chen
                  </span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Mike Johnson
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <button className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors border-gray-600 hover:border-green-500"></button>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Security audit review
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-900 text-red-300 border-red-800">
                      high
                    </span>
                  </div>
                  <p className="text-sm mb-3 text-gray-400">
                    Review and address findings from the recent security audit
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        TR
                      </div>
                      <span className="text-gray-400">Tom Rodriguez</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-calendar-line text-gray-500"></i>
                      </div>
                      <span className="text-red-400">Dec 30</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-folder-line text-gray-500"></i>
                      </div>
                      <span className="text-gray-400">Backend Development</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" title="Send notification">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-notification-3-line"></i>
                  </div>
                </button>
                <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-alarm-line"></i>
                  </div>
                  <span>Overdue</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-team-line text-gray-500"></i>
                </div>
                <span className="text-sm text-gray-400">Notifications sent to:</span>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    Alex Kumar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tasks;
