import React from 'react'

function Teams() {
  return (
    <div>
        <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
            <p className="text-gray-400">Create and manage your project teams</p>
          </div>

          <button 
            onClick={() => setShowCreateTeam(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors"
          >
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
                <p className="text-2xl font-bold text-white">{teams.length}</p>
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
                <p className="text-2xl font-bold text-white">{totalMembers}</p>
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
                <p className="text-2xl font-bold text-white">{onlineMembers}</p>
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
                <p className="text-2xl font-bold text-white">
                  {teams.reduce((acc, team) => acc + team.activeProjects, 0)}
                </p>
                <p className="text-gray-400 text-sm">Active Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard 
              key={team.id} 
              {...team} 
              onInvite={(teamId) => {
                setSelectedTeam(teamId);
                setShowInviteModal(true);
              }}
            />
          ))}
        </div>
      </main>

      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Create New Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter team description"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Team Color</label>
                <div className="flex space-x-2">
                  {['blue', 'green', 'purple', 'orange', 'red', 'indigo'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTeam({...newTeam, color})}
                      className={`w-8 h-8 rounded-full bg-${color}-500 ${
                        newTeam.color === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-gray-400' : ''
                      } cursor-pointer`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <input
                  type="text"
                  value={inviteData.role}
                  onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Developer, Designer, Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message (Optional)</label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Add a personal message..."
                  maxLength={500}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendInvite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default Teams