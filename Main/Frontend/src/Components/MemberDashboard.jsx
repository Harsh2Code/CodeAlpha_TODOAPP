import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getBackendUrl } from '../api';

function MemberDashboard() {
    const [data, setData] = useState(null);
    const { token, user } = useSelector((state) => state.auth);
    const [chiefEmail, setChiefEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [chiefTasks, setChiefTasks] = useState([]); // New state for chief tasks
    const [chiefActivity, setChiefActivity] = useState({ projects: [], tasks: [], chief: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const backendUrl = await getBackendUrl();
                const response = await fetch(`${backendUrl}/api/member/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        };

        // fetchChiefs function removed as it's no longer needed

        const fetchMemberProjects = async () => {
            try {
                const backendUrl = await getBackendUrl();
                const response = await fetch(`${backendUrl}/api/member/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setProjects(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('Error fetching member projects:', error);
            }
        };

        // New fetch function for chief tasks
        const fetchChiefTasks = async () => {
            try {
                const backendUrl = await getBackendUrl();
                const response = await fetch(`${backendUrl}/api/member/tasks`, { // This is the new endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                                setChiefTasks(Array.isArray(result.tasks) ? result.tasks : []); // Assuming the backend sends { tasks: [...] }
            } catch (error) {
                console.error('Error fetching chief tasks:', error);
            }
        };

        const fetchChiefActivity = async () => {
            try {
                const backendUrl = await getBackendUrl();
                const response = await fetch(`${backendUrl}/api/member/chief-activity`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setChiefActivity(result);
                } else {
                    console.error('Failed to fetch chief activity:', result.message);
                }
            } catch (error) {
                console.error('Error fetching chief activity:', error);
            }
        };

        if (token) {
            fetchData();
            fetchMemberProjects();
            fetchChiefTasks(); // Call the new fetch function
            fetchChiefActivity(); // Call the new fetch function
            // fetchChiefs is no longer needed as we're using email input
        }
    }, [token, user]);

    const handleAddChief = async () => {
        try {
            const backendUrl = await getBackendUrl();
            const response = await fetch(`${backendUrl}/api/member/chief`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chiefEmail: chiefEmail })
            });
            const result = await response.json();
            if (response.ok) {
                setShowModal(false);
                toast.success('Chief added successfully!');
                // Optionally, you can refetch the user data to update the UI
            } else {
                toast.error('Failed to add chief.');
            }
        } catch (error) {
            console.error('Error updating chief:', error);
        }
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!user?.chief && (
                <div role="alert" className="alert alert-warning alert-soft">
                    <span>You have not added a chief. Please add a chief to be assigned to a team.</span>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>Add Chief</button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Add Chief</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Chief Email</label>
                                <input
                                    type="email"
                                    value={chiefEmail}
                                    onChange={(e) => setChiefEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter chief's email"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddChief}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
                            >
                                Add Chief
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-xs mx-auto mb-8">
                <h1 className="text-5xl font-bold text-stone-50 text-center">Welcome to <i className="text-sky-400">PowerFlow</i></h1>
                <p className="text-gray-400 text-center my-5">
                    Streamline your project management with our comprehensive platform <br /> featuring todo lists, team collaboration, and project flow tracking.
                </p>
                <span className='flex flex-row justify-center'>
                    <button className="btn btn-primary px-8 p-3 rounded-md mx-2 font-bold">Get Started</button>
                    <button className="btn btn-soft px-8 p-3 rounded-md mx-2 font-bold">View More</button>
                </span>
            </div>
            {data && data.features && data.features.length > 0 ? (
                <div className='grid grid-cols-1 mt-8 md:grid-cols-3 gap-8 pt-8 mb-16 w-5/6 mx-auto'>
                    {data.features.map((feature) => (
                        <div key={feature.id} className="bg-gray-800 rounded-lg shadow-sm text-center border border-gray-700">
                            <div className="card-body">
                                <i className={`ri-${feature.icon}-line text-center text-4xl p-3 px-0 rounded-[50%] mx-auto text-${feature.color}-400 bg-${feature.color}-800 w-[70px]`}></i>
                                <h2 className="card-title text-white">{feature.title}</h2>
                                <p className="text-left text-gray-400">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            <div className="grid grid-cols-1 mt-1 mx-auto md:grid-cols-2 gap-8 w-5/6  mb-[4rem]">
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
                    <h3 className="text-2xl font-semibold text-white mb-4 ">Project Flow Tracking</h3>
                    <p className="text-gray-400 mb-6 text-start">Visualize your project progress with our intuitive flow tracking system. See what's complete, what's in progress, and what's next in the pipeline.</p>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Real-time progress tracking
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Visual project timelines
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Milestone tracking</li>
                    </ul>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
                    <h3 className="text-2xl font-semibold text-white mb-4 ">Collaborative Features</h3>
                    <p className="text-gray-400 mb-6">Work seamlessly with your team using our built-in collaboration tools designed to keep everyone on the same page.</p>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>Team-wide notifications</li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Task assignment system
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Project activity feeds
                        </li>
                    </ul>
                </div>
            </div>

            <div className="my-8">
                <h2 className="text-xl font-semibold text-white mb-6">My Projects</h2>
                {projects.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[10rem] flex items-center justify-center">
                        <div>
                            <i className="ri-emotion-normal-line text-4xl"></i>
                            <p>You are not assigned to any projects yet.</p>
                        </div>
                    </div>
                ) : (
                    <ul className="list bg-base-100 rounded-box">
                        {projects && projects.map(project => (
                            <li key={project._id} className="p-4 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">{project.name}</h4>
                                        <p className="text-sm text-gray-400">Chief: {project.chief?.username || 'Unknown'}</p>
                                        <p className="text-sm text-gray-400">Progress: {project.completionPercentage}%</p>
                                    </div>
                                    <div className="badge badge-outline">{project.status}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* New section for Tasks created by Chief */}
            <div className="my-8">
                <h2 className="text-xl font-semibold text-white mb-6">Tasks from Chief</h2>
                {(chiefTasks && chiefTasks.length === 0) ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[10rem] flex items-center justify-center">
                        <div>
                            <i className="ri-emotion-normal-line text-4xl"></i>
                            <p>No tasks from Chief yet.</p>
                        </div>
                    </div>
                ) : (
                    <ul className="list bg-base-100 rounded-box">
                        {chiefTasks && chiefTasks.map(task => (
                            <li key={task._id} className="p-4 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">{task.title}</h4>
                                        <p className="text-sm text-gray-400">Created by: {task.createdBy.username}</p>
                                        <p className="text-sm text-gray-400">Assigned to: {task.assignedTo ? task.assignedTo.username : 'Unassigned'}</p>
                                        <p className="text-sm text-gray-400">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="badge badge-outline">{task.status}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {chiefActivity && chiefActivity.projects && chiefActivity.tasks && (
                <div className="my-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Chief's Recent Activity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chiefActivity.projects.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Recent Projects by {chiefActivity.chief?.username || 'Chief'}</h3>
                                <ul className="space-y-3">
                                    {chiefActivity.projects.map(project => (
                                        <li key={project._id} className="text-gray-400 text-sm">
                                            <span className="font-medium text-white">{project.name}</span> - Created on {new Date(project.createdAt).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {chiefActivity.tasks.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks by {chiefActivity.chief?.username || 'Chief'}</h3>
                                <ul className="space-y-3">
                                    {chiefActivity.tasks.map(task => (
                                        <li key={task._id} className="text-gray-400 text-sm">
                                            <span className="font-medium text-white">{task.title}</span> - Assigned to {task.assignedTo ? task.assignedTo.username : 'N/A'} on {new Date(task.createdAt).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {chiefActivity.projects.length === 0 && chiefActivity.tasks.length === 0 && (
                            <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 col-span-full">
                                <p>No recent activity from your Chief.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MemberDashboard
