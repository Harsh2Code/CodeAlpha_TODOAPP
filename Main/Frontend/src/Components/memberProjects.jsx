import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function MemberProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetailedProjects = async () => {
            try {
const response = await fetch(import.meta.env.VITE_APP_API_URL + '/api/member/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                
                const result = await response.json();
                console.log('MemberProjects API result:', result);
                console.log('User ID:', user.id);

                // The backend already filters projects for the member, so no need to filter again
                const memberProjects = result;

                console.log('Filtered member projects:', memberProjects);
                setProjects(memberProjects);
                toast.success('Projects loaded successfully!');
            } catch (err) {
                console.error('Error fetching detailed projects:', err);
                setError('Failed to load projects.');
                toast.error('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };

        if (token && user) {
            fetchDetailedProjects();
        }
    }, [token, user]);

    const handleProjectClick = (projectId) => {
        navigate(`/member/projects/${projectId}/tasks`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-900 text-green-300 border-green-800';
            case 'in-progress': return 'bg-blue-900 text-blue-300 border-blue-800';
            case 'pending': return 'bg-yellow-900 text-yellow-300 border-yellow-800';
            case 'on-hold': return 'bg-red-900 text-red-300 border-red-800';
            default: return 'bg-gray-900 text-gray-300 border-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-900 text-red-300 border-red-800';
            case 'medium': return 'bg-yellow-900 text-yellow-300 border-yellow-800';
            case 'low': return 'bg-green-900 text-green-300 border-green-800';
            default: return 'bg-gray-900 text-gray-300 border-gray-800';
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-blue-500';
        if (percentage >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                <div className="flex items-center justify-center mt-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-400">Loading projects...</span>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-red-400">
                <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    // Calculate overall statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const averageProgress = totalProjects > 0 
        ? Math.round(projects.reduce((acc, p) => acc + (p.taskStats?.completionPercentage || p.completionPercentage || 0), 0) / totalProjects)
        : 0;

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <Toaster richColors />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-gray-400">Manage and track your project progress</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors cursor-pointer whitespace-nowrap ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode('flow')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors cursor-pointer whitespace-nowrap ${viewMode === 'flow' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Flow View
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                            <i className="ri-folder-line text-blue-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{totalProjects}</p>
                            <p className="text-gray-400 text-sm">Total Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                            <i className="ri-play-circle-line text-green-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{activeProjects}</p>
                            <p className="text-gray-400 text-sm">Active Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                            <i className="ri-checkbox-circle-line text-purple-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{completedProjects}</p>
                            <p className="text-gray-400 text-sm">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                            <i className="ri-time-line text-yellow-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{averageProgress}%</p>
                            <p className="text-gray-400 text-sm">Average Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'space-y-8'}>
                {projects.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center col-span-full">
                        <div>
                            <i className="ri-emotion-2-line text-4xl mb-2"></i>
                            <p>No projects found.</p>
                            <p className="text-sm text-gray-400 mt-2">Projects will appear here when assigned to you.</p>
                        </div>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer"
                            onClick={() => handleProjectClick(project._id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                                    {project.chief && (
                                        <p className="text-gray-500 text-xs">
                                            Created by: <span className="font-medium text-gray-300">{project.chief.username}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                                        {project.priority}
                                    </span>
                                </div>
                            </div>

                            {/* Task Statistics */}
                            {project.taskStats && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-300">Progress</span>
                                        <span className="text-sm font-medium text-white">{project.taskStats.completed}/{project.taskStats.total} tasks</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.taskStats.completionPercentage || project.completionPercentage)}`} 
                                            style={{width: `${project.taskStats.completionPercentage || project.completionPercentage}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                                        <span>{project.taskStats.pending} pending</span>
                                        <span>{project.taskStats.inProgress} in progress</span>
                                        <span>{project.taskStats.completed} completed</span>
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-lg font-bold text-white">{project.taskStats?.total || 0}</p>
                                    <p className="text-xs text-gray-400">Tasks</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-green-400">{project.taskStats?.completed || 0}</p>
                                    <p className="text-xs text-gray-400">Done</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-yellow-400">{project.taskStats?.inProgress || 0}</p>
                                    <p className="text-xs text-gray-400">Active</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            {project.recentTasks && project.recentTasks.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Tasks</h4>
                                    <div className="space-y-1">
                                        {project.recentTasks.slice(0, 3).map(task => (
                                            <div key={task._id} className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 truncate">{task.title}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default MemberProjects;
