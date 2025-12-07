const db = require('../config/db');
const NotificationModel = require('./NotificationModel');

class ProjectModel {
  /**
   * Create a new project with tasks and attachments
   * @param {Object} projectData - Project data
   * @param {number} managerId - User ID of the project manager
   * @returns {Promise<Object>} Created project data
   */
  static async createProject(projectData, managerId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insert the project
      const [projectResult] = await connection.query(
        `INSERT INTO projects 
        (project_name, description, manager_id, status, due_date) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          projectData.name,
          projectData.description,
          managerId,
          projectData.status || 'Planning',
          projectData.dueDate || null
        ]
      );

      const projectId = projectResult.insertId;

      // 2. Add project manager as a member with 'manager' role
      await connection.query(
        `INSERT INTO project_members (project_id, user_id, role) 
        VALUES (?, ?, 'manager')`,
        [projectId, managerId]
      );

      // 3. Add other project members if specified
      if (projectData.assignMembers) {
        const memberNames = projectData.assignMembers
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0);

        // Find user IDs for the member names
        for (const memberName of memberNames) {
          const [users] = await connection.query(
            `SELECT user_id FROM users WHERE full_name = ? LIMIT 1`,
            [memberName]
          );

          if (users.length > 0) {
            const userId = users[0].user_id;
            
            // Check if user is not already added
            if (userId !== managerId) {
              await connection.query(
                `INSERT IGNORE INTO project_members (project_id, user_id, role) 
                VALUES (?, ?, 'member')`,
                [projectId, userId]
              );
            }
          }
        }
      }

      // 4. Insert tasks if provided
      if (projectData.tasks && projectData.tasks.length > 0) {
        for (const task of projectData.tasks) {
          // Map frontend status to database enum values
          const statusMap = {
            'To-Do': 'todo',
            'In Progress': 'in_progress',
            'Completed': 'done',
            'Blocked': 'blocked'
          };

          // Map frontend priority to database enum values
          const priorityMap = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high'
          };

          const dbStatus = statusMap[task.status] || 'todo';
          const dbPriority = priorityMap[task.priority] || 'medium';

          // Insert task
          const [taskResult] = await connection.query(
            `INSERT INTO tasks 
            (project_id, created_by, title, priority, status, assignee_name) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              projectId,
              managerId,
              task.title,
              dbPriority,
              dbStatus,
              task.assignee || null
            ]
          );

          const taskId = taskResult.insertId;

          // If assignee is specified, try to assign the task to that user
          if (task.assignee) {
            const [assigneeUsers] = await connection.query(
              `SELECT user_id FROM users WHERE full_name = ? LIMIT 1`,
              [task.assignee.trim()]
            );

            if (assigneeUsers.length > 0) {
              await connection.query(
                `INSERT IGNORE INTO task_assignments (task_id, user_id) 
                VALUES (?, ?)`,
                [taskId, assigneeUsers[0].user_id]
              );
            }
          }
        }
      }

      // 5. Handle project attachments if provided
      if (projectData.attachments && projectData.attachments.length > 0) {
        const fs = require('fs');
        const path = require('path');
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../../uploads/projects', projectId.toString());
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        for (const attachment of projectData.attachments) {
          try {
            // Extract base64 data from the data URL
            const base64Data = attachment.url.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
            
            // Generate file path
            const fileName = attachment.name;
            const filePath = path.join(uploadsDir, fileName);
            const relativeFilePath = `/uploads/projects/${projectId}/${fileName}`;
            
            // Save file to disk
            fs.writeFileSync(filePath, base64Data, 'base64');
            
            // Store file info in database
            await connection.query(
              `INSERT INTO project_attachments 
              (project_id, file_path, uploaded_by, file_name, file_size, file_type) 
              VALUES (?, ?, ?, ?, ?, ?)`,
              [
                projectId,
                relativeFilePath,
                managerId,
                attachment.name,
                attachment.size,
                attachment.type
              ]
            );
            
            console.log(`Attachment saved: ${fileName} (${attachment.size} KB) at ${filePath}`);
          } catch (error) {
            console.error(`Failed to save attachment ${attachment.name}:`, error.message);
          }
        }
      }

      // 6. Create notification for project creation
      await connection.query(
        `INSERT INTO notifications 
        (user_id, actor_id, event_type, message, project_id, title) 
        VALUES (?, ?, 'project_update', ?, ?, ?)`,
        [
          managerId,
          managerId,
          `Project "${projectData.name}" has been created`,
          projectId,
          'Project Created'
        ]
      );

      await connection.commit();

      // Return the created project with details
      return {
        projectId,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        dueDate: projectData.dueDate,
        managerId,
        tasksCount: projectData.tasks?.length || 0,
        attachmentsCount: projectData.attachments?.length || 0
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get all projects for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of projects
   */
  static async getProjectsByUser(userId) {
    const [projects] = await db.query(
      `SELECT 
        p.project_id,
        p.project_name,
        p.description,
        p.status,
        p.due_date,
        p.created_at,
        u.full_name as manager_name,
        COUNT(DISTINCT t.task_id) as task_count,
        COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.task_id END) as completed_tasks,
        COUNT(DISTINCT pm.user_id) as member_count,
        CASE 
          WHEN COUNT(DISTINCT t.task_id) > 0 
          THEN ROUND((COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.task_id END) * 100.0) / COUNT(DISTINCT t.task_id), 0)
          ELSE 0 
        END as progress
      FROM projects p
      INNER JOIN project_members pm ON p.project_id = pm.project_id
      INNER JOIN users u ON p.manager_id = u.user_id
      LEFT JOIN tasks t ON p.project_id = t.project_id
      WHERE pm.user_id = ?
      GROUP BY p.project_id, p.project_name, p.description, p.status, 
               p.due_date, p.created_at, u.full_name
      ORDER BY p.created_at DESC`,
      [userId]
    );

    return projects;
  }

  /**
   * Get project by ID with full details
   * @param {number} projectId - Project ID
   * @returns {Promise<Object>} Project details
   */
  static async getProjectById(projectId) {
    const [projects] = await db.query(
      `SELECT 
        p.*,
        u.full_name as manager_name,
        u.email as manager_email
      FROM projects p
      INNER JOIN users u ON p.manager_id = u.user_id
      WHERE p.project_id = ?`,
      [projectId]
    );

    if (projects.length === 0) {
      return null;
    }

    const project = projects[0];

    // Get project members
    const [members] = await db.query(
      `SELECT 
        u.user_id,
        u.full_name,
        u.email,
        pm.role
      FROM project_members pm
      INNER JOIN users u ON pm.user_id = u.user_id
      WHERE pm.project_id = ?`,
      [projectId]
    );

    // Get project tasks with assignee_name
    const [tasks] = await db.query(
      `SELECT 
        t.*,
        u.full_name as creator_name,
        t.assignee_name
      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.user_id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC`,
      [projectId]
    );

    // Get project attachments
    const [attachments] = await db.query(
      `SELECT 
        pa.*,
        u.full_name as uploader_name
      FROM project_attachments pa
      LEFT JOIN users u ON pa.uploaded_by = u.user_id
      WHERE pa.project_id = ?
      ORDER BY pa.uploaded_at DESC`,
      [projectId]
    );

    project.members = members;
    project.tasks = tasks;
    project.attachments = attachments;

    return project;
  }

  /**
   * Update project
   * @param {number} projectId - Project ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<boolean>} Success status
   */
  static async updateProject(projectId, updateData) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const fields = [];
      const values = [];

      if (updateData.name !== undefined) {
        fields.push('project_name = ?');
        values.push(updateData.name);
      }
      if (updateData.description !== undefined) {
        fields.push('description = ?');
        values.push(updateData.description);
      }
      if (updateData.status !== undefined) {
        fields.push('status = ?');
        values.push(updateData.status);
      }
      if (updateData.dueDate !== undefined) {
        fields.push('due_date = ?');
        values.push(updateData.dueDate);
      }

      if (fields.length > 0) {
        values.push(projectId);
        await connection.query(
          `UPDATE projects SET ${fields.join(', ')} WHERE project_id = ?`,
          values
        );
      }

      // Update team members if provided
      if (updateData.memberIds !== undefined && Array.isArray(updateData.memberIds)) {
        // Get current manager
        const [project] = await connection.query(
          'SELECT manager_id FROM projects WHERE project_id = ?',
          [projectId]
        );
        
        if (project.length > 0) {
          const managerId = project[0].manager_id;
          
          // Remove all members except manager
          await connection.query(
            'DELETE FROM project_members WHERE project_id = ? AND role = ?',
            [projectId, 'member']
          );
          
          // Add new members
          for (const userId of updateData.memberIds) {
            if (userId !== managerId) {
              await connection.query(
                'INSERT IGNORE INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
                [projectId, userId, 'member']
              );
            }
          }
        }
      }

      await connection.commit();

      // Notify project members about the update
      if (fields.length > 0 || updateData.memberIds !== undefined) {
        const [members] = await connection.query(
          `SELECT user_id FROM project_members WHERE project_id = ?`,
          [projectId]
        );
        const [[project]] = await connection.query(
          `SELECT project_name FROM projects WHERE project_id = ?`,
          [projectId]
        );

        const userIds = members.map(m => m.user_id);
        if (userIds.length > 0 && updateData.updatedBy) {
          NotificationModel.notifyProjectUpdate(
            projectId, userIds, updateData.updatedBy, project.project_name, 'updated'
          ).catch(err => console.error('Failed to send project update notification:', err));
        }
      }

      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete project
   * @param {number} projectId - Project ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteProject(projectId) {
    const [result] = await db.query(
      'DELETE FROM projects WHERE project_id = ?',
      [projectId]
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete project attachment
   * @param {number} attachmentId - Attachment ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteAttachment(attachmentId) {
    const fs = require('fs');
    const path = require('path');

    try {
      // Get attachment file path before deleting
      const [attachments] = await db.query(
        'SELECT file_path FROM project_attachments WHERE attachment_id = ?',
        [attachmentId]
      );

      if (attachments.length > 0) {
        const filePath = attachments[0].file_path;
        
        // Delete from database
        const [result] = await db.query(
          'DELETE FROM project_attachments WHERE attachment_id = ?',
          [attachmentId]
        );

        // Delete physical file
        if (result.affectedRows > 0 && filePath) {
          const fullPath = path.join(__dirname, '../../', filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
          }
        }

        return result.affectedRows > 0;
      }

      return false;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }
}

module.exports = ProjectModel;
