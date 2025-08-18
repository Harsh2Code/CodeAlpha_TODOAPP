import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function ChiefProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        priority: 'medium',
        teamId: ''
    });
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/chief/teams', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setTeams(result);
            } catch (error) {
                console.error('Error fetching teams:', error);
                setTeams([]);
            }
        };

        if (token) {
            fetchTeams();
        }
    }, [token]);

    useEffect(() => {
        const fetchDetailedProjects = async () => {
            try {
                const response = await fetch('/api/chief/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Enhance projects with task statistics similar to memberProjects
                const enhancedProjects = result.map(project => ({
                    ...project,
                    taskStats: {
                        total: project.tasks?.length || 0,
                        completed: project.tasks?.filter(task => task.status === 'completed').length || 0,
                        inProgress: project.tasks?.filter(task => task.status === 'in-progress').length || 0,
                        pending: project.tasks?.filter(task => task.status === 'pending').length || 0,
                        completionPercentage: project.tasks?.length > 0 
                            ? Math.round((project.tasks.filter(task => task.status === 'completed').length / project.tasks.length) * 100)
                            : 0
                    },
                    recentTasks: project.tasks?.slice(0, 3) || []
                }));
                
                setProjects(enhancedProjects);
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

    const handleCreateProject = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/chief/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProject)
            });
            const result = await response.json();
            if (!response.ok) {
                console.error('Error creating project:', result);
                toast.error(`Failed to create project: ${result.message || result.error}`);
            } else {
                setShowCreateProjectModal(false);
                setNewProject({ name: '', description: '', priority: 'medium', teamId: '' });
                toast.success('Project created successfully!');
                // Refetch projects to update the list
                const response = await fetch('http://localhost:3001/api/chief/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const updatedProjects = await response.json();
                setProjects(updatedProjects);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('An unexpected error occurred while creating the project.');
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/chief/projects/${projectId}/tasks`);
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
        <main className="max-w-7xl min-h-screen mx-auto px-6 py-8">
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
                    <button onClick={() => setShowCreateProjectModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                        </div>
                        <span>New Project</span>
                    </button>
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
            {showCreateProjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Create New Project</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter project description"
                                    maxLength={500}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                <select
                                    value={newProject.priority}
                                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Team</label>
                                <select
                                    value={newProject.teamId}
                                    onChange={(e) => setNewProject({ ...newProject, teamId: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select a team</option>
                                    {teams.map((team) => (
                                        <option key={team._id} value={team._id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowCreateProjectModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default ChiefProjects;