import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'

function Register() {
    const [formDAta, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'user'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData( prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formDAta))
        .unwrap()
        .then((data) => {
            if(data?.success) {
                console.log('register form data created and sending...');
                navigate('/login');
            }
        })
        .catch((error) => {
            console.log('error while creating data at registration page!')
        })
    }

    return (
        <div>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white font-['Pacifico']">logo</h1>
                            <p className="text-gray-400 mt-2">Create your account</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
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
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Confirm your password"
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
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="sr-only"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium">{role.label}</span>
                                                        <div className={`w-3 h-3 rounded-full ${role.color === 'gray' ? 'bg-gray-400' :
                                                                role.color === 'green' ? 'bg-green-400' :
                                                                    role.color === 'blue' ? 'bg-blue-400' : 'bg-red-400'
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
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
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