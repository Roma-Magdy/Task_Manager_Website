// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Calendar } from 'lucide-react';

// export default function TaskCreate() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     priority: 'Medium',
//     status: 'To-Do',
//     assignee: '',
//     dueDate: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Creating new task:', formData);
//     alert('Task created successfully!');
//     navigate('/tasks');
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       category: '',
//       priority: 'Medium',
//       status: 'To-Do',
//       assignee: '',
//       dueDate: '',
//     });
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       'Low': 'bg-green-100 text-green-700',
//       'Medium': 'bg-yellow-100 text-yellow-700',
//       'Critical': 'bg-red-100 text-red-700'
//     };
//     return colors[priority] || colors['Medium'];
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'Completed': 'bg-green-100 text-green-700',
//       'To-Do': 'bg-blue-100 text-blue-700',
//       'In Progress': 'bg-purple-100 text-purple-700'
//     };
//     return colors[status] || colors['To-Do'];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Content */}
//       <div className="px-6 py-8">
//         <div className="max-w-2xl mx-auto">
//           {/* Page Title */}
//           <div className="flex items-center gap-3 mb-8">
//             <button 
//               onClick={() => navigate('/tasks')}
//               className="text-gray-500 hover:text-gray-700 transition"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <h2 className="text-3xl font-bold text-gray-900">Create New Task</h2>
//           </div>

//           {/* Form */}
//           <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
//             <div className="space-y-6">
//               {/* Title */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">
//                   Task Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   placeholder="Enter task title"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   placeholder="Enter task description"
//                   rows="4"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 />
//               </div>

//               {/* Category and Priority */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Category
//                   </label>
//                   <input
//                     type="text"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     placeholder="e.g., Documentation, Bug Fixes"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Priority
//                   </label>
//                   <select
//                     name="priority"
//                     value={formData.priority}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option>Low</option>
//                     <option>Medium</option>
//                     <option>High</option>
//                     <option>Critical</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Status and Assignee */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option>To-Do</option>
//                     <option>In Progress</option>
//                     <option>Completed</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Assignee
//                   </label>
//                   <input
//                     type="text"
//                     name="assignee"
//                     value={formData.assignee}
//                     onChange={handleChange}
//                     placeholder="e.g., Sarah Wilson"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Due Date */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">
//                   Due Date
//                 </label>
//                 <div className="relative">
//                   <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
//                   <input
//                     type="date"
//                     name="dueDate"
//                     value={formData.dueDate}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Preview */}
//               {formData.title && (
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-8">
//                   <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Preview</p>
//                   <div className="bg-white p-4 rounded border border-gray-200">
//                     <h3 className="font-bold text-gray-900 mb-2">{formData.title}</h3>
//                     <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
//                     <div className="flex items-center gap-3 flex-wrap">
//                       {formData.status && (
//                         <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(formData.status)}`}>
//                           {formData.status}
//                         </span>
//                       )}
//                       {formData.priority && (
//                         <span className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor(formData.priority)}`}>
//                           {formData.priority}
//                         </span>
//                       )}
//                       {formData.assignee && (
//                         <span className="text-xs text-gray-600">👤 {formData.assignee}</span>
//                       )}
//                       {formData.dueDate && (
//                         <span className="text-xs text-gray-600">📅 {formData.dueDate}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Form Actions */}
//               <div className="flex gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
//                 >
//                   Create Task
//                 </button>
//                 <button
//                   onClick={resetForm}
//                   className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={() => navigate('/tasks')}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Upload, Trash2, File } from 'lucide-react';
import axios from '../utils/axios';
import { toast } from 'sonner';

export default function TaskCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'todo',
    projectId: '',
    dueDate: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users/all');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          data: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      setLoading(true);
      
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        projectId: formData.projectId || null,
        dueDate: formData.dueDate || null,
        assignedUsers: assignedUsers,
        attachments: attachments.map(att => ({
          name: att.name,
          size: att.size,
          type: att.type,
          data: att.data
        }))
      };

      await axios.post('/tasks', taskData);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      status: 'To-Do',
      assignee: '',
      dueDate: '',
    });
    setAttachments([]);
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

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
  };

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
            <h2 className="text-3xl font-bold text-gray-900">Create New Task</h2>
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

              {/* Category */}
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

              {/* Project */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project (Optional)
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Project</option>
                  {projects.map(project => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status and Priority */}
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
                    <option value="todo">To-Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
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
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Assign Users */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Assign Users
                </label>
                <select
                  multiple
                  value={assignedUsers}
                  onChange={(e) => setAssignedUsers(Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size="4"
                >
                  {users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple users</p>
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
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  disabled={loading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}