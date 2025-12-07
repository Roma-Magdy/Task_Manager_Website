const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const protect = require('../middlewares/authMiddleware');

// All routes are protected
router.get('/stats', protect, dashboardController.getDashboardStats);
router.get('/weekly-productivity', protect, dashboardController.getWeeklyProductivity);
router.get('/task-distribution', protect, dashboardController.getTaskDistribution);
router.get('/recent-tasks', protect, dashboardController.getRecentTasks);

module.exports = router;
