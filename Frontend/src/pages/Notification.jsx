// "use client"

// import { useContext, useState } from "react"
// import { motion } from "framer-motion"
// import { useNavigate } from "react-router-dom"
// import { Bell, ArrowLeft, Check, X, AlertCircle, CheckCircle, Zap } from "lucide-react"
// import { NotificationContext } from "../context/NotificationContext"
// import "../styles/notifications.css"

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//       delayChildren: 0.1,
//     },
//   },
// }

// const itemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: { duration: 0.4, ease: "easeOut" },
//   },
// }

// export default function NotificationsPage() {
//   const navigate = useNavigate()
//   const { notifications, markAsRead, markAllAsRead, deleteNotification } = useContext(NotificationContext)
//   const [filter, setFilter] = useState("all")

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "deadline":
//         return <AlertCircle className="w-6 h-6 text-red-500" />
//       case "reminder":
//         return <Zap className="w-6 h-6 text-yellow-500" />
//       case "task-assigned":
//         return <CheckCircle className="w-6 h-6 text-blue-500" />
//       case "project-assigned":
//         return <CheckCircle className="w-6 h-6 text-green-500" />
//       default:
//         return <Bell className="w-6 h-6 text-gray-500" />
//     }
//   }

//   const formatTime = (date) => {
//     const now = new Date()
//     const diffMs = now - date
//     const diffMins = Math.floor(diffMs / 60000)
//     const diffHours = Math.floor(diffMins / 60)
//     const diffDays = Math.floor(diffHours / 24)

//     if (diffMins < 1) return "Just now"
//     if (diffMins < 60) return `${diffMins}m ago`
//     if (diffHours < 24) return `${diffHours}h ago`
//     return `${diffDays}d ago`
//   }

//   let filteredNotifications = notifications

//   if (filter === "unread") {
//     filteredNotifications = notifications.filter((n) => !n.read)
//   } else if (filter === "read") {
//     filteredNotifications = notifications.filter((n) => n.read)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-50/30 font-sans">
//       {/* Header */}
//       <div className="bg-white border-b border-blue-100">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center gap-4 mb-6">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/profile")}
//               className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 text-blue-600" />
//             </motion.button>
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
//               <p className="text-sm text-foreground/60">Manage all your task updates in one place</p>
//             </div>
//           </div>

//           {/* Filter Tabs */}
//           <div className="flex gap-3">
//             {["all", "unread", "read"].map((tab) => (
//               <motion.button
//                 key={tab}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setFilter(tab)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   filter === tab ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {filteredNotifications.length > 0 && (
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={markAllAsRead}
//             className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//           >
//             Mark All as Read
//           </motion.button>
//         )}

//         {/* Notifications List */}
//         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
//           {filteredNotifications.length > 0 ? (
//             filteredNotifications.map((notif) => (
//               <motion.div
//                 key={notif.id}
//                 variants={itemVariants}
//                 className={`p-6 rounded-xl border flex gap-4 hover:shadow-lg transition-all ${
//                   notif.read ? "bg-white border-blue-100" : "bg-blue-50 border-blue-200"
//                 }`}
//               >
//                 {/* Icon */}
//                 <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>

//                 {/* Content */}
//                 <div className="flex-grow">
//                   <p className="font-semibold text-lg text-foreground">{notif.title}</p>
//                   <p className="text-sm mt-1 text-foreground/60">{notif.message}</p>
//                   <p className="text-xs mt-2 text-foreground/40">{formatTime(notif.timestamp)}</p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 flex-shrink-0">
//                   {!notif.read && (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       onClick={() => markAsRead(notif.id)}
//                       className="p-2 rounded-lg hover:bg-blue-600/20 transition-colors"
//                     >
//                       <Check className="w-5 h-5 text-blue-600" />
//                     </motion.button>
//                   )}
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     onClick={() => deleteNotification(notif.id)}
//                     className="p-2 rounded-lg hover:bg-red-600/20 transition-colors"
//                   >
//                     <X className="w-5 h-5 text-red-600" />
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <div className="p-12 rounded-xl border bg-white border-blue-100 text-center text-foreground/60">
//               <Bell className="w-16 h-16 mx-auto opacity-20 mb-4" />
//               <p className="text-lg font-medium">No notifications to show</p>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

import { useContext, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Bell, ArrowLeft, Check, X, AlertCircle, CheckCircle, Zap } from "lucide-react"
import { NotificationContext } from "../context/NotificationContext"
import "../styles/notifications.css"

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
  const navigate = useNavigate()
  const { notifications, markAsRead, markAllAsRead, deleteNotification, notificationPreferences } =
    useContext(NotificationContext)
  const [filter, setFilter] = useState("all")

  const getNotificationIcon = (type) => {
    switch (type) {
      case "deadline":
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case "reminder":
        return <Zap className="w-6 h-6 text-yellow-500" />
      case "task-assigned":
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      case "project-assigned":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      default:
        return <Bell className="w-6 h-6 text-gray-500" />
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  let filteredNotifications = notifications

  if (filter === "unread") {
    filteredNotifications = notifications.filter((n) => !n.read)
  } else if (filter === "read") {
    filteredNotifications = notifications.filter((n) => n.read)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-blue-50/30 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-900" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-foreground/60">
                {notificationPreferences.enabled
                  ? "Manage all your task updates in one place"
                  : "Notifications are disabled"}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3">
            {["all", "unread", "read"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotifications.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllAsRead}
            className="mb-6 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Mark All as Read
          </motion.button>
        )}

        {/* Notifications List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                className={`p-6 rounded-xl border flex gap-4 hover:shadow-lg transition-all ${
                  notif.read ? "bg-white border-blue-100" : "bg-blue-50 border-blue-200"
                }`}
              >
                {/* Icon */}
                <div className="shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>

                {/* Content */}
                <div className="grow">
                  <p className="font-semibold text-lg text-foreground">{notif.title}</p>
                  <p className="text-sm mt-1 text-foreground/60">{notif.message}</p>
                  <p className="text-xs mt-2 text-foreground/40">{formatTime(notif.timestamp)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {!notif.read && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-lg hover:bg-blue-600/20 transition-colors"
                    >
                      <Check className="w-5 h-5 text-blue-900" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 rounded-lg hover:bg-red-600/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 rounded-xl border bg-white border-blue-100 text-center text-foreground/60">
              <Bell className="w-16 h-16 mx-auto opacity-20 mb-4" />
              <p className="text-lg font-medium">
                {notificationPreferences.enabled ? "No notifications to show" : "Notifications are disabled"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
