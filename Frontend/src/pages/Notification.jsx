import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Check, X, AlertCircle, CheckCircle, MessageSquare, Paperclip, FolderOpen } from "lucide-react";
import axios from "../utils/axios";
import { toast } from "sonner";
import { NotificationContext } from "../context/NotificationContext";
import "../styles/notifications.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { refreshUnreadCount } = useContext(NotificationContext);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === "unread") params.isRead = false;
      if (filter === "read") params.isRead = true;

      const response = await axios.get("/notifications", { params });
      
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  const getNotificationIcon = (eventType) => {
    switch (eventType) {
      case "task_status_changed":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "task_assigned":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "new_comment":
        return <MessageSquare className="w-6 h-6 text-green-500" />;
      case "new_attachment":
        return <Paperclip className="w-6 h-6 text-purple-500" />;
      case "project_update":
        return <FolderOpen className="w-6 h-6 text-orange-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(notifications.map(n => 
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        ));
        refreshUnreadCount();
        toast.success("Marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put("/notifications/mark-all-read");
      if (response.data.success) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        refreshUnreadCount();
        toast.success(`${response.data.data.count} notification(s) marked as read`);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`);
      if (response.data.success) {
        setNotifications(notifications.filter(n => n.notification_id !== notificationId));
        refreshUnreadCount();
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      const response = await axios.delete("/notifications/read/all");
      if (response.data.success) {
        setNotifications(notifications.filter(n => !n.is_read));
        toast.success(`${response.data.data.count} notification(s) deleted`);
      }
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      toast.error("Failed to delete read notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.notification_id);
    }
    
    // Navigate to relevant page based on notification type
    if (notification.task_id) {
      navigate(`/tasks/${notification.task_id}`);
    } else if (notification.project_id) {
      navigate(`/projects/${notification.project_id}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 flex-wrap">
            {["all", "unread", "read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="mb-6 flex gap-3 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mark All as Read
              </button>
            )}
            {notifications.filter(n => n.is_read).length > 0 && (
              <button
                onClick={handleDeleteAllRead}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Delete All Read
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.notification_id}
                  className={`p-6 rounded-xl border flex gap-4 hover:shadow-lg transition-all cursor-pointer ${
                    notif.is_read
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notif.event_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    {notif.actor_name && (
                      <p className="font-semibold text-sm text-gray-700">
                        {notif.actor_name}
                      </p>
                    )}
                    <p className="text-gray-900 mt-1">{notif.message}</p>
                    {notif.task_title && (
                      <p className="text-sm text-gray-500 mt-1">
                        Task: {notif.task_title}
                      </p>
                    )}
                    {notif.project_name && (
                      <p className="text-sm text-gray-500 mt-1">
                        Project: {notif.project_name}
                      </p>
                    )}
                    <p className="text-xs mt-2 text-gray-400">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.notification_id)}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5 text-blue-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notif.notification_id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 rounded-xl border bg-white border-gray-200 text-center text-gray-500">
                <Bell className="w-16 h-16 mx-auto opacity-20 mb-4" />
                <p className="text-lg font-medium">No notifications to show</p>
                <p className="text-sm mt-2">You're all caught up!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
