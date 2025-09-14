import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../redux/authSlice';
import { Toaster, toast } from 'sonner';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const resultAction = await dispatch(LoginUser({ email, password })).unwrap();
      const loggedInUser = resultAction.user;

      if (loggedInUser) {
        toast.success('Logged in successfully!');
        const role = loggedInUser.role?.toLowerCase();
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'chief') {
          navigate('/chief/dashboard');
        } else if (role === 'member') {
          navigate('/member/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // error is handled by the useEffect hook watching the error state
    }
  };

  return (
    <div>
      <Toaster />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                L
              </div>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name='email'
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name='password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Demo Accounts:</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-red-400">Admin:</span> admin@demo.com</p>
                  <p><span className="text-blue-400">Chief:</span> chief@demo.com</p>
                  <p><span className="text-green-400">Leader:</span> leader@demo.com</p>
                  <p><span className="text-gray-400">Member:</span> member@demo.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
