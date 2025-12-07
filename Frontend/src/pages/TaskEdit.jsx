import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Trash2 } from 'lucide-react';

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    status: 'To-Do',
    assignee: '',
    dueDate: '',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // Replace with actual API call:
        const response = await fetch(`/tasks/${id}`);
        const task = await response.json();
        setFormData(task);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating task:', id, formData);
    alert('Task updated successfully!');
    navigate('/tasks');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log('Deleting task:', id);
      alert('Task deleted successfully!');
      navigate('/tasks');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Critical': 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors['Medium'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-700',
      'To-Do': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-purple-100 text-purple-700'
    };
    return colors[status] || colors['To-Do'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={() => navigate('/tasks')}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Edit Task</h2>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Documentation, Bug Fixes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Status and Assignee */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>To-Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Assignee
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    placeholder="e.g., Sarah Wilson"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preview */}
              {formData.title && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-8">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Preview</p>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2">{formData.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {formData.status && (
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(formData.status)}`}>
                          {formData.status}
                        </span>
                      )}
                      {formData.priority && (
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                          {formData.priority}
                        </span>
                      )}
                      {formData.assignee && (
                        <span className="text-xs text-gray-600">👤 {formData.assignee}</span>
                      )}
                      {formData.dueDate && (
                        <span className="text-xs text-gray-600">📅 {formData.dueDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Update Task
                </button>
                <button
                  onClick={() => navigate('/task/:id')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
