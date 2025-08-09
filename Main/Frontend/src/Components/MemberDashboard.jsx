import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

function MemberDashboard() {
    const [data, setData] = useState(null);
    const { token, user } = useSelector((state) => state.auth);
    const [chiefs, setChiefs] = useState([]);
    const [selectedChief, setSelectedChief] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/member/dashboard', {
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

        const fetchChiefs = async () => {
            try {
                const response = await fetch('/api/chief/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setChiefs(result);
            } catch (error) {
                console.error('Error fetching chiefs:', error);
            }
        };

        const fetchMemberProjects = async () => {
            try {
                const response = await fetch('/api/member/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setProjects(result);
            } catch (error) {
                console.error('Error fetching member projects:', error);
            }
        };

        if (token) {
            fetchData();
            fetchMemberProjects();
            if (!user?.chief) {
                fetchChiefs();
            }
        }
    }, [token, user]);

    const handleAddChief = async () => {
        try {
            const response = await fetch('/api/member/chief', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chiefId: selectedChief })
            });
            const result = await response.json();
            if (response.ok) {
                setShowModal(false);
                // Optionally, you can refetch the user data to update the UI
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
                                <label className="block text-sm font-medium text-gray-300 mb-1">Select Chief</label>
                                <select
                                    value={selectedChief}
                                    onChange={(e) => setSelectedChief(e.target.value)}
                                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select a Chief</option>
                                    {chiefs.map((chief) => (
                                        <option key={chief._id} value={chief._id}>{chief.username}</option>
                                    ))}
                                </select>
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
            <div className='grid grid-cols-1 mt-8 md:grid-cols-3 gap-8 pt-8 mb-16 w-5/6 mx-auto'>
                {data.features.map((feature) => (
                    <div key={feature.id} className="bg-gray-800 rounded-lg shadow-sm text-center border border-gray-700">
                        <div className="card-body">
                            <i className={`ri-${feature.icon}-line text-center text-4xl p-3 px-0 rounded-[50%] mx-auto text-${feature.color}-400 bg-${feature.color}-800 w-[70px]`}></i>
                            <h2 className="card-title">{feature.title}</h2>
                            <p className="text-left">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
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
                        {projects.map(project => (
                            <li key={project._id} className="p-4 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">{project.name}</h4>
                                        <p className="text-sm text-gray-400">Chief: {project.chief.username}</p>
                                        <p className="text-sm text-gray-400">Progress: {project.completionPercentage}%</p>
                                    </div>
                                    <div className="badge badge-outline">{project.status}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default MemberDashboard
