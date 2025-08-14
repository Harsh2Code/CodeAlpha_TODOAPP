
import { Link } from 'react-router-dom';

'use client';

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

interface TeamCardProps {
  id: string;
  name: string;
  description: string;
  members: Member[];
  activeProjects: number;
  completedTasks: number;
  color: string;
  onInvite: (teamId: string) => void;
  onMemberClick: (member: Member) => void;
}

export default function TeamCard({
  id, name, description, members, activeProjects, completedTasks, color, onInvite, onMemberClick
}: TeamCardProps) {
  console.log('TeamCard props:', { id, name, description, members, activeProjects, completedTasks, color });
  console.log('TeamCard members prop:', members);
  const colorClasses = {
    blue: 'bg-blue-900 border-blue-800',
    green: 'bg-green-900 border-green-800',
    purple: 'bg-purple-900 border-purple-800',
    orange: 'bg-orange-900 border-orange-800',
    red: 'bg-red-900 border-red-800',
    indigo: 'bg-indigo-900 border-indigo-800'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  };

  return (
    <Link to={`/teams/${id}`} className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}></div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onInvite(id);
          }}
          className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
          title="Invite member"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-user-add-line"></i>
          </div>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Team Members</span>
          <span className="text-sm text-gray-400">{members.length}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigating to team details
                onMemberClick(member);
              }}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-800">
                {member.avatar}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{member.name}</p>
                <p className="text-gray-400 text-xs">{member.role}</p>
              </div>
              <div className={`ml-auto w-3 h-3 rounded-full border-2 border-gray-800 ${statusColors[member.status]}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-folder-line text-gray-500"></i>
            </div>
            <span className="text-sm text-gray-400">Active Projects</span>
          </div>
          <p className="text-xl font-semibold text-white mt-1">{activeProjects}</p>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-gray-500"></i>
            </div>
            <span className="text-sm text-gray-400">Tasks Done</span>
          </div>
          <p className="text-xl font-semibold text-white mt-1">{completedTasks}</p>
        </div>
      </div>
    </Link>
  );
}