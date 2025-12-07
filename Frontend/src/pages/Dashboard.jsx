import React from 'react';
import { CheckCircle, Clock, ListTodo, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data for statistics
  const stats = [
    { label: 'To-Do', value: 24, icon: ListTodo, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'In Progress', value: 12, icon: Clock, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Completed', value: 48, icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Total Projects', value: 8, icon: TrendingUp, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  // Mock data for productivity chart
  const weeklyData = [
    { day: 'Mon', completed: 8, created: 12 },
    { day: 'Tue', completed: 12, created: 10 },
    { day: 'Wed', completed: 6, created: 8 },
    { day: 'Thu', completed: 15, created: 14 },
    { day: 'Fri', completed: 10, created: 9 },
    { day: 'Sat', completed: 4, created: 5 },
    { day: 'Sun', completed: 3, created: 4 },
  ];

  // Mock data for task distribution
  const taskDistribution = [
    { name: 'To-Do', value: 24, color: '#3b82f6' },
    { name: 'In Progress', value: 12, color: '#eab308' },
    { name: 'Completed', value: 48, color: '#22c55e' },
  ];

  // Mock recent tasks
  const recentTasks = [
    { id: 1, title: 'Design homepage mockup', status: 'In Progress', priority: 'High', dueDate: '2024-12-01' },
    { id: 2, title: 'Fix login bug', status: 'To-Do', priority: 'Critical', dueDate: '2024-11-30' },
    { id: 3, title: 'Update documentation', status: 'Completed', priority: 'Low', dueDate: '2024-11-28' },
    { id: 4, title: 'Code review for PR #123', status: 'In Progress', priority: 'Medium', dueDate: '2024-12-02' },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      Critical: 'bg-red-100 text-red-800',
      High: 'bg-orange-100 text-orange-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'To-Do': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your tasks and projects</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Productivity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Productivity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              <Bar dataKey="created" fill="#3b82f6" name="Created" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Task</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Priority</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
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
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;