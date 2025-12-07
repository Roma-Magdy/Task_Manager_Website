import { createContext, useState, useCallback, useEffect } from "react";
import axios from "../utils/axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationPreferences, setNotificationPreferences] = useState({
    enabled: true,
    somethingDue: true,
    taskNotDone: true,
    taskAssigned: true,
    projectAssigned: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("notificationPreferences");
    if (saved) {
      setNotificationPreferences(JSON.parse(saved));
    }
    
    // Fetch unread count on mount
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get("/notifications/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const refreshUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, []);

  const updatePreferences = useCallback((newPreferences) => {
    setNotificationPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem("notificationPreferences", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        notificationPreferences,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
