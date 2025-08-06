import React from 'react'

function Admin() {
    return (
        <div>
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening with your projects.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <i className="ri-folder-line text-blue-400 text-2xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">12</p>
                                <p className="text-gray-400 text-sm">Active Projects</p>
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
                                <p className="text-2xl font-bold text-white">47</p>
                                <p className="text-gray-400 text-sm">Tasks Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <i className="ri-team-line text-yellow-400 text-2xl"></i>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">8</p>
                                <p className="text-gray-400 text-sm">Team Members</p>
                            </div></div></div><div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                        <div className="flex items-center"><div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-time-line text-red-400 text-2xl"></i>
                            </div>
                        </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">5</p>
                                <p className="text-gray-400 text-sm">Overdue Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-6">Active Projects</h2>
                        <div className="grid gap-6">
                            <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">Website Redesign</h3>
                                        <p className="text-gray-400 text-sm mb-3">Complete overhaul of company website with modern design and improved UX</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-900 text-green-300 border-green-800">active</span>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-900 text-red-300 border-red-800">high</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-300">Progress</span>
                                        <span className="text-sm font-medium text-white">75%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: "75%"}}>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-team-line text-gray-500"></i>
                                        </div>
                                        <span className="text-sm text-gray-400">5 members</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-calendar-line text-gray-500"></i>
                                        </div>
                                        <span className="text-sm text-gray-400">Dec 30, 2024</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">Mobile App Development</h3>
                                        <p className="text-gray-400 text-sm mb-3">Native iOS and Android app for customer engagement</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-900 text-green-300 border-green-800">active</span>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-900 text-yellow-300 border-yellow-800">medium</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-300">Progress</span>
                                        <span className="text-sm font-medium text-white">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: "45%"}}>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-team-line text-gray-500"></i>
                                        </div>
                                        <span className="text-sm text-gray-400">3 members</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-calendar-line text-gray-500"></i>
                                        </div>
                                        <span className="text-sm text-gray-400">Jan 15, 2025</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">Database Migration</h3>
                                        <p className="text-gray-400 text-sm mb-3">Migrate legacy database to new cloud infrastructure</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-900 text-blue-300 border-blue-800">completed</span>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-900 text-red-300 border-red-800">high</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">




                                        <span className="text-sm font-medium text-gray-300">Progress</span>
                                        <span className="text-sm font-medium text-white">100%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: "100%"}}>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-team-line text-gray-500"></i>
                                        </div><span className="text-sm text-gray-400">2 members</span>
                                    </div><div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <i className="ri-calendar-line text-gray-500"></i>
                                        </div>
                                        <span className="text-sm text-gray-400">Dec 15, 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Upcoming Tasks</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
                                        <div>
                                            <h4 className="font-medium text-white">Review design mockups</h4>
                                            <p className="text-sm text-gray-400">Due: Today</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-900 text-red-300 border-red-800">high</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
                                        <div>
                                            <h4 className="font-medium text-white">Setup CI/CD pipeline</h4>
                                            <p className="text-sm text-gray-400">Due: Tomorrow</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-900 text-yellow-300 border-yellow-800">medium</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors"><div>
                                        <h4 className="font-medium text-white">Team standup meeting</h4>
                                        <p className="text-sm text-gray-400">Due: Today</p>
                                    </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-900 text-green-300 border-green-800">low</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors"><div>
                                        <h4 className="font-medium text-white">Code review session</h4>
                                        <p className="text-sm text-gray-400">Due: Dec 28</p>

                                    </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-900 text-yellow-300 border-yellow-800">medium</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">S</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">Sarah Chen</span> completed task
                                                <span className="font-medium"> API integration</span>
                                            </p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">M</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">Mike Johnson</span>
                                                 created project
                                                 <span className="font-medium"> Marketing Campaign</span>
                                            </p>
                                            <p className="text-xs text-gray-500">4 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">E</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">Emma Davis</span>
                                                 updated status
                                                 <span className="font-medium"> Website Redesign</span>
                                            </p>
                                            <p className="text-xs text-gray-500">6 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">A</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">Alex Kumar</span> 
                                                added comment
                                                <span className="font-medium"> Database Migration</span>
                                            </p>
                                            <p className="text-xs text-gray-500">8 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Admin