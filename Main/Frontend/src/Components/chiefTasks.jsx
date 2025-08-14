import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';

function ChiefTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        project: '', // Added project field
        assignedTo: [], // Array of user IDs
    });
    const [users, setUsers] = useState([]); // All users, for general display if needed
    const [teams, setTeams] = useState([]); // All teams
    const [projects, setProjects] = useState([]); // All projects
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [assignableMembers, setAssignableMembers] = useState([]); // Members of the selected project's team

    // Fetch existing tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/chief/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, Details: ${errorData.message || JSON.stringify(errorData)}`);
                }
                const result = await response.json();
                setTasks(result);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(err.message || 'Failed to load tasks.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchTasks();
        }
    }, [token]);

    // Fetch all users (for general display or if not project-specific assignment)
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('/api/chief/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, Details: ${errorData.message || JSON.stringify(errorData)}`);
                }
                const result = await response.json();
                setUsers(result);
                console.log('Fetched Users:', result); // Debugging
            } catch (err) {
                console.error('Error fetching all users:', err);
                setError(err.message || 'Failed to load users.'); // Add setError here
            }
        };
        if (token) { // This line was missing
            fetchAllUsers(); // This line was missing
        } // This line was missing
    }, [token]); // This line was missing

    // Fetch all teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/chief/teams', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, Details: ${errorData.message || JSON.stringify(errorData)}`);
                }
                const result = await response.json();
                setTeams(result);
                console.log('Fetched Teams:', result); // Debugging
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError(err.message || 'Failed to load teams.'); // Add setError here
            }
        };

        if (token) {
            fetchTeams();
        }
    }, [token]);

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/chief/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, Details: ${errorData.message || JSON.stringify(errorData)}`);
                }
                const result = await response.json();
                setProjects(result);
                console.log('Fetched Projects:', result); // Debugging
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message || 'Failed to load projects.'); // Add setError here
            }
        };

        if (token) {
            fetchProjects();
        }
    }, [token]);

    // Filter assignable members based on selected project's team
    useEffect(() => {
        if (selectedProjectId && projects.length > 0 && teams.length > 0) {
            const project = projects.find(p => p._id === selectedProjectId);
            if (project && project.team) {
                console.log('Project found with team:', project); // Debugging
                console.log('Project team ID:', project.team._id); // Debugging
                const team = teams.find(t => t._id === project.team._id);
                if (team && team.members) {
                    console.log('Team found with members:', team); // Debugging
                    console.log('Team members (from found team):', team.members);
                    console.log('All users:', users);
                    console.log('Team member IDs:', team.members.map(m => m._id.toString()));
                    console.log('All user IDs:', users.map(u => u._id.toString()));
                    const membersOfSelectedTeam = users.filter(user => team.members.map(m => m._id.toString()).includes(user._id.toString()));
                    console.log('Filtered assignable members (final):\n', membersOfSelectedTeam); // Debugging with newline
                    setAssignableMembers(membersOfSelectedTeam);
                } else {
                    console.log('Team or team.members not found after find.');
                    setAssignableMembers([]);
                }
            } else {
                console.log('Project or project.team not found.');
                setAssignableMembers([]);
            }
        } else {
            console.log('Conditions for filtering not met (no selected project, or empty projects/teams/users).');
            setAssignableMembers([]);
        }
    }, [selectedProjectId, projects, teams, users]);

    const handleCreateTask = async () => {
        try {
            // Ensure project is selected
            if (!newTask.project) {
                setError('Please select a project for the task.');
                toast.error('Please select a project for the task.');
                return;
            }

            const response = await fetch('/api/chief/tasks/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create task');
            }
            setTasks((prevTasks) => [...prevTasks, result.task]); // Assuming backend returns the created task
            toast.success('Task created successfully!');
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
                project: '',
                assignedTo: [],
            });
            setSelectedProjectId(''); // Reset selected project
            setShowCreateTaskModal(false);
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.message || 'Failed to create task.');
            toast.error(err.message || 'Failed to create task.');
        }
    };

    const handleAssignedToChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setNewTask({ ...newTask, assignedTo: selectedOptions });
    };

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);
        setNewTask(prev => ({ ...prev, project: projectId, assignedTo: [] })); // Reset assignedTo when project changes
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                <p>Loading tasks...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-red-400">
                <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <Toaster richColors />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                    <p className="text-gray-400">Manage and assign tasks to your team members</p>
                </div>
                <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors"
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-add-line"></i>
                    </div>
                    <span>Create New Task</span>
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[10rem] flex items-center justify-center">
                    <div>
                        <i className="ri-task-line text-4xl"></i>
                        <p>No tasks found. Click 'Create New Task' to add one.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div key={task._id} className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-gray-400">Due Date:</span>
                                <span className="text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-gray-400">Priority:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === 'high' ? 'bg-red-900 text-red-300' : task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>{task.priority}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Assigned To:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {task.assignedTo && task.assignedTo.length > 0 ? (
                                        task.assignedTo.map(assigneeId => {
                                            // Find the assignee from the global users list
                                            const assignee = users.find(u => u._id === assigneeId);
                                            return assignee ? (
                                                <span key={assigneeId} className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                                                    {assignee.username}
                                                </span>
                                            ) : null;
                                        })
                                    ) : (
                                        <span className="text-gray-500 text-xs">No one assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            {showCreateTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Create New Task</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Task title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Task description"
                                    maxLength={500}
                                />
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
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                                <select
                                    value={selectedProjectId}
                                    onChange={handleProjectChange}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select a project</option>
                                    {projects.length === 0 ? (
                                        <option value="" disabled>No projects available</option>
                                    ) : (
                                        projects.map((project) => (
                                            <option key={project._id} value={project._id}>{project.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                                <select
                                    multiple
                                    value={newTask.assignedTo}
                                    onChange={handleAssignedToChange}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none h-32"
                                >
                                    {assignableMembers.length === 0 ? (
                                        <option value="" disabled>Select a project to see assignable members</option>
                                    ) : (
                                        assignableMembers.map((member) => (
                                            <option key={member._id} value={member._id}>{member.username}</option>
                                        ))
                                    )}
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
                                onClick={handleCreateTask}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default ChiefTasks;
