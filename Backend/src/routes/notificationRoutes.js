const express = require('express');
const router = express.Router();
const { getMyNotifications, markRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const protect = require('../middlewares/authMiddleware');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markRead);
router.put('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;