import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';

function MemberTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);

    const markTaskAsDone = async (taskId) => {
        try {
            const response = await fetch(`/api/member/tasks/${taskId}/complete`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedTask = await response.json();
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, status: 'completed' } : task
                )
            );
            toast.success('Task marked as completed!');
        } catch (err) {
            console.error('Error marking task as done:', err);
            toast.error('Failed to mark task as done.');
        }
    };

    useEffect(() => {
        console.log('MemberTasks: useEffect triggered');
        console.log('Token:', token);
        console.log('User:', user);
        console.log('User Chief ID:', user?.chief);

        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/member/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('API Result (raw tasks):', result);

                // Assuming result.tasks is the array of tasks, similar to MemberDashboard
                const allTasks = Array.isArray(result.tasks) ? result.tasks : result; 
                console.log('All Tasks (after initial processing):', allTasks);

                // Filter tasks based on assignedTo and createdBy (chief)
                const filteredTasks = allTasks.filter(task =>
                    task.assignedTo && Array.isArray(task.assignedTo) && task.assignedTo.length > 0 &&
                    task.assignedTo[0]._id && task.assignedTo[0]._id.toString() === user.id &&
                    task.createdBy && task.createdBy._id && task.createdBy._id.toString() === user.chief
                );
                console.log('Filtered Tasks:', filteredTasks);

                setTasks(filteredTasks);
                toast.success('Tasks loaded successfully!');
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks.');
                toast.error('Failed to load tasks.');
            } finally {
                setLoading(false);
            }
        };

        if (token && user && user.chief) {
            fetchTasks();
        }
    }, [token, user]);

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                <p>Loading tasks...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-red-400">
                <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <Toaster richColors />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
                    <p className="text-gray-400">Manage and track your assigned tasks</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center col-span-full">
                        <div>
                            <i className="ri-emotion-2-line text-4xl"></i>
                            <p>No tasks assigned to you from your chief's projects.</p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const isCompleted = task.status === 'completed';
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;
                        const priorityColorClass = {
                            'low': 'bg-green-900 text-green-300 border-green-800',
                            'medium': 'bg-yellow-900 text-yellow-300 border-yellow-800',
                            'high': 'bg-red-900 text-red-300 border-red-800'
                        }[task.priority] || 'bg-gray-700 text-gray-300 border-gray-600';

                        const assignedToInitials = task.assignedTo && task.assignedTo[0] && task.assignedTo[0].username
                            ? task.assignedTo[0].username.split(' ').map(n => n[0]).join('').toUpperCase()
                            : 'N/A';

                        return (
                            <div key={task._id} className={`bg-gray-800 rounded-lg border-l-4 ${isCompleted ? 'border-l-green-500' : isOverdue ? 'border-l-red-500' : 'border-l-blue-500'} shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-700`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Mark as Done Button/Checkbox */}
                                        {!isCompleted && (
                                            <button
                                                onClick={() => markTaskAsDone(task._id)}
                                                className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors border-gray-600 hover:border-green-500"
                                                title="Mark as Done"
                                            >
                                                <i className="ri-check-line text-green-500 opacity-0 group-hover:opacity-100"></i>
                                            </button>
                                        )}
                                        {isCompleted && (
                                            <div className="w-5 h-5 rounded border-2 flex items-center justify-center bg-green-500 border-green-500 text-white">
                                                <i className="ri-check-line"></i>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                {/* Task Title */}
                                                <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                                                {/* Priority */}
                                                {task.priority && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColorClass}`}>
                                                        {task.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Description */}
                                            <p className="text-sm mb-3 text-gray-400">{task.description}</p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                {/* Assigned To */}
                                                {task.assignedTo && task.assignedTo[0] && task.assignedTo[0].username && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">{assignedToInitials}</div>
                                                        <span className="text-gray-400">{task.assignedTo[0].username}</span>
                                                    </div>
                                                )}
                                                {/* Due Date */}
                                                {task.dueDate && (
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line text-gray-500"></i></div>
                                                        <span className={`${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                )}
                                                {/* Project Name */}
                                                {task.project && task.project.name && (
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-folder-line text-gray-500"></i></div>
                                                        <span className="text-gray-400">{task.project.name}</span>
                                                    </div>
                                                )}
                                                {/* Created By */}
                                                {task.createdBy && task.createdBy.username && (
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line text-gray-500"></i></div>
                                                        <span className="text-gray-400">Created By: {task.createdBy.username}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Overdue/Status Indicator */}
                                        {isOverdue && (
                                            <div className="flex items-center space-x-1 text-red-400 text-xs bg-red-900 px-2 py-1 rounded border border-red-800">
                                                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-alarm-line"></i></div>
                                                <span>Overdue</span>
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div className="flex items-center space-x-1 text-green-400 text-xs bg-green-900 px-2 py-1 rounded border border-green-800">
                                                <div className="w-3 h-3 flex items-center justify-center"><i className="ri-check-double-line"></i></div>
                                                <span>Completed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}

export default MemberTasks;
