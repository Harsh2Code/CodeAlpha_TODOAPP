import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../redux/authSlice';
import { Toaster, toast } from 'sonner';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'Member'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth || {});

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(RegisterUser(formData)).unwrap();
            if (result.success) {
                toast.success('Account created successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            // Error is handled by the useEffect hook watching the error state
        }
    }

    const roles = [
        { value: 'Member', label: 'Member', description: 'Regular team member', color: 'blue' },
        { value: 'Leader', label: 'Leader', description: 'Team leader', color: 'orange' },
        { value: 'Chief', label: 'Chief', description: 'Team chief', color: 'green' },
        { value: 'Admin', label: 'Admin', description: 'System administrator', color: 'red' }
    ];

    const getRoleColorClass = (color) => {
        const colors = {
            blue: 'border-blue-500 bg-blue-900/20',
            green: 'border-green-500 bg-green-900/20',
            orange: 'border-orange-500 bg-orange-900/20',
            red: 'border-red-500 bg-red-900/20'
        };
        return colors[color] || 'border-gray-500 bg-gray-900/20';
    };

    return (
        <div>
            <Toaster />
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                        <div className="text-center mb-8">
                            <img src="/cha-bubbles-two-svgrepo-com.svg" alt="logo" className="w-12 mx-auto" />
                            <p className="text-gray-400 mt-2">Create your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Select Role
                                </label>
                                <div className="space-y-3">
                                    {roles.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`block p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.role === role.value
                                                    ? getRoleColorClass(role.color)
                                                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.value}
                                                    checked={formData.role === role.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium">{role.label}</span>
                                                        <div className={`w-3 h-3 rounded-full ${role.color === 'blue' ? 'bg-blue-400' :
                                                                role.color === 'green' ? 'bg-green-400' :
                                                                role.color === 'orange' ? 'bg-orange-400' :
                                                                    'bg-red-400'
                                                            }`}></div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-1">{role.description}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
