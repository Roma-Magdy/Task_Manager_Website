import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Trash2, Upload } from 'lucide-react';

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
  const [attachments, setAttachments] = useState([]);

  // Fetch task data on component load
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // Replace with actual API call:
        // const response = await fetch(`/api/tasks/${id}`);
        // const task = await response.json();
        
        // Mock data for demo
        const mockTask = {
          title: 'Fix login bug',
          description: 'Resolve authentication issue in production',
          category: 'Bug Fixes',
          priority: 'Critical',
          status: 'To-Do',
          assignee: 'Mike Johnson',
          dueDate: '2024-11-30',
          attachments: [
            { id: 1, name: 'error-log.pdf', size: '256', type: 'application/pdf' },
            { id: 2, name: 'screenshot.png', size: '512', type: 'image/png' }
          ]
        };
        setFormData({
          title: mockTask.title,
          description: mockTask.description,
          category: mockTask.category,
          priority: mockTask.priority,
          status: mockTask.status,
          assignee: mockTask.assignee,
          dueDate: mockTask.dueDate,
        });
        setAttachments(mockTask.attachments);
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          type: file.type,
          url: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating task:', id, formData);
    console.log('Attachments:', attachments);
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

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
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

              {/* Attachments Section */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Attachments
                </label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
                  </label>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getFileIcon(attachment.type)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAttachment(attachment.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Update Task
                </button>
                <button
                  onClick={() => navigate('/tasks')}
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