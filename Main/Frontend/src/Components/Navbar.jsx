import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const getRoleBadgeColor = (role) => {
  const colors = {
    admin: 'bg-red-900/50 text-red-400 border-red-700',
    chief: 'bg-blue-900/50 text-blue-400 border-blue-700',
    leader: 'bg-green-900/50 text-green-400 border-green-700',
    member: 'bg-gray-700/50 text-gray-400 border-gray-600'
  };
  return colors[role] || colors.member;
};
function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const rolePrefix = user?.role === 'chief' ? 'chief' : 'member';

  const navigationItems = [
    { href: `/${rolePrefix}/dashboard`, label: 'Dashboard', icon: 'ri-dashboard-line' },
    { href: `/${rolePrefix}/projects`, label: 'Projects', icon: 'ri-folder-line' },
    { href: `/${rolePrefix}/teams`, label: 'Teams', icon: 'ri-team-line' },
    { href: `/${rolePrefix}/tasks`, label: 'Tasks', icon: 'ri-task-line' }
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ href: '/admin', label: 'Admin', icon: 'ri-settings-line' });
  }

  if (user && ['admin', 'chief'].includes(user.role)) {
    navigationItems.push({ href: `/${rolePrefix}/analytics`, label: 'Analytics', icon: 'ri-bar-chart-line' });
  }

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      chief: 'Chief',
      leader: 'Leader',
      member: 'Member'
    };
    return labels[role] || 'Member';
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={`/${rolePrefix}/dashboard`} className="text-2xl font-bold text-white font-['Pacifico']">
            logo
          </Link>
  
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={item.icon}></i>
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
  
          <div className="flex items-center space-x-4">
  
            <div className={`px-2 py-1 rounded-md text-xs border ${getRoleBadgeColor(user?.role)}`} >
              {getRoleLabel(user?.role)}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.avatar || (user?.username ? user.username.charAt(0).toUpperCase() : '')}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-sm font-medium">{user?.username}</p>
                  <p className="text-gray-400 text-xs">{user?.department || 'No Department'}</p>
                </div>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                </div>
              </button>
  
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white text-sm font-medium">{user?.username}</p>
                    <p className="text-gray-400 text-xs">{user?.email}</p>
                    <div className={`inline-block px-2 py-1 rounded-md text-xs border mt-1 ${getRoleBadgeColor(user?.role)}`}>
                      {getRoleLabel(user?.role)}
                    </div>
                  </div>
                  
                  <Link
                    to={`/${rolePrefix}/profile`}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-user-line"></i>
                      </div>
                      <span>Profile</span>
                    </div>
                  </Link>
  
                  <Link
                    to={`/${rolePrefix}/settings`}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-settings-line"></i>
                      </div>
                      <span>Settings</span>
                    </div>
                  </Link>
  
                  <div className="border-t border-gray-700 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-logout-box-line"></i>
                        </div>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
