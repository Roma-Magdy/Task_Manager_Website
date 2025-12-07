const db = require('../config/db');

class NotificationModel {
  static async create({ userId, actorId, type, message, taskId, projectId }) {
    const sql = `
      INSERT INTO notifications 
      (user_id, actor_id, event_type, message, task_id, project_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      userId, 
      actorId || null, 
      type, 
      message, 
      taskId || null, 
      projectId || null
    ]);
    return result.insertId;
  }

  static async findAll(userId) {
    const sql = `
      SELECT n.*, u.full_name as actor_name 
      FROM notifications n
      LEFT JOIN users u ON n.actor_id = u.user_id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  static async markAsRead(notificationId, userId) {
    const sql = `UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?`;
    const [result] = await db.execute(sql, [notificationId, userId]);
    return result;
  }

  static async markAllAsRead(userId) {
    const sql = `UPDATE notifications SET is_read = 1 WHERE user_id = ?`;
    const [result] = await db.execute(sql, [userId]);
    return result;
  }

  static async delete(notificationId, userId) {
    const sql = `DELETE FROM notifications WHERE notification_id = ? AND user_id = ?`;
    const [result] = await db.execute(sql, [notificationId, userId]);
    return result;
  }
}

module.exports = NotificationModel;