const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteAttachment
} = require('../controllers/projectsController');
const protect = require('../middlewares/authMiddleware');

// Create a new project
router.post('/', protect, createProject);

// Get all projects
router.get('/', protect, getAllProjects);

// Get a single project by ID
router.get('/:id', protect, getProjectById);

// Update a project
router.put('/:id', protect, updateProject);

// Delete a project
router.delete('/:id', protect, deleteProject);

// Delete project attachment
router.delete('/:id/attachments/:attachmentId', protect, deleteAttachment);

module.exports = router;
