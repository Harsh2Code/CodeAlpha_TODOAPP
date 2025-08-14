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
            console.log("API response result:", result); // Log the raw result
            // Filter tasks that are assigned to the current user and assigned by their chief
            const filteredTasks = result.filter(task =>
                task.assignedTo === user.id &&
                task.assignedBy === user.chief
            );
            setTasks(filteredTasks);
            toast.success('Project tasks loaded successfully!');
        } catch (err) {
            console.error('Error fetching project tasks:', err); // Log the full error object
            setError('Failed to load project tasks.');
            toast.error('Failed to load project tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user && user.chief && projectId) {
            fetchProjectTasks();
        }
    }, [token, user, projectId]);

    const handleMarkTaskDone = async (taskId) => {
        try {
            const response = await fetch(`/api/member/tasks/${taskId}/mark-done`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'completed' })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toast.success('Task marked as done!');
            // Re-fetch tasks to update the UI and reflect project progress changes
            fetchProjectTasks();

        } catch (err) {
            console.error('Error marking task done:', err);
            toast.error('Failed to mark task done.');
        }
    };

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
                            <p>No tasks found for this project assigned to you by your chief.</p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-2">{task.name}</h3>
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
