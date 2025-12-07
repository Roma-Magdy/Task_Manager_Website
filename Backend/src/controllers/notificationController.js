const NotificationModel = require('../models/NotificationModel');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.findAll(req.user.id);
    
    // Map to Frontend format
    const formatted = notifications.map(n => ({
      id: n.notification_id,
      title: n.event_type.replace('_', ' ').toUpperCase(),
      message: n.message,
      type: n.event_type.replace('_', '-'), // e.g. "task_assigned" -> "task-assigned"
      read: Boolean(n.is_read),
      timestamp: n.created_at,
      actor: n.actor_name
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await NotificationModel.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await NotificationModel.markAllAsRead(req.user.id);
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await NotificationModel.delete(req.params.id, req.user.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};