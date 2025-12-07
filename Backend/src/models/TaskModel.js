const db = require('../config/db');

class TaskModel {
  // Get all tasks for a user (tasks assigned to them or created by them)
  static async getAllTasks(userId, filters = {}) {
    try {
      let query = `
        SELECT DISTINCT
          t.*,
          p.project_name,
          u.full_name as creator_name,
          GROUP_CONCAT(DISTINCT ta_user.full_name SEPARATOR ', ') as assigned_users,
          GROUP_CONCAT(DISTINCT ta.user_id) as assigned_user_ids
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.project_id
        LEFT JOIN users u ON t.created_by = u.user_id
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        LEFT JOIN users ta_user ON ta.user_id = ta_user.user_id
        WHERE (t.created_by = ? OR ta.user_id = ?)
      `;

      const params = [userId, userId];

      // Apply filters
      if (filters.status && filters.status !== 'All') {
        query += ` AND t.status = ?`;
        params.push(filters.status.toLowerCase().replace(' ', '_'));
      }

      if (filters.priority && filters.priority !== 'All') {
        query += ` AND t.priority = ?`;
        params.push(filters.priority.toLowerCase());
      }

      if (filters.projectId) {
        query += ` AND t.project_id = ?`;
        params.push(filters.projectId);
      }

      if (filters.search) {
        query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      query += ` GROUP BY t.task_id ORDER BY t.due_date ASC, t.priority DESC`;

      const [tasks] = await db.query(query, params);
      return tasks;
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  static async getTaskById(taskId, userId) {
    try {
      const [tasks] = await db.query(
        `
        SELECT 
          t.*,
          p.project_name,
          u.full_name as creator_name,
          GROUP_CONCAT(DISTINCT ta_user.full_name SEPARATOR ', ') as assigned_users,
          GROUP_CONCAT(DISTINCT ta.user_id) as assigned_user_ids
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.project_id
        LEFT JOIN users u ON t.created_by = u.user_id
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        LEFT JOIN users ta_user ON ta.user_id = ta_user.user_id
        WHERE t.task_id = ?
        GROUP BY t.task_id
        `,
        [taskId]
      );

      if (tasks.length === 0) {
        return null;
      }

      // Get attachments
      const [attachments] = await db.query(
        `SELECT 
          a.*,
          u.full_name as uploaded_by_name
        FROM attachments a
        LEFT JOIN users u ON a.uploaded_by = u.user_id
        WHERE a.task_id = ?`,
        [taskId]
      );

      // Get comments
      const [comments] = await db.query(
        `SELECT 
          c.*,
          u.full_name as user_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.task_id = ?
        ORDER BY c.created_at DESC`,
        [taskId]
      );

      return {
        ...tasks[0],
        attachments,
        comments
      };
    } catch (error) {
      throw error;
    }
  }

  // Create new task
  static async createTask(taskData, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO tasks (
          project_id, created_by, title, description, 
          priority, status, due_date, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          taskData.projectId || null,
          userId,
          taskData.title,
          taskData.description || null,
          taskData.priority || 'medium',
          taskData.status || 'todo',
          taskData.dueDate || null,
          taskData.category || null
        ]
      );

      const taskId = result.insertId;

      // Assign users to task
      if (taskData.assignedUsers && taskData.assignedUsers.length > 0) {
        const assignmentValues = taskData.assignedUsers.map(uid => [taskId, uid]);
        await connection.query(
          `INSERT INTO task_assignments (task_id, user_id) VALUES ?`,
          [assignmentValues]
        );
      }

      // Handle attachments if provided
      if (taskData.attachments && taskData.attachments.length > 0) {
        const attachmentValues = taskData.attachments.map(att => [
          taskId,
          att.file_path,
          userId,
          att.file_name,
          att.file_size,
          att.file_type
        ]);
        await connection.query(
          `INSERT INTO attachments (task_id, file_path, uploaded_by, file_name, file_size, file_type) 
           VALUES ?`,
          [attachmentValues]
        );
      }

      await connection.commit();
      return taskId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update task
  static async updateTask(taskId, taskData, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if status changed for history
      const [[oldTask]] = await connection.query(
        `SELECT status FROM tasks WHERE task_id = ?`,
        [taskId]
      );

      // Update task
      const updates = [];
      const values = [];

      if (taskData.title !== undefined) {
        updates.push('title = ?');
        values.push(taskData.title);
      }
      if (taskData.description !== undefined) {
        updates.push('description = ?');
        values.push(taskData.description);
      }
      if (taskData.priority !== undefined) {
        updates.push('priority = ?');
        values.push(taskData.priority);
      }
      if (taskData.status !== undefined) {
        updates.push('status = ?');
        values.push(taskData.status);
      }
      if (taskData.dueDate !== undefined) {
        updates.push('due_date = ?');
        values.push(taskData.dueDate);
      }
      if (taskData.category !== undefined) {
        updates.push('category = ?');
        values.push(taskData.category);
      }
      if (taskData.projectId !== undefined) {
        updates.push('project_id = ?');
        values.push(taskData.projectId);
      }

      if (updates.length > 0) {
        values.push(taskId);
        await connection.query(
          `UPDATE tasks SET ${updates.join(', ')} WHERE task_id = ?`,
          values
        );
      }

      // Record status change in history
      if (taskData.status && oldTask && oldTask.status !== taskData.status) {
        await connection.query(
          `INSERT INTO task_history (task_id, old_status, new_status, changed_by)
           VALUES (?, ?, ?, ?)`,
          [taskId, oldTask.status, taskData.status, userId]
        );
      }

      // Update assignments if provided
      if (taskData.assignedUsers !== undefined) {
        // Remove old assignments
        await connection.query(
          `DELETE FROM task_assignments WHERE task_id = ?`,
          [taskId]
        );

        // Add new assignments
        if (taskData.assignedUsers.length > 0) {
          const assignmentValues = taskData.assignedUsers.map(uid => [taskId, uid]);
          await connection.query(
            `INSERT INTO task_assignments (task_id, user_id) VALUES ?`,
            [assignmentValues]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete task
  static async deleteTask(taskId) {
    try {
      const [result] = await db.query(
        `DELETE FROM tasks WHERE task_id = ?`,
        [taskId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Add comment
  static async addComment(taskId, userId, commentText) {
    try {
      const [result] = await db.query(
        `INSERT INTO comments (task_id, user_id, comment_text) VALUES (?, ?, ?)`,
        [taskId, userId, commentText]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Delete comment
  static async deleteComment(commentId, userId) {
    try {
      const [result] = await db.query(
        `DELETE FROM comments WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Add attachment
  static async addAttachment(taskId, userId, attachmentData) {
    try {
      const [result] = await db.query(
        `INSERT INTO attachments (task_id, file_path, uploaded_by, file_name, file_size, file_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          taskId,
          attachmentData.file_path,
          userId,
          attachmentData.file_name,
          attachmentData.file_size,
          attachmentData.file_type
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Delete attachment
  static async deleteAttachment(attachmentId) {
    try {
      const [result] = await db.query(
        `DELETE FROM attachments WHERE attachment_id = ?`,
        [attachmentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get tasks by project
  static async getTasksByProject(projectId, userId) {
    try {
      const [tasks] = await db.query(
        `
        SELECT 
          t.*,
          GROUP_CONCAT(DISTINCT ta_user.full_name SEPARATOR ', ') as assigned_users,
          GROUP_CONCAT(DISTINCT ta.user_id) as assigned_user_ids
        FROM tasks t
        LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
        LEFT JOIN users ta_user ON ta.user_id = ta_user.user_id
        WHERE t.project_id = ?
        GROUP BY t.task_id
        ORDER BY t.due_date ASC
        `,
        [projectId]
      );
      return tasks;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskModel;
