import React, { useState, useEffect } from 'react';
import TeamCard from './ui/TeamCard';
import CreateTeamModal from './CreateTeamModal';
import AssignTaskModal from './AssignTaskModal';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { getBackendUrl } from '../api';

function ChiefTeams() {
  const [teams, setTeams] = useState([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const setUrl = async () => {
        const url = await getBackendUrl();
        setBackendUrl(url);
    };
    setUrl();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!token || !backendUrl) return;
      try {
        const response = await fetch(`${backendUrl}/api/chief/teams`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          const transformedTeams = result.map(team => ({
            ...team,
            id: team._id,
            members: team.members.map(member => ({
              id: member._id,
              name: member.username || member.email || 'Unknown',
              role: member.role || 'Member',
              avatar: member.username ? member.username.charAt(0).toUpperCase() : 'U',
              status: 'offline'
            })),
            activeProjects: 0,
            completedTasks: 0,
            color: 'blue'
          }));
          setTeams(transformedTeams);
          toast.success('Teams loaded successfully!');
        } else {
          console.error('Error fetching teams:', result);
          toast.error('Failed to load teams.');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast.error('Error fetching teams.');
      }
    };

    fetchTeams();
  }, [token, backendUrl]);

  const handleTeamCreated = (newTeam) => {
    console.log('handleTeamCreated called with:', newTeam);
    const transformedTeam = {
      ...newTeam,
      id: newTeam._id,
      members: newTeam.members.map(member => ({
        id: member._id,
        name: member.username || member.email || 'Unknown',
        role: member.role || 'Member',
        avatar: member.username ? member.username.charAt(0).toUpperCase() : 'U',
        status: 'offline'
      })),
      activeProjects: 0,
      completedTasks: 0,
      color: 'blue'
    };
    console.log('Transformed team:', transformedTeam);
    setTeams(prevTeams => {
      const newTeams = [...prevTeams, transformedTeam];
      console.log('Updated teams state:', newTeams);
      return newTeams;
    });
    toast.success('Team created successfully!');
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowAssignTaskModal(true);
  };

  const handleAssignTask = async (memberId, taskDetails) => {
    if (!backendUrl) return;
    try {
      const response = await fetch(`${backendUrl}/api/chief/tasks/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo: memberId, ...taskDetails }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Task assigned successfully:', data);
        toast.success('Task assigned successfully!');
        // Optionally, show a success message or refresh data
      } else {
        console.error('Failed to assign task:', data.message);
        toast.error(`Failed to assign task: ${data.message}`);
        // Optionally, show an error message
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Error assigning task.');
    }
  };

  return (
    <div className="p-6 min-h-screen w-5/6 mx-auto h-100">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <button
          onClick={() => setShowCreateTeamModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center"><i className="ri-team-line text-blue-400 text-2xl"></i></div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{teams.length}</p>
              <p className="text-gray-400 text-sm">Total Teams</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-user-line text-green-400 text-2xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{teams.reduce((acc, team) => acc + (team.members ? team.members.length : 0), 0)}</p>
              <p className="text-gray-400 text-sm">Total Members</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center"><i className="ri-user-smile-line text-emerald-400 text-2xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-gray-400 text-sm">Members Online</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-folder-user-line text-purple-400 text-2xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{teams.reduce((acc, team) => acc + (team.activeProjects || 0), 0)}</p>
              <p className="text-gray-400 text-sm">Active Projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            {...team}
            onInvite={() => { }}
            onMemberClick={handleMemberClick}
          />
        ))}
      </div>
      <CreateTeamModal
        show={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        onTeamCreated={handleTeamCreated}
      />
      {showAssignTaskModal && (
        <AssignTaskModal
          member={selectedMember}
          onClose={() => setShowAssignTaskModal(false)}
          onAssignTask={handleAssignTask}
        />
      )}
    </div>
  );
}

export default ChiefTeams;