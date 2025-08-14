import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { Toaster, toast } from 'sonner';
import { updateUserChief } from '../redux/authSlice'; // Import updateUserChief

function Profile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Initialize useDispatch
  const [profile, setProfile] = useState(null);
  const [chiefEmail, setChiefEmail] = useState(''); // State for chief email input
  const [loadingChiefAssignment, setLoadingChiefAssignment] = useState(false); // State for loading

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          toast.success('Profile loaded successfully!');
        } else {
          console.error('Failed to fetch profile:', data.message);
          toast.error(`Failed to fetch profile: ${data.message}`);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error fetching profile.');
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const assignChief = async () => {
    if (!chiefEmail) {
      toast.error('Please enter a chief\'s email.');
      return;
    }
    setLoadingChiefAssignment(true);
    try {
      const response = await fetch('http://localhost:3001/api/member/chief', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chiefEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        // Dispatch the thunk to update Redux state with the new chief ID
        dispatch(updateUserChief(data.chief._id)); // Assuming backend returns updated user with chief object
        setProfile(prevProfile => ({ ...prevProfile, chief: data.chief })); // Update local profile state
        toast.success('Chief assigned successfully!');
        setChiefEmail(''); // Clear input
      } else {
        console.error('Failed to assign chief:', data.message);
        toast.error(`Failed to assign chief: ${data.message}`);
      }
    } catch (error) {
      console.error('Error assigning chief:', error);
      toast.error('Error assigning chief.');
    } finally {
      setLoadingChiefAssignment(false);
    }
  };


  if (!user || !profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Toaster richColors />
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
            {profile.username ? profile.username.charAt(0).toUpperCase() : ''}
          </div>
          <h2 className="text-2xl font-semibold">{profile.username}</h2>
          <p className="text-gray-400">{profile.email}</p>
          <p className="text-gray-400">Role: {profile.role}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <p><strong>Full Name:</strong> {profile.fullName || 'N/A'}</p>
            <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
            <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
          </div>

          {profile.chief && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Chief Information</h3>
              <p><strong>Username:</strong> {profile.chief.username}</p>
              <p><strong>Email:</strong> {profile.chief.email}</p>
            </div>
          )}

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Assign Chief</h3>
            <p className="text-gray-400 text-sm mb-3">Enter the email of the chief you wish to be assigned to.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Chief's Email"
                className="flex-grow p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                value={chiefEmail}
                onChange={(e) => setChiefEmail(e.target.value)}
              />
              <button
                onClick={assignChief}
                disabled={loadingChiefAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingChiefAssignment ? 'Assigning...' : 'Assign Chief'}
              </button>
            </div>
          </div>

          {/* Add more sections as needed, e.g., Team Information, Projects, etc. */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
