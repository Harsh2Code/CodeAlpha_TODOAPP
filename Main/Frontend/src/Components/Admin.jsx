import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

function Admin() {
    const [data, setData] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_APP_API_URL + '/api/admin/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    if (!data) {
        return <div>Loading...</div>;
    }

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
                                <p className="text-2xl font-bold text-white">{data?.activeProjects || 0}</p>
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
                                <p className="text-2xl font-bold text-white">{data?.tasksCompleted || 0}</p>
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
                                <p className="text-2xl font-bold text-white">{data?.teamMembers || 0}</p>
                                <p className="text-gray-400 text-sm">Team Members</p>
                            </div></div></div><div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                        <div className="flex items-center"><div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-time-line text-red-400 text-2xl"></i>
                            </div>
                        </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">{data?.overdueTasks || 0}</p>
                                <p className="text-gray-400 text-sm">Overdue Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-6">Active Projects</h2>
                        <div className="grid gap-6">
                            {data?.projects?.map((project) => (
                                <div key={project.id} className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                                            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${project.status === 'active' ? 'bg-green-900 text-green-300 border-green-800' : 'bg-blue-900 text-blue-300 border-blue-800'}`}>{project.status}</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${project.priority === 'high' ? 'bg-red-900 text-red-300 border-red-800' : 'bg-yellow-900 text-yellow-300 border-yellow-800'}`}>{project.priority}</span>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-300">Progress</span>
                                            <span className="text-sm font-medium text-white">{project.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: `${project.progress || 0}%`}}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <i className="ri-team-line text-gray-500"></i>
                                            </div>
                                            <span className="text-sm text-gray-400">{project.members || 0} members</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <i className="ri-calendar-line text-gray-500"></i>
                                            </div>
                                            <span className="text-sm text-gray-400">{project.dueDate || 'No due date'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Upcoming Tasks</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <div className="space-y-4">
                                    {data?.upcomingTasks?.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
                                            <div>
                                                <h4 className="font-medium text-white">{task.name}</h4>
                                                <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${task.priority === 'high' ? 'bg-red-900 text-red-300 border-red-800' : task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300 border-yellow-800' : 'bg-green-900 text-green-300 border-green-800'}`}>{task.priority}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <div className="space-y-4">
                                    {data?.recentActivity && data?.recentActivity.length > 0 ? (
                                        data?.recentActivity?.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">{activity.user?.initial || '?'}</div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">
                                                        <span className="font-medium">{activity.user?.name || 'Unknown'}</span> {activity.action}
                                                        <span className="font-medium"> {activity.target}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                                    )}
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