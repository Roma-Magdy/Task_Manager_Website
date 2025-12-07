const db = require('../config/db');

class TaskModel {
  static async create(taskData, creatorId) {
    const { title, description, priority, status, due_date, project_id } = taskData;
    
    const sql = `
      INSERT INTO tasks (title, description, priority, status, due_date, project_id, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title, description, priority, status, due_date, project_id || null, creatorId
    ]);
    return result.insertId;
  }

  static async assignUser(taskId, userId) {
    await db.execute('INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)', [taskId, userId]);
  }

  static async findAll(userId, filters = {}) {
    let sql = `
      SELECT t.*, p.project_name, u.full_name as assignee_name, u.user_id as assignee_id
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
      LEFT JOIN users u ON ta.user_id = u.user_id
      WHERE (t.created_by = ? OR ta.user_id = ?)
    `;
    
    // Add logic for filtering if needed later
    sql += ` ORDER BY t.due_date ASC`;

    const [rows] = await db.execute(sql, [userId, userId]);
    return rows;
  }
  
  static async getCounts(userId) {
     const sql = `
        SELECT 
            SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed
        FROM tasks 
        WHERE created_by = ?
     `;
     const [rows] = await db.execute(sql, [userId]);
     return rows[0];
  }

  static async findById(taskId) {
    const sql = `
      SELECT t.*, p.project_name, u.full_name as assignee_name, u.user_id as assignee_id
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
      LEFT JOIN users u ON ta.user_id = u.user_id
      WHERE t.task_id = ?
    `;
    const [rows] = await db.execute(sql, [taskId]);
    return rows[0];
  }

  static async update(taskId, data) {
    const { title, description, priority, status, due_date, assignee_id } = data;
    const sql = `
      UPDATE tasks 
      SET title = ?, description = ?, priority = ?, status = ?, due_date = ?
      WHERE task_id = ?
    `;
    await db.execute(sql, [title, description, priority, status, due_date, taskId]);

    // Update Assignee if provided
    if (assignee_id) {
      // First remove old assignment
      await db.execute('DELETE FROM task_assignments WHERE task_id = ?', [taskId]);
      // Add new assignment
      await db.execute('INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)', [taskId, assignee_id]);
    }
  }

  static async delete(taskId) {
    await db.execute('DELETE FROM tasks WHERE task_id = ?', [taskId]);
  }
}
module.exports = TaskModel;