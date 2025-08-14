import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function ProjectTasks() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useSelector((state) => state.auth);

    const fetchProjectTasks = async () => {
        try {
            const response = await fetch(`/api/member/projects/${projectId}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("API response result:", result);
            
            // Handle both array and object response formats
            const tasksArray = Array.isArray(result) ? result : result.tasks || [];
            console.log("Tasks array:", tasksArray);
            
            // Remove filtering to show all tasks for the project
            // The backend should already filter by project and user context
            setTasks(tasksArray);
            toast.success('Project tasks loaded successfully!');
        } catch (err) {
            console.error('Error fetching project tasks:', err);
            setError('Failed to load project tasks.');
            toast.error('Failed to load project tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkTaskDone = async (taskId) => {
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

            toast.success('Task marked as done!');
            // Re-fetch tasks to update the UI
            fetchProjectTasks();

        } catch (err) {
            console.error('Error marking task done:', err);
            toast.error('Failed to mark task done.');
        }
    };

    useEffect(() => {
        if (token && user && projectId) {
            fetchProjectTasks();
        }
    }, [token, user, projectId]);

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-2">Project Tasks</h1>
                <p>Loading tasks...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8 text-red-400">
                <h1 className="text-3xl font-bold text-white mb-2">Project Tasks</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <Toaster richColors />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tasks for Project: {projectId}</h1>
                    <p className="text-gray-400">Manage and track tasks for this project</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-500 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700 min-h-[17.3rem] flex items-center justify-center col-span-full">
                        <div>
                            <i className="ri-emotion-2-line text-4xl"></i>
                            <p>No tasks found for this project.</p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-2">{task.title || task.name}</h3>
                            <p className="text-gray-400 mb-4">{task.description}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className={`px-3 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>{task.status}</span>
                                <span className="text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            {task.status !== 'completed' && (
                                <button
                                    onClick={() => handleMarkTaskDone(task._id)}
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
                                >
                                    Mark as Done
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default ProjectTasks;
