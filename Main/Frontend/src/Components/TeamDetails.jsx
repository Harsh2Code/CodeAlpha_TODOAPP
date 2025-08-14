
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TeamDetails() {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const { token, user: loggedInUser } = useSelector((state) => state.auth);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await fetch(`/api/chief/teams/${teamId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setTeam(result);
            } catch (error) {
                console.error('Error fetching team details:', error);
                setError('Failed to load team details.');
            }
        };

        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(`/api/chief/teams/${teamId}/members`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setMembers(result);
            } catch (error) {
                console.error('Error fetching team members:', error);
                setError('Failed to load team members.');
            }
        };

        if (token && teamId) {
            fetchTeamDetails();
            fetchTeamMembers();
        }
    }, [token, teamId]);

    const handlePromoteToLeader = async (memberId) => {
        try {
            const response = await fetch(`/api/chief/teams/${teamId}/members/${memberId}/promote`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (response.ok) {
                setTeam(result.team);
                // Optionally refetch members to update roles
                const membersResponse = await fetch(`/api/chief/teams/${teamId}/members`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const updatedMembers = await membersResponse.json();
                setMembers(updatedMembers);
            }
        } catch (error) {
            console.error('Error promoting member to leader:', error);
            setError('Failed to promote member.');
        }
    };

    if (error) {
        return <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">Error: {error}</div>;
    }

    if (!team) {
        return <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">Loading team details...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Team Details Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
                    <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
                    <p className="text-gray-400 text-lg">{team.description}</p>
                </div>

                {/* Members Section */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <h2 className="text-2xl font-semibold text-white mb-4">Team Members</h2>
                    <div className="space-y-4">
                        {members.length === 0 ? (
                            <p className="text-gray-400">No members in this team yet.</p>
                        ) : (
                            members.map(member => (
                                <div key={member._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-md shadow-sm">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {member.username ? member.username.charAt(0).toUpperCase() : '?'}{/* Display first letter of username */}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{member.username}</p>
                                            <p className="text-gray-400 text-sm">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {team.chief === member._id && (
                                            <span className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Chief</span>
                                        )}
                                        {team.leader === member._id && (
                                            <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Leader</span>
                                        )}
                                        {loggedInUser && loggedInUser.role !== 'chief' && team.chief !== member._id && team.leader !== member._id && (
                                            <button
                                                onClick={() => handlePromoteToLeader(member._id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
                                            >
                                                Promote to Leader
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamDetails;
