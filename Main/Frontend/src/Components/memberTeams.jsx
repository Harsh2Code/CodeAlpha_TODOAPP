import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';

function MemberTeams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const apiUrl = '/api/member/teams';
                console.log('Fetching teams from URL:', apiUrl); // Add this line
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

                // Corrected filtering logic: team.members is an array of user objects
                const memberTeams = result.filter(team => team.members.some(member => member._id === user.id));

                setTeams(memberTeams);
                toast.success('Teams loaded successfully!');
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Failed to load teams.');
                toast.error('Failed to load teams.');
            } finally {
                setLoading(false);
            }
        };

        if (token && user) { // Ensure user is available
            fetchTeams();
        }
    }, [token, user]);

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                <p>Loading teams...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-red-400">
                <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <Toaster richColors />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                    <p className="text-gray-400">Manage and track your teams</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center col-span-full">
                        <div>
                            <i className="ri-emotion-2-line text-4xl"></i>
                            <p>No teams found for you.</p>
                        </div>
                    </div>
                ) : (
                    teams.map((team) => (
                        <div key={team._id} className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg">
                            <h3 className="text-2xl font-bold text-white mb-3">{team.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{team.description}</p>
                            <div className="mb-4">
                                <h4 className="text-gray-300 text-sm font-semibold mb-2">Members:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {team.members.slice(0, 3).map(member => (
                                        <span key={member._id} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">
                                            {member.username}
                                        </span>
                                    ))}
                                    {team.members.length > 3 && (
                                        <span className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">
                                            +{team.members.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-auto pt-4 border-t border-gray-700">
                                <span className="text-gray-400 flex items-center">
                                    <i className="ri-group-line mr-1"></i> {team.members.length} Members
                                </span>
                                <button className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default MemberTeams;
