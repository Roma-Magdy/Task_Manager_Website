const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const protect = require('../middlewares/authMiddleware');

// All routes are protected
router.get('/', protect, notificationController.getNotifications);
router.get('/unread-count', protect, notificationController.getUnreadCount);
router.put('/:id/read', protect, notificationController.markAsRead);
router.put('/mark-all-read', protect, notificationController.markAllAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);
router.delete('/read/all', protect, notificationController.deleteAllRead);

module.exports = router;
