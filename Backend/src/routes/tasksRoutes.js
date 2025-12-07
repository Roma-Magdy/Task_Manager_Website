const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const protect = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Task CRUD
router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

// Comments
router.post('/:id/comments', tasksController.addComment);
router.delete('/:id/comments/:commentId', tasksController.deleteComment);

// Attachments
router.post('/:id/attachments', tasksController.addAttachment);
router.delete('/:id/attachments/:attachmentId', tasksController.deleteAttachment);

// Get tasks by project
router.get('/project/:projectId', tasksController.getTasksByProject);

module.exports = router;
