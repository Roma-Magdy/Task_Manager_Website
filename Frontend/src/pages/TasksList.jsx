import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Calendar, User, AlertCircle } from 'lucide-react';
import axios from '../utils/axios';
import { toast } from 'sonner';

const TasksList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showFilters, setShowFilters] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tasks');
      
      // Map backend data to frontend format
      const mappedTasks = response.data.data.map(task => ({
        id: task.task_id,
        title: task.title,
        description: task.description,
        status: formatStatus(task.status),
        priority: formatPriority(task.priority),
        assignee: task.assigned_users || 'Unassigned',
        project: task.project_name || 'No Project',
        dueDate: task.due_date,
        createdDate: task.created_at,
        category: task.category
      }));
      
      setAllTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'todo': 'To-Do',
      'in_progress': 'In Progress',
      'done': 'Completed',
      'blocked': 'Blocked'
    };
    return statusMap[status] || status;
  };

  const formatPriority = (priority) => {
    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    };
    return priorityMap[priority] || priority;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique users for filter
  const users = ['All', ...new Set(allTasks.map(task => task.assignee || 'Unassigned'))];

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    const matchesUser = selectedUser === 'All' || task.assignee === selectedUser;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesUser;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'status':
        const statusOrder = { 'To-Do': 0, 'In Progress': 1, 'Completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority) => {
    const colors = {
      Critical: 'bg-red-100 text-red-800 border-red-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'To-Do': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Blocked': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">{sortedTasks.length} tasks found</p>
        </div>
        <button
        onClick={() => navigate('/create')}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* Filters (Desktop Always Visible) */}
          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-3`}>
            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* User Filter */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No tasks found matching your filters</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/task/${task.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">{task.project}</span>
                        <span className="text-gray-300">•</span>
                        <span>Created {formatDate(task.createdDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Meta */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                  {/* Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>

                  {/* Priority */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>

                  {/* Assignee */}
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-700">{task.assignee}</span>
                  </div>

                  {/* Due Date */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    isOverdue(task.dueDate) ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Calendar className={`w-4 h-4 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'}`} />
                    <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                    {isOverdue(task.dueDate) && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksList;

