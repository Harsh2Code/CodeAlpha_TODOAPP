import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import CreateTeamModal from './CreateTeamModal';
import EditTeamModal from './EditTeamModal';
import { toast } from 'sonner';
import { getBackendUrl } from '../api';

function ChiefDashboard() {
    const [data, setData] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false); // New state for CreateTeamModal
    const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        priority: 'medium',
        teamId: ''
    });
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        members: 0,
        assignedTo: [],
        dueDate: '',
        priority: 'medium',
    });
    const [editProject, setEditProject] = useState(null);
    const [showTeamDrawer, setShowTeamDrawer] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]); // New state for project-specific members
    const [projects, setProjects] = useState([]);
    const [backendUrl, setBackendUrl] = useState('');

    useEffect(() => {
        const setUrl = async () => {
            const url = await getBackendUrl();
            setBackendUrl(url);
        };
        setUrl();
    }, []);

    useEffect(() => {
        
        const fetchData = async () => {
            if (!backendUrl) return;
            try {
                const response = await fetch(`${backendUrl}/api/chief/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Chief Dashboard Data:', result);
                setData(result);
            } catch (error) {
                console.error('Error fetching chief data:', error);
                setData({ error: 'Failed to load dashboard data' });
                return;
            }
        };

        const fetchTeams = async () => {
            if (!backendUrl) return;
            try {
                const response = await fetch(`${backendUrl}/api/chief/teams`, {
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
                return;
            }
        };

        const fetchUsers = async () => {
            if (!backendUrl) return;
            try {
                const response = await fetch(`${backendUrl}/api/chief/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setUsers(result);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
                return;
            }
        };

        const fetchProjects = async () => {
            if (!backendUrl) return;
            try {
                const response = await fetch(`${backendUrl}/api/chief/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setProjects(result);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
                return;
            }
        };

        if (token && backendUrl) {
            fetchData();
            fetchTeams();
            fetchUsers();
            fetchProjects();
        }
    }, [token, backendUrl]);

    useEffect(() => {
        console.log({ selectedProjectInEffect: selectedProject, teamIdInEffect: selectedProject?.team?._id }); // Debugging
        const fetchProjectMembers = async () => {
            if (!backendUrl) return;
            if (selectedProject && selectedProject.team && selectedProject.team._id) {
                try {
                    const response = await fetch(`${backendUrl}/api/chief/teams/${selectedProject.team._id}/members`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    setProjectMembers(result);
                    console.log({ fetchedProjectMembers: result }); // Debugging
                } catch (error) {
                    console.error('Error fetching project members:', error);
                    setProjectMembers([]);
                }
            } else {
                setProjectMembers([]); // Clear members if no project or team is selected
            }
        };

        fetchProjectMembers();
    }, [selectedProject, token, backendUrl]); // Depend on selectedProject and token

    const handleCreateProject = async () => {
        if (!backendUrl) return;
        try {
            const response = await fetch(`${backendUrl}/api/chief/projects`, {
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
                // Optionally, refetch projects to update the list
                const response = await fetch(`${backendUrl}/api/chief/projects`, {
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

    const handleEditProject = async () => {
        if (!backendUrl) return;
        console.log('handleEditProject function called');
        
        try {
            const response = await fetch(`${backendUrl}/api/chief/projects/${editProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editProject.name,
                    description: editProject.description,
                    priority: editProject.priority,
                    status: editProject.status,
                    team: editProject.team // Include the team ID
                })
            });
            const result = await response.json();
            if (!response.ok) {
                console.error('Error updating project:', result);
                toast.error(`Failed to update project: ${result.message || result.error}`);
            } else {
                setShowEditProjectModal(false);
                setEditProject(null);
                toast.success('Project updated successfully!');
                // Optionally, refetch projects to update the list
                const response = await fetch(`${backendUrl}/api/chief/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const updatedProjects = await response.json();
                setProjects(updatedProjects);
            }
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('An unexpected error occurred while updating the project.');
        }
    };

    const handleCreateTaskInProject = async () => {
        if (!backendUrl) return;
        try {
            const response = await fetch(`${backendUrl}/api/chief/projects/${selectedProject._id}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });
            const result = await response.json();
            if (!response.ok) {
                console.error('Error creating task:', result);
                toast.error(`Failed to create task: ${result.message || result.error}`);
            } else {
                setShowCreateTaskModal(false);
                setNewTask({ title: '', description: '', members: 0, assignedTo: [], dueDate: '', priority: 'medium' });
                toast.success('Task created successfully!');
                // Optionally, refetch projects to update the list
                const response = await fetch(`${backendUrl}/api/chief/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const updatedProjects = await response.json();
                setProjects(updatedProjects);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('An unexpected error occurred while creating the task.');
        }
    };

    const handleTeamClick = async (team) => {
        if (!backendUrl) return;
        try {
            const response = await fetch(`${backendUrl}/api/chief/teams/${team._id}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const members = await response.json();
            setTeamMembers(members);
            setSelectedTeam(team);
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    const handleBackToTeams = () => {
        setSelectedTeam(null);
        setTeamMembers([]);
    };

    const handleTeamCreated = (newTeam) => {
        toast.success(`Team "${newTeam.team.name}" created successfully!`);
        // Optionally refresh teams list or add the new team to the state
        setTeams((prevTeams) => [...prevTeams, newTeam.team]);
    };

    const handleTeamUpdated = (updatedTeam) => {
        toast.success(`Team "${updatedTeam.name}" updated successfully!`);
        setTeams((prevTeams) => prevTeams.map((team) => {
            if (team._id === updatedTeam._id) {
                
                setEditingTeam(updatedTeam);
                return updatedTeam;
            }
            return team;
        }));
    };

    return (
        <div>
            <main className="max-w-7xl min-h-screen mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening with your projects.</p>
                </div>

                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => setShowCreateProjectModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                        </div>
                        <span>Create Project</span>
                    </button>

                    <button
                        onClick={() => setShowTeamDrawer(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-team-line"></i>
                        </div>
                        <span>View Teams</span>
                    </button>
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
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <i className="ri-time-line text-red-400 text-2xl"></i>
                                </div>
                            </div>
                            <div className="ml-4 ">
                                <p className="text-2xl font-bold text-white">{data?.overdueTasks || 0}</p>
                                <p className="text-gray-400 text-sm">Overdue Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-6">Active Projects</h2>
                        {projects.length === 0 ? (
                            <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center">
                                <div>
                                    <i className="ri-emotion-2-line text-4xl"></i>
                                    <p>You are all caught up!</p>
                                    <p >To Create a project, click on the <b className='bg-gray-900 p-1 rounded'>' + Create Project'</b> button on the top right corner of the page.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {projects.map((project) => (
                                    <div key={project._id} className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                                                <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${project.status === 'active' ? 'bg-green-900 text-green-300 border-green-800' : 'bg-blue-900 text-blue-300 border-blue-800'}`}>{project.status}</span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${project.priority === 'high' ? 'bg-red-900 text-red-300 border-red-800' : 'bg-yellow-900 text-yellow-300 border-yellow-800'}`}>{project.priority}</span>
                                                <button
                                                    onClick={() => { setEditProject(project); setShowEditProjectModal(true); }}
                                                    className="ml-2 text-gray-400 hover:text-white"
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-300">Progress</span>
                                                <span className="text-sm font-medium text-white">{project.completionPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${project.completionPercentage}%` }}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    <i className="ri-team-line text-gray-500"></i>
                                                </div>
                                                <span className="text-sm text-gray-400">{project.tasks.length} tasks</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    <i className="ri-calendar-line text-gray-500"></i>
                                                </div>
                                                <span className="text-sm text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={() => {
                                                    setShowCreateTaskModal(true);
                                                    setSelectedProject(project);
                                                    console.log({ selectedProjectOnTaskCreate: project }); // Debugging
                                                }}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Create Task for Project
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Upcoming Tasks</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700 min-h-24">
                                <div className="space-y-4">
                                    {data?.upcomingTasks?.length > 0 ? (
                                        data.upcomingTasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
                                                <div>
                                                    <h4 className="font-medium text-white">{task.name}</h4>
                                                    <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${task.priority === 'high' ? 'bg-red-900 text-red-300 border-red-800' : task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300 border-yellow-800' : 'bg-green-900 text-green-300 border-green-800'}`}>{task.priority}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700 min-h-24">
                                <div className="space-y-4">
                                    {data?.recentActivity && data?.recentActivity.length > 0 ? (
                                        data.recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">{activity.user.initial}</div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">
                                                        <span className="font-medium">{activity.user.name}</span> {activity.action}
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

            {/* Team Drawer */}
            <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${showTeamDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="fixed inset-0 bg-black/50" onClick={() => setShowTeamDrawer(false)}></div>
                <div className={`fixed right-0 top-0 h-[98vh] w-80 bg-gray-800 shadow-xl transition-transform duration-300 ${showTeamDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                {selectedTeam ? selectedTeam.name : 'Teams'}
                            </h2>
                            <button
                                onClick={() => setShowTeamDrawer(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 overflow-y-auto h-full flex flex-col justify-between">
                        {!selectedTeam ? (
                            <div className="space-y-2">
                                {teams.map((team) => (
                                    <div
                                        key={team._id}
                                        onClick={() => handleTeamClick(team)}
                                        className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                                    >
                                        <h3 className="text-white font-medium">{team.name}</h3>
                                        <p className="text-gray-400 text-sm">{team.members.length} members</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingTeam(team); setShowEditTeamModal(true); }}
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={handleBackToTeams}
                                    className="mb-4 text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                                >
                                    <i className="ri-arrow-left-line"></i>
                                    <span>Back to Teams</span>
                                </button>

                                <div className="space-y-3">
                                    <h3 className="text-white font-semibold mb-3">Team Members</h3>
                                    {teamMembers.map((member) => (
                                        <div key={member._id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                                {member.username ? member.username.charAt(0).toUpperCase() : '?'}</div>
                                            <div>
                                                <p className="text-white font-medium">{member.username}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {member.role === 'chief' ? 'Chief' : member.role === 'leader' ? 'Leader' : 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='mb-[4rem]'>
                            <div className="divider"></div>
                            <div className="flex items-center justify-center">
                            <button
                                onClick={() => setShowCreateTeamModal(true)}
                                className="btn btn-wide btn-outline btn-success mb-0"
                            >
                                Create Team
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
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

            {showCreateTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Create New Task for Project</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter task name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter task description"
                                    maxLength={500}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Members</label>
                                <input
                                    type="number"
                                    value={newTask.members}
                                    onChange={(e) => setNewTask({ ...newTask, members: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter number of members"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Add Members</label>
                                <select
                                    multiple
                                    value={newTask.assignedTo}
                                    onChange={(e) => setNewTask({ ...newTask, assignedTo: Array.from(e.target.selectedOptions, option => option.value) })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                >
                                    {console.log({ projectMembersInRender: projectMembers })} {/* Debugging */}
                                    {projectMembers.map((member) => (
                                        <option key={member._id} value={member._id}>{member.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowCreateTaskModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTaskInProject}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditProjectModal && editProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Edit Project</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={editProject.name}
                                    onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={editProject.description}
                                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter project description"
                                    maxLength={500}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                <select
                                    value={editProject.priority}
                                    onChange={(e) => setEditProject({ ...editProject, priority: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                <select
                                    value={editProject.status}
                                    onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Team</label>
                                <select
                                    value={editProject.team ? editProject.team._id : ''} // Access _id for populated team object
                                    onChange={(e) => setEditProject({ ...editProject, team: e.target.value })}
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
                                onClick={() => setShowEditProjectModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditProject}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateTeamModal
                show={showCreateTeamModal}
                onClose={() => setShowCreateTeamModal(false)}
                onTeamCreated={handleTeamCreated}
            />
            <EditTeamModal
                show={showEditTeamModal}
                onClose={() => setShowEditTeamModal(false)}
                team={editingTeam}
                onTeamUpdated={handleTeamUpdated}
            />
        </div>
    )
}

export default ChiefDashboard