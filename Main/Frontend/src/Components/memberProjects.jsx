import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function MemberProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'flow'
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        console.log('MemberProjects: useEffect triggered');
        console.log('Token:', token);
        console.log('User:', user);
        console.log('User Chief ID:', user?.chief);

        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/member/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('API Result (all projects):', result);

                // Corrected filtering logic: project.chief is an object, user.chief is an ID
                const memberProjects = result.filter(project => project.chief && project.chief._id === user.chief);
                console.log('Filtered Member Projects:', memberProjects);

                setProjects(memberProjects);
                toast.success('Projects loaded successfully!');
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects.');
                toast.error('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };

        if (token && user && user.chief) { // Ensure user.chief is available
            fetchProjects();
        } else if (!token) {
            console.log('No token, not fetching projects.');
        } else if (!user) {
            console.log('No user object, not fetching projects.');
        } else if (!user.chief) {
            console.log('User.chief is missing, not fetching projects.');
        }
    }, [token, user]);

    const handleProjectClick = (projectId) => {
        navigate(`/member/projects/${projectId}/tasks`);
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                <p>Loading projects...</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-folder-line text-blue-400 text-2xl"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{projects.length}</p>
                            <p className="text-gray-400 text-sm">Total Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-play-circle-line text-green-400 text-2xl"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'active' || p.status === 'in-progress').length}</p>
                            <p className="text-gray-400 text-sm">Active Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-checkbox-circle-line text-purple-400 text-2xl"></i>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</p>
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
                            <p className="text-2xl font-bold text-white">{projects.length > 0 ? (projects.reduce((acc, p) => acc + p.completionPercentage, 0) / projects.length).toFixed(0) : 0}%</p>
                            <p className="text-gray-400 text-sm">Average Progress</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'space-y-8'}>
                {projects.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center col-span-full">
                        <div>
                            <i className="ri-emotion-2-line text-4xl"></i>
                            <p>No projects found.</p>
                        </div>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 cursor-pointer"
                            onClick={() => handleProjectClick(project._id)} // Add onClick handler
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                                    <p className="text-gray-400">{project.description}</p>
                                    {console.log('Project Chief:', project.chief)}
                                    {project.chief && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            Created by: <span className="font-medium text-gray-400">{project.chief.username || project.chief.name}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${project.status === 'active' || project.status === 'in-progress' ? 'bg-green-900 text-green-300 border-green-800' : 'bg-blue-900 text-blue-300 border-blue-800'}`}>{project.status}</span>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${project.priority === 'high' ? 'bg-red-900 text-red-300 border-red-800' : project.priority === 'medium' ? 'bg-yellow-900 text-yellow-300 border-yellow-800' : 'bg-blue-900 text-blue-300 border-blue-800'}`}>{project.priority}</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                                    <span className="text-sm font-medium text-white">{project.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{width: `${project.completionPercentage}%`}}>
                                    </div>
                                </div>
                            </div>
                            {viewMode === 'flow' && (
                                <div>
                                    <h4 className="text-lg font-medium text-white mb-4">Project Flow</h4>
                                    {/* Project Flow - This part is hardcoded in the original, needs dynamic data */}
                                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                                        {/* Example of a single flow step, you'd map over project.flow or similar */}
                                        <div className="flex flex-col items-center min-w-0">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-green-600 border-green-500 text-white">
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    <i className="ri-check-line"></i>
                                                </div>
                                            </div>
                                            <span className="text-sm mt-2 text-center whitespace-nowrap text-green-400">Planning</span>
                                        </div>
                                        <div className="w-12 h-0.5 bg-green-500"></div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center min-w-0">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-green-600 border-green-500 text-white">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        <i className="ri-check-line"></i>
                                                    </div>
                                                </div>
                                                <span className="text-sm mt-2 text-center whitespace-nowrap text-green-400">Design</span>
                                            </div>
                                            <div className="w-12 h-0.5 bg-green-500"></div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center min-w-0">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 border-blue-500 text-white">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        <i className="ri-play-line"></i>
                                                    </div>
                                                </div>
                                                <span className="text-sm mt-2 text-center whitespace-nowrap text-blue-400">Development</span>
                                                <span className="text-xs text-blue-400 mt-1">In Progress</span>
                                            </div>
                                            <div className="w-12 h-0.5 bg-gray-600"></div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center min-w-0">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-gray-700 border-gray-600 text-gray-400">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        <i className="ri-time-line"></i>
                                                    </div>
                                                </div>
                                                <span className="text-sm mt-2 text-center whitespace-nowrap text-gray-500">Testing</span>
                                            </div>
                                            <div className="w-12 h-0.5 bg-gray-600"></div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center min-w-0">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-gray-700 border-gray-600 text-gray-400">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        <i className="ri-time-line"></i>
                                                    </div>
                                                </div>
                                                <span className="text-sm mt-2 text-center whitespace-nowrap text-gray-500">Deployment</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Completed: X of Y phases</span>
                                    <span className="text-gray-400">Next: Z</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default MemberProjects;
