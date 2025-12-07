// Controller for handling project operations
const ProjectModel = require('../models/ProjectModel');

/**
 * Create a new project
 * @route POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    console.log('=== CREATE PROJECT REQUEST ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const { name, description, dueDate, status, assignMembers, tasks, attachments } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Project name and description are required'
      });
    }

    // Get manager ID from authenticated user
    const managerId = req.user.id;
    
    console.log('\n--- Project Details ---');
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Due Date:', dueDate);
    console.log('Status:', status);
    console.log('Manager ID:', managerId);
    console.log('Assign Members:', assignMembers);
    
    console.log('\n--- Tasks ---');
    if (tasks && tasks.length > 0) {
      tasks.forEach((task, index) => {
        console.log(`Task ${index + 1}:`, task);
      });
    } else {
      console.log('No tasks added');
    }
    
    console.log('\n--- Attachments ---');
    if (attachments && attachments.length > 0) {
      attachments.forEach((attachment, index) => {
        console.log(`Attachment ${index + 1}:`, {
          name: attachment.name,
          size: attachment.size,
          type: attachment.type
        });
      });
    } else {
      console.log('No attachments added');
    }
    
    // Create project in database
    const project = await ProjectModel.createProject(req.body, managerId);
    
    console.log('\n--- Project Created ---');
    console.log('Project ID:', project.projectId);
    console.log('\n=== END REQUEST ===\n');
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

/**
 * Get all projects
 * @route GET /api/projects
 */
const getAllProjects = async (req, res) => {
  try {
    console.log('GET ALL PROJECTS REQUEST');
    
    // Get userId from authenticated user
    const userId = req.user.id;
    
    const projects = await ProjectModel.getProjectsByUser(userId);
    
    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
    
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
};

/**
 * Get a single project by ID
 * @route GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('GET PROJECT BY ID:', id);
    
    const project = await ProjectModel.getProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
    
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
};

/**
 * Update a project
 * @route PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('UPDATE PROJECT:', id);
    console.log('Update Data:', req.body);
    
    const success = await ProjectModel.updateProject(id, req.body);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or update failed'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { projectId: id }
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

/**
 * Delete a project
 * @route DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('DELETE PROJECT:', id);
    
    const success = await ProjectModel.deleteProject(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

/**
 * Delete a project attachment
 * @route DELETE /api/projects/:id/attachments/:attachmentId
 */
const deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    console.log('DELETE ATTACHMENT:', attachmentId, 'from project:', id);
    
    const success = await ProjectModel.deleteAttachment(attachmentId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }
    
    res.status(200).json({
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

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteAttachment
};
