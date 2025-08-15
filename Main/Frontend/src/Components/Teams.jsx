import React from 'react';

function Teams() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div role="alert" className="alert alert-warning alert-soft flex justify-between mt-0 rounded-tr-none rounded-tl-none">
        <span className='ml-8'>You are at demo. for full access Register AND Login.</span>
        <button className="btn btn-sm btn-primary mr-8" onClick={() => setShowModal(true)}>Add Chief</button>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
            <p className="text-gray-400">Create and manage your project teams</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </div>
            <span>Create Team</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-team-line text-blue-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-gray-400 text-sm">Total Teams</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-user-line text-green-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">11</p>
                <p className="text-gray-400 text-sm">Total Members</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-user-smile-line text-emerald-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">7</p>
                <p className="text-gray-400 text-sm">Members Online</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-folder-user-line text-purple-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">11</p>
                <p className="text-gray-400 text-sm">Active Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-900 border-blue-800"></div>
                  <h3 className="text-lg font-semibold text-white">Frontend Development</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Responsible for user interface development and user experience design
                </p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Invite member"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-add-line"></i>
                </div>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Team Members</span>
                <span className="text-sm text-gray-400">3</span>
              </div>
              <div className="flex -space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    SC
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    MJ
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    ED
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-500"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Active Projects</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">3</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Tasks Done</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">47</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-900 border-green-800"></div>
                  <h3 className="text-lg font-semibold text-white">Backend Development</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Server-side development, API design, and database management
                </p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Invite member"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-add-line"></i>
                </div>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Team Members</span>
                <span className="text-sm text-gray-400">3</span>
              </div>
              <div className="flex -space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    AK
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    LW
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-yellow-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    TR
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Active Projects</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">2</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Tasks Done</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">32</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-900 border-purple-800"></div>
                  <h3 className="text-lg font-semibold text-white">QA & Testing</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Quality assurance, testing automation, and bug tracking
                </p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Invite member"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-add-line"></i>
                </div>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Team Members</span>
                <span className="text-sm text-gray-400">2</span>
              </div>
              <div className="flex -space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    RG
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    DK
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-500"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Active Projects</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">4</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Tasks Done</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">28</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-900 border-orange-800"></div>
                  <h3 className="text-lg font-semibold text-white">Design Team</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Product design, branding, and visual communications
                </p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Invite member"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-add-line"></i>
                </div>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Team Members</span>
                <span className="text-sm text-gray-400">3</span>
              </div>
              <div className="flex -space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    JT
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    MW
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-yellow-500"></div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                    AF
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 bg-green-500"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Active Projects</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">2</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-400">Tasks Done</span>
                </div>
                <p className="text-xl font-semibold text-white mt-1">35</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Teams;
