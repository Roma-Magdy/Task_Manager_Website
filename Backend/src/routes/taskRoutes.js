const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskStats, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middlewares/authMiddleware');

router.get('/', protect, getAllTasks);
router.post('/', protect, createTask);
router.get('/stats', protect, getTaskStats);
router.get('/:id', protect, getTaskById);   
router.put('/:id', protect, updateTask);    
router.delete('/:id', protect, deleteTask); 

module.exports = router;