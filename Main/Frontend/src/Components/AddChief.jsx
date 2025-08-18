import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../redux/authSlice';
import { Toaster, toast } from 'sonner';

function AddChief() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'Chief'
    });

    const dispatch = useDispatch();
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
                toast.success('Chief created successfully!');
            }
        } catch (err) {
            // Error is handled by the useEffect hook watching the error state
        }
    }

    return (
        <div>
            <Toaster />
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Add New Chief</h2>
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
                                    placeholder="Enter username"
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
                                    placeholder="Enter email"
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
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                            >
                                {loading ? 'Adding Chief...' : 'Add Chief'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddChief
