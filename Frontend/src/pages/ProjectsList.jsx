import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderKanban, Calendar, Users } from 'lucide-react';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX',
      status: 'In Progress',
      progress: 65,
      dueDate: '2024-12-15',
      teamMembers: 5,
      tasksCount: { total: 24, completed: 16 },
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native iOS and Android app for customer engagement',
      status: 'In Progress',
      progress: 40,
      dueDate: '2025-01-30',
      teamMembers: 8,
      tasksCount: { total: 45, completed: 18 },
    },
    {
      id: 3,
      name: 'Marketing Campaign Q4',
      description: 'Digital marketing campaign for product launch',
      status: 'Planning',
      progress: 15,
      dueDate: '2024-12-31',
      teamMembers: 4,
      tasksCount: { total: 12, completed: 2 },
    },
    {
      id: 4,
      name: 'Database Migration',
      description: 'Migrate legacy database to new cloud infrastructure',
      status: 'Completed',
      progress: 100,
      dueDate: '2024-11-20',
      teamMembers: 3,
      tasksCount: { total: 18, completed: 18 },
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'On Hold': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage and track your projects</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FolderKanban className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{project.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{project.teamMembers} members</span>
                </div>
                <div className="text-xs text-gray-600">
                  {project.tasksCount.completed}/{project.tasksCount.total} tasks
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;