const DashboardModel = require('../models/DashboardModel');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await DashboardModel.getTaskStats(userId);

    res.json({
      success: true,
      data: {
        todo: parseInt(stats.todo_count) || 0,
        inProgress: parseInt(stats.in_progress_count) || 0,
        completed: parseInt(stats.completed_count) || 0,
        totalProjects: parseInt(stats.total_projects) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get weekly productivity data
exports.getWeeklyProductivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const weeklyData = await DashboardModel.getWeeklyProductivity(userId);

    res.json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    console.error('Error fetching weekly productivity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly productivity data',
      error: error.message
    });
  }
};

// Get task distribution
exports.getTaskDistribution = async (req, res) => {
  try {
    const userId = req.user.id;

    const distribution = await DashboardModel.getTaskDistribution(userId);

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Error fetching task distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task distribution',
      error: error.message
    });
  }
};

// Get recent tasks
exports.getRecentTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const recentTasks = await DashboardModel.getRecentTasks(userId);

    res.json({
      success: true,
      data: recentTasks
    });
  } catch (error) {
    console.error('Error fetching recent tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent tasks',
      error: error.message
    });
  }
};
