
import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, AlertCircle, CheckCircle, MessageSquare, Paperclip, FolderOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { NotificationContext } from "../context/NotificationContext"
import axios from "../utils/axios"
import { toast } from "sonner"

export const NotificationDropdown = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()
  const { unreadCount, refreshUnreadCount } = useContext(NotificationContext)

  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications()
    }
  }, [isOpen])

  const fetchRecentNotifications = async () => {
    try {
      const response = await axios.get("/notifications", { params: { limit: 5 } })
      if (response.data.success) {
        setNotifications(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`)
      if (response.data.success) {
        setNotifications(notifications.map(n => 
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        ))
        refreshUnreadCount()
      }
    } catch (error) {
      console.error("Error marking as read:", error)
      toast.error("Failed to mark as read")
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`)
      if (response.data.success) {
        setNotifications(notifications.filter(n => n.notification_id !== notificationId))
        refreshUnreadCount()
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const getNotificationIcon = (eventType) => {
    switch (eventType) {
      case "task_status_changed":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "task_assigned":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "new_comment":
        return <MessageSquare className="w-5 h-5 text-green-500" />
      case "new_attachment":
        return <Paperclip className="w-5 h-5 text-purple-500" />
      case "project_update":
        return <FolderOpen className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-2 rounded-lg transition-colors ${
          isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-blue-50 hover:bg-blue-100"
        }`}
      >
        <Bell className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-blue-900"}`} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
              unreadCount > 9 ? "bg-red-500" : "bg-red-500"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border z-50 ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDarkMode ? "border-slate-700" : "border-blue-100"
              }`}
            >
              <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-foreground"}`}>
                Notifications
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  isDarkMode ? "hover:bg-white" : "hover:bg-blue-900"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.notification_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b flex gap-3 hover:bg-opacity-50 transition-colors cursor-pointer ${
                      isDarkMode
                        ? `border-slate-700 ${notif.is_read ? "bg-slate-800" : "bg-slate-700/50"}`
                        : `border-blue-50 ${notif.is_read ? "bg-white" : "bg-blue-50"}`
                    }`}
                    onClick={() => {
                      if (notif.task_id) {
                        navigate(`/tasks/${notif.task_id}`)
                      } else if (notif.project_id) {
                        navigate(`/projects/${notif.project_id}`)
                      }
                      setIsOpen(false)
                    }}
                  >
                    {/* Icon */}
                    <div className="shrink-0 mt-1">{getNotificationIcon(notif.event_type)}</div>

                    {/* Content */}
                    <div className="grow min-w-0">
                      <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-foreground/80"}`}>
                        {notif.message}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-foreground/40"}`}>
                        {formatTime(notif.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {!notif.is_read && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleMarkAsRead(notif.notification_id)}
                          className="p-1 rounded hover:bg-blue-900/20 transition-colors"
                        >
                          <Check className="w-4 h-4 text-blue-900" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteNotification(notif.notification_id)}
                        className="p-1 rounded hover:bg-red-600/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={`p-8 text-center ${isDarkMode ? "text-slate-400" : "text-foreground/60"}`}>
                  <Bell className="w-12 h-12 mx-auto opacity-30 mb-2" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${isDarkMode ? "border-slate-700" : "border-blue-100"}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate("/notifications")
                  setIsOpen(false)
                }}
                className="w-full py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Notifications
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
