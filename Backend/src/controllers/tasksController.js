const TaskModel = require('../models/TaskModel');
const fs = require('fs');
const path = require('path');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      projectId: req.query.projectId,
      search: req.query.search
    };

    const tasks = await TaskModel.getAllTasks(userId, filters);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await TaskModel.getTaskById(id, userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskData = req.body;

    // Format date to YYYY-MM-DD if provided
    if (taskData.dueDate) {
      const date = new Date(taskData.dueDate);
      taskData.dueDate = date.toISOString().split('T')[0];
    }

    // Handle file attachments if provided as base64
    if (taskData.attachments && taskData.attachments.length > 0) {
      const processedAttachments = [];
      
      for (const attachment of taskData.attachments) {
        if (attachment.data) {
          // Save base64 file
          const uploadDir = path.join(__dirname, '../../uploads/tasks');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const buffer = Buffer.from(attachment.data.split(',')[1], 'base64');
          const fileName = `${Date.now()}_${attachment.name}`;
          const filePath = path.join(uploadDir, fileName);
          
          fs.writeFileSync(filePath, buffer);

          processedAttachments.push({
            file_path: `/uploads/tasks/${fileName}`,
            file_name: attachment.name,
            file_size: attachment.size,
            file_type: attachment.type
          });
        }
      }
      
      taskData.attachments = processedAttachments;
    }

    const taskId = await TaskModel.createTask(taskData, userId);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { taskId }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const taskData = req.body;

    // Format date to YYYY-MM-DD if provided
    if (taskData.dueDate) {
      const date = new Date(taskData.dueDate);
      taskData.dueDate = date.toISOString().split('T')[0];
    }

    const updated = await TaskModel.updateTask(id, taskData, userId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TaskModel.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const commentId = await TaskModel.addComment(id, userId, comment);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { commentId }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;

    const deleted = await TaskModel.deleteComment(commentId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

// Add attachment
exports.addAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { attachment } = req.body;

    if (!attachment || !attachment.data) {
      return res.status(400).json({
        success: false,
        message: 'Attachment data is required'
      });
    }

    // Save base64 file
    const uploadDir = path.join(__dirname, '../../uploads/tasks');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(attachment.data.split(',')[1], 'base64');
    const fileName = `${Date.now()}_${attachment.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, buffer);

    const attachmentData = {
      file_path: `/uploads/tasks/${fileName}`,
      file_name: attachment.name,
      file_size: attachment.size,
      file_type: attachment.type
    };

    const attachmentId = await TaskModel.addAttachment(id, userId, attachmentData);

    res.status(201).json({
      success: true,
      message: 'Attachment added successfully',
      data: { attachmentId, ...attachmentData }
    });
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add attachment',
      error: error.message
    });
  }
};

// Delete attachment
exports.deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const deleted = await TaskModel.deleteAttachment(attachmentId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attachment',
      error: error.message
    });
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const tasks = await TaskModel.getTasksByProject(projectId, userId);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project tasks',
      error: error.message
    });
  }
};
