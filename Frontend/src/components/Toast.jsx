"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "info", duration = 5000) => {
    const id = toastId++
    const toast = { id, message, type }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export const ToastContainer = ({ toasts, removeToast, isDarkMode }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <AlertCircle className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "deadline-alert":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return isDarkMode
          ? "bg-green-900 border-green-700 text-green-100"
          : "bg-green-50 border-green-200 text-green-800"
      case "error":
        return isDarkMode ? "bg-red-900 border-red-700 text-red-100" : "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return isDarkMode
          ? "bg-yellow-900 border-yellow-700 text-yellow-100"
          : "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "deadline-alert":
        return isDarkMode
          ? "bg-orange-900 border-orange-700 text-orange-100"
          : "bg-orange-50 border-orange-200 text-orange-800"
      default:
        return isDarkMode ? "bg-blue-900 border-blue-700 text-blue-100" : "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-lg border max-w-sm ${getStyles(toast.type)}`}
          >
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <p className="flex-grow text-sm font-medium">{toast.message}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
