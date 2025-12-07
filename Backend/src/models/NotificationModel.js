const db = require('../config/db');

class NotificationModel {
  // Create a new notification
  static async createNotification(notificationData) {
    try {
      const [result] = await db.query(
        `INSERT INTO notifications (
          user_id, actor_id, event_type, message, 
          task_id, project_id, comment_id, attachment_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notificationData.userId,
          notificationData.actorId || null,
          notificationData.eventType,
          notificationData.message,
          notificationData.taskId || null,
          notificationData.projectId || null,
          notificationData.commentId || null,
          notificationData.attachmentId || null
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all notifications for a user
  static async getUserNotifications(userId, filters = {}) {
    try {
      let query = `
        SELECT 
          n.*,
          actor.full_name as actor_name,
          t.title as task_title,
          p.project_name
        FROM notifications n
        LEFT JOIN users actor ON n.actor_id = actor.user_id
        LEFT JOIN tasks t ON n.task_id = t.task_id
        LEFT JOIN projects p ON n.project_id = p.project_id
        WHERE n.user_id = ?
      `;

      const params = [userId];

      // Filter by read/unread status
      if (filters.isRead !== undefined) {
        query += ` AND n.is_read = ?`;
        params.push(filters.isRead);
      }

      // Filter by event type
      if (filters.eventType) {
        query += ` AND n.event_type = ?`;
        params.push(filters.eventType);
      }

      query += ` ORDER BY n.created_at DESC`;

      // Limit results
      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(filters.limit));
      }

      const [notifications] = await db.query(query, params);
      return notifications;
    } catch (error) {
      throw error;
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId) {
    try {
      const [result] = await db.query(
        `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
      return result[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const [result] = await db.query(
        `UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const [result] = await db.query(
        `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId, userId) {
    try {
      const [result] = await db.query(
        `DELETE FROM notifications WHERE notification_id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete all read notifications
  static async deleteAllRead(userId) {
    try {
      const [result] = await db.query(
        `DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE`,
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Notification helper methods for different events
  static async notifyTaskAssigned(taskId, assignedUserId, assignedByUserId, taskTitle) {
    try {
      await this.createNotification({
        userId: assignedUserId,
        actorId: assignedByUserId,
        eventType: 'task_assigned',
        message: `You have been assigned to task: ${taskTitle}`,
        taskId: taskId
      });
    } catch (error) {
      console.error('Error creating task assignment notification:', error);
    }
  }

  static async notifyTaskStatusChanged(taskId, userIds, changedByUserId, taskTitle, oldStatus, newStatus) {
    try {
      const statusMap = {
        'todo': 'To-Do',
        'in_progress': 'In Progress',
        'done': 'Done',
        'blocked': 'Blocked'
      };

      for (const userId of userIds) {
        if (userId !== changedByUserId) {
          await this.createNotification({
            userId: userId,
            actorId: changedByUserId,
            eventType: 'task_status_changed',
            message: `Task "${taskTitle}" status changed from ${statusMap[oldStatus] || oldStatus} to ${statusMap[newStatus] || newStatus}`,
            taskId: taskId
          });
        }
      }
    } catch (error) {
      console.error('Error creating status change notification:', error);
    }
  }

  static async notifyNewComment(taskId, userIds, commentedByUserId, taskTitle) {
    try {
      for (const userId of userIds) {
        if (userId !== commentedByUserId) {
          await this.createNotification({
            userId: userId,
            actorId: commentedByUserId,
            eventType: 'new_comment',
            message: `New comment on task: ${taskTitle}`,
            taskId: taskId
          });
        }
      }
    } catch (error) {
      console.error('Error creating comment notification:', error);
    }
  }

  static async notifyNewAttachment(taskId, userIds, uploadedByUserId, taskTitle, fileName) {
    try {
      for (const userId of userIds) {
        if (userId !== uploadedByUserId) {
          await this.createNotification({
            userId: userId,
            actorId: uploadedByUserId,
            eventType: 'new_attachment',
            message: `New attachment "${fileName}" added to task: ${taskTitle}`,
            taskId: taskId
          });
        }
      }
    } catch (error) {
      console.error('Error creating attachment notification:', error);
    }
  }

  static async notifyProjectUpdate(projectId, userIds, updatedByUserId, projectName, updateType) {
    try {
      for (const userId of userIds) {
        if (userId !== updatedByUserId) {
          await this.createNotification({
            userId: userId,
            actorId: updatedByUserId,
            eventType: 'project_update',
            message: `Project "${projectName}" has been ${updateType}`,
            projectId: projectId
          });
        }
      }
    } catch (error) {
      console.error('Error creating project update notification:', error);
    }
  }
}

module.exports = NotificationModel;
