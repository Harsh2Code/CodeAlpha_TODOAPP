import React, { useState, useEffect } from 'react'
import Header from './ui/Header';
import TodoItem from './ui/TodoItem';
import { useSelector } from 'react-redux';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    project: '',
    notifications: [],
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  useEffect(() => {
    const fetchMemberTasks = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:3001/api/member/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Assuming the backend returns an object with a 'tasks' array
        setTodos(result.tasks || []); 
      } catch (error) {
        console.error('Error fetching member tasks:', error);
        setTodos([]);
      }
    };

    // Fetch team members and projects (dummy data for now, replace with API calls if needed)
    setTeamMembers(['John Doe', 'Jane Smith', 'Peter Jones']);
    setProjects(['Project Alpha', 'Project Beta', 'Project Gamma']);

    fetchMemberTasks();
  }, [token]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const highPriorityCount = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'high') return todo.priority === 'high' && !todo.completed;
    return true;
  });

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleCreateTodo = () => {
    // Logic to create a new todo (e.g., send to API)
    console.log('Creating new todo:', newTodo);
    setTodos([...todos, { ...newTodo, id: todos.length + 1, completed: false }]);
    setShowNewTodo(false);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      project: '',
      notifications: [],
    });
  };
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Todo Lists</h1>
            <p className="text-gray-400">Manage tasks and send notifications to team members</p>
          </div>
          
          <button 
            onClick={() => setShowNewTodo(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer whitespace-nowrap transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </div>
            <span>New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-list-check text-blue-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{todos.length}</p>
                <p className="text-gray-400 text-sm">Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-green-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{completedCount}</p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-time-line text-yellow-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-alarm-line text-red-400 text-2xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{highPriorityCount}</p>
                <p className="text-gray-400 text-sm">High Priority</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'pending' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setFilter('high')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'high' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              High Priority
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem 
              key={todo.id} 
              {...todo} 
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      </main>

      {showNewTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  className="w-full p-3 border border-gray-600 rounded-lg resize-none h-20 text-sm bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task description"
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <div className="relative">
                    <select 
                      value={newTodo.priority}
                      onChange={(e) => setNewTodo({...newTodo, priority: e.target.value })}
                      className="w-full p-3 pr-8 border border-gray-600 rounded-lg text-sm appearance-none bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                      <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assign to</label>
                <div className="relative">
                  <select 
                    value={newTodo.assignee}
                    onChange={(e) => setNewTodo({...newTodo, assignee: e.target.value})}
                    className="w-full p-3 pr-8 border border-gray-600 rounded-lg text-sm appearance-none bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                <div className="relative">
                  <select 
                    value={newTodo.project}
                    onChange={(e) => setNewTodo({...newTodo, project: e.target.value})}
                    className="w-full p-3 pr-8 border border-gray-600 rounded-lg text-sm appearance-none bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notify Team Members</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {teamMembers.filter(member => member !== newTodo.assignee).map(member => (
                    <label key={member} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTodo.notifications.includes(member)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTodo({...newTodo, notifications: [...newTodo.notifications, member]});
                          } else {
                            setNewTodo({...newTodo, notifications: newTodo.notifications.filter(n => n !== member)});
                          }
                        }}
                        className="mr-2 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">{member}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowNewTodo(false)}
                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTodo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Todos