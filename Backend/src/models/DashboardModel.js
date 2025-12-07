const db = require('../config/db');

class DashboardModel {
  // Get task statistics by status
  static async getTaskStats(userId) {
    try {
      const [stats] = await db.query(
        `
        SELECT 
          COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.task_id END) as todo_count,
          COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.task_id END) as in_progress_count,
          COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.task_id END) as completed_count,
          COUNT(DISTINCT t.project_id) as total_projects
        FROM tasks t
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        WHERE t.created_by = ? OR ta.user_id = ?
        `,
        [userId, userId]
      );

      return stats[0] || {
        todo_count: 0,
        in_progress_count: 0,
        completed_count: 0,
        total_projects: 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Get weekly productivity data (last 7 days)
  static async getWeeklyProductivity(userId) {
    try {
      const [data] = await db.query(
        `
        SELECT 
          DATE_FORMAT(t.created_at, '%a') as day,
          DAYOFWEEK(t.created_at) as day_num,
          COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.task_id END) as completed,
          COUNT(DISTINCT t.task_id) as created
        FROM tasks t
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        WHERE (t.created_by = ? OR ta.user_id = ?)
          AND t.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(t.created_at), day, day_num
        ORDER BY day_num
        `,
        [userId, userId]
      );

      // Fill in missing days with 0 values
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = daysOfWeek.map((day, index) => {
        const dayData = data.find(d => d.day_num === index + 1);
        return {
          day,
          completed: dayData ? parseInt(dayData.completed) : 0,
          created: dayData ? parseInt(dayData.created) : 0
        };
      });

      // Rotate to start from Monday
      const rotated = [...weeklyData.slice(1), weeklyData[0]];
      return rotated;
    } catch (error) {
      throw error;
    }
  }

  // Get task distribution by status
  static async getTaskDistribution(userId) {
    try {
      const [distribution] = await db.query(
        `
        SELECT 
          t.status,
          COUNT(DISTINCT t.task_id) as count
        FROM tasks t
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        WHERE t.created_by = ? OR ta.user_id = ?
        GROUP BY t.status
        `,
        [userId, userId]
      );

      // Map to frontend format
      const statusMapping = {
        'todo': { name: 'To-Do', color: '#3b82f6' },
        'in_progress': { name: 'In Progress', color: '#eab308' },
        'done': { name: 'Completed', color: '#22c55e' },
        'blocked': { name: 'Blocked', color: '#ef4444' }
      };

      return distribution.map(item => ({
        name: statusMapping[item.status]?.name || item.status,
        value: parseInt(item.count),
        color: statusMapping[item.status]?.color || '#6b7280'
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get recent tasks (last 10 tasks)
  static async getRecentTasks(userId) {
    try {
      const [tasks] = await db.query(
        `
        SELECT DISTINCT
          t.task_id as id,
          t.title,
          t.status,
          t.priority,
          t.due_date as dueDate,
          t.created_at
        FROM tasks t
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        WHERE (t.created_by = ? OR ta.user_id = ?)
        ORDER BY t.created_at DESC
        LIMIT 10
        `,
        [userId, userId]
      );

      // Map status to display format
      const statusMapping = {
        'todo': 'To-Do',
        'in_progress': 'In Progress',
        'done': 'Completed',
        'blocked': 'Blocked'
      };

      // Map priority to display format
      const priorityMapping = {
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
      };

      return tasks.map(task => ({
        ...task,
        status: statusMapping[task.status] || task.status,
        priority: priorityMapping[task.priority] || task.priority
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DashboardModel;
