import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';

function CreateTeamModal({ show, onClose, onTeamCreated }) {
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (show && token) {
            // Fetch all users to select as members
            const fetchUsers = async () => {
                try {
                    const response = await fetch('/api/chief/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const result = await response.json();
                    setAvailableUsers(result);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers();
        }
    }, [show, token]);

    const handleCreateTeam = async () => {
        try {
            const response = await fetch('/api/chief/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: teamName,
                    members: selectedMembers,
                })
            });
            const result = await response.json();
            if (response.ok) {
                    onTeamCreated(result.team);
                    onClose();
                    setTeamName('');
                    setSelectedMembers([]);
                    toast.success("Team created successfully!");
                } else {
                console.error('Error creating team:', result);
            }
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Create New Team</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter team name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Members</label>
                        <div className="border border-gray-600 rounded-lg p-3 h-32 overflow-y-auto bg-gray-700">
                            {availableUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className={`flex items-center mb-2 p-2 rounded-lg cursor-pointer ${selectedMembers.includes(user._id) ? 'bg-green-500 bg-opacity-30' : ''}`}
                                    onClick={() => {
                                        if (selectedMembers.includes(user._id)) {
                                            setSelectedMembers(selectedMembers.filter((id) => id !== user._id));
                                        } else {
                                            setSelectedMembers([...selectedMembers, user._id]);
                                        }
                                    }}
                                >
                                    <span className="text-white text-sm">
                                        {user.username} ({user.email})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
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
    );
}

export default CreateTeamModal;
