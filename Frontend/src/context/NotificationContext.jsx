// import { createContext, useState, useCallback } from "react"

// export const NotificationContext = createContext()

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       type: "deadline",
//       title: "Task Due Today",
//       message: "Complete project proposal",
//       timestamp: new Date(Date.now() - 5 * 60000),
//       read: false,
//     },
//     {
//       id: 2,
//       type: "reminder",
//       title: "Incomplete Task",
//       message: "Finish design mockups",
//       timestamp: new Date(Date.now() - 30 * 60000),
//       read: false,
//     },
//     {
//       id: 3,
//       type: "task-assigned",
//       title: "New Task Assigned",
//       message: 'You have been assigned "Review Budget"',
//       timestamp: new Date(Date.now() - 2 * 3600000),
//       read: true,
//     },
//   ])

//   const [notificationPreferences, setNotificationPreferences] = useState({
//     enabled: true,
//     somethingDue: true,
//     taskNotDone: true,
//     taskAssigned: true,
//     projectAssigned: true,
//   })

//   const addNotification = useCallback((notification) => {
//     const newNotification = {
//       id: Date.now(),
//       timestamp: new Date(),
//       read: false,
//       ...notification,
//     }
//     setNotifications((prev) => [newNotification, ...prev])
//   }, [])

//   const markAsRead = useCallback((id) => {
//     setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
//   }, [])

//   const markAllAsRead = useCallback(() => {
//     setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
//   }, [])

//   const deleteNotification = useCallback((id) => {
//     setNotifications((prev) => prev.filter((notif) => notif.id !== id))
//   }, [])

//   const updatePreferences = useCallback(
//     (newPreferences) => {
//       setNotificationPreferences((prev) => ({
//         ...prev,
//         ...newPreferences,
//       }))
//       localStorage.setItem("notificationPreferences", JSON.stringify({ ...notificationPreferences, ...newPreferences }))
//     },
//     [notificationPreferences],
//   )

//   const unreadCount = notifications.filter((n) => !n.read).length

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         notificationPreferences,
//         addNotification,
//         markAsRead,
//         markAllAsRead,
//         deleteNotification,
//         updatePreferences,
//         unreadCount,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   )
// }

"use client"

import { createContext, useState, useCallback, useEffect } from "react"

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "deadline",
      title: "Task Due Today",
      message: "Complete project proposal",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "reminder",
      title: "Incomplete Task",
      message: "Finish design mockups",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: 3,
      type: "task-assigned",
      title: "New Task Assigned",
      message: 'You have been assigned "Review Budget"',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
  ])

  const [notificationPreferences, setNotificationPreferences] = useState({
    enabled: true,
    somethingDue: true,
    taskNotDone: true,
    taskAssigned: true,
    projectAssigned: true,
  })

  useEffect(() => {
    const saved = localStorage.getItem("notificationPreferences")
    if (saved) {
      setNotificationPreferences(JSON.parse(saved))
    }
  }, [])

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  const updatePreferences = useCallback((newPreferences) => {
    setNotificationPreferences((prev) => {
      const updated = { ...prev, ...newPreferences }
      localStorage.setItem("notificationPreferences", JSON.stringify(updated))
      return updated
    })
  }, [])

  const getFilteredNotifications = useCallback(() => {
    if (!notificationPreferences.enabled) return []

    return notifications.filter((notif) => {
      switch (notif.type) {
        case "deadline":
          return notificationPreferences.somethingDue
        case "reminder":
          return notificationPreferences.taskNotDone
        case "task-assigned":
          return notificationPreferences.taskAssigned
        case "project-assigned":
          return notificationPreferences.projectAssigned
        default:
          return true
      }
    })
  }, [notifications, notificationPreferences])

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = filteredNotifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications: filteredNotifications,
        allNotifications: notifications,
        notificationPreferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
