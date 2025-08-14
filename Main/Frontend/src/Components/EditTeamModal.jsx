
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function EditTeamModal({ show, onClose, team, onTeamUpdated }) {
    const [members, setMembers] = useState([]);
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('EditTeamModal team prop:', team);
        if (show && team) {
            setMembers(team.members);
        }
    }, [show, team]);

    const handleRemoveMember = async (memberId) => {
        try {
            const response = await fetch(`/api/chief/teams/${team._id}/members/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                onTeamUpdated(result.team);
                onClose();
            } else {
                console.error('Error removing member:', result);
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handlePromoteMember = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/chief/teams/${team._id}/members/${memberId}/promote`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Fetch response:', response);
            const result = await response.json();
            if (response.ok) {
                onTeamUpdated(result.team);
                onClose();
            } else {
                console.error('Error promoting member:', result);
            }
        } catch (error) {
            console.error('Error promoting member:', error);
            console.log('Fetch error:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Edit Team</h3>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member._id} className="flex items-center justify-between">
                            <div>
                                <p className="text-white">{member.name}</p>
                                <p className="text-gray-400 text-sm">{member.email}</p>
                            </div>
                            <div className="flex space-x-2">
                                {member.role?.toLowerCase() !== 'chief' && member._id !== user?.id && (
                                    <>
                                        <button
                                            onClick={() => handlePromoteMember(member._id)}
                                            className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Promote
                                        </button>
                                        <button
                                            onClick={() => handleRemoveMember(member._id)}
                                            className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTeamModal;
