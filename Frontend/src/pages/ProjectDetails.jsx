import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, CheckCircle, Clock, ListTodo, Edit, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock project data
  const project = {
    id: id,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern UI/UX. This includes redesigning all major pages, implementing responsive design, and improving overall user experience.',
    status: 'In Progress',
    progress: 65,
    dueDate: '2024-12-15',
    createdDate: '2024-10-01',
    teamMembers: [
      { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD' },
      { id: 2, name: 'Jane Smith', role: 'Designer', avatar: 'JS' },
      { id: 3, name: 'Mike Johnson', role: 'Developer', avatar: 'MJ' },
      { id: 4, name: 'Sarah Wilson', role: 'Developer', avatar: 'SW' },
      { id: 5, name: 'Tom Brown', role: 'QA Tester', avatar: 'TB' },
    ],
    tasks: [
      { id: 1, title: 'Design homepage mockup', status: 'Completed', priority: 'High', assignee: 'Jane Smith' },
      { id: 2, title: 'Develop navigation component', status: 'In Progress', priority: 'High', assignee: 'Mike Johnson' },
      { id: 3, title: 'Create about page design', status: 'Completed', priority: 'Medium', assignee: 'Jane Smith' },
      { id: 4, title: 'Implement responsive layouts', status: 'In Progress', priority: 'High', assignee: 'Sarah Wilson' },
      { id: 5, title: 'Set up testing environment', status: 'To-Do', priority: 'Medium', assignee: 'Tom Brown' },
      { id: 6, title: 'Write user documentation', status: 'To-Do', priority: 'Low', assignee: 'John Doe' },
    ],
  };

  const taskStats = {
    total: project.tasks.length,
    completed: project.tasks.filter(t => t.status === 'Completed').length,
    inProgress: project.tasks.filter(t => t.status === 'In Progress').length,
    todo: project.tasks.filter(t => t.status === 'To-Do').length,
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'To-Do': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900 font-medium">{project.createdDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-gray-900 font-medium">{project.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="font-bold text-gray-900">{taskStats.completed}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">In Progress</span>
              </div>
              <span className="font-bold text-gray-900">{taskStats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ListTodo className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">To-Do</span>
              </div>
              <span className="font-bold text-gray-900">{taskStats.todo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {project.teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {member.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Task</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Priority</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900">{task.title}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{task.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;