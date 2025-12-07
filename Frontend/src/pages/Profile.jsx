import { motion } from "framer-motion"
import { Edit2, Mail, User, ArrowLeft, Check, Bell, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import axios from "../utils/axios"
import { toast } from "sonner"
import "../styles/profile.css"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

// --- FIX IS HERE ---
const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  password: Yup.string()
    // This allows empty strings to pass validation
    .test('len', 'Password must be at least 6 characters', val => !val || val.length >= 6),
})

export default function Profile() {
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: ""
  })

  // Notification Preferences State
  const [notificationPreferences, setNotificationPreferences] = useState({
    enabled: true,
    somethingDue: true,
    taskNotDone: true,
    taskAssigned: true,
    projectAssigned: true,
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // 1. Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        const { data } = await axios.get("/users/profile")

        setFormData({
          email: data.email || "",
          fullName: data.fullName || "",
          password: "" 
        })

        if (data.preferences) {
            setNotificationPreferences(data.preferences)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // 2. Handle Profile Save
  const handleSave = async () => {
    try {
      await profileValidationSchema.validate(formData, { abortEarly: false })
      
      const payload = { fullName: formData.fullName }
      // Only add password to payload if it's not empty
      if (formData.password) {
          payload.password = formData.password
      }

      await axios.put("/users/profile", payload)

      setErrors({})
      setSuccessMessage("Profile updated successfully!")
      setIsEditing(false)
      setFormData(prev => ({ ...prev, password: "" })) 
      toast.success("Profile updated successfully")
      
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      if (error.inner) {
        const newErrors = {}
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message
        })
        setErrors(newErrors)
      } else {
        console.error(error)
        toast.error(error.response?.data?.message || "Update failed")
      }
    }
  }

  // 3. Handle Preferences Save
  const savePreferencesToBackend = async (newPrefs) => {
      try {
        await axios.put("/users/profile/preferences", newPrefs)
      } catch (error) {
          console.error("Failed to save preferences", error)
          toast.error("Failed to save settings")
      }
  }

  const handleNotificationToggle = (key) => {
    const newValue = !notificationPreferences[key]
    const newPrefs = { ...notificationPreferences, [key]: newValue }
    
    setNotificationPreferences(newPrefs) 
    savePreferencesToBackend(newPrefs)
  }

  const handleNotificationEnabledToggle = () => {
    const newValue = !notificationPreferences.enabled
    const newPrefs = { ...notificationPreferences, enabled: newValue }
    
    setNotificationPreferences(newPrefs)
    savePreferencesToBackend(newPrefs)
  }

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-blue-50/30 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-900" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-foreground/60">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}

          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-xl border border-blue-100 bg-white hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{formData.fullName}</h2>
                <p className="text-foreground/60">{formData.email}</p>
              </div>
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border space-y-4"
              >
                {/* 1. Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/70 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-input text-foreground ${
                        errors.fullName ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                </div>

                {/* 2. Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/70 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-gray-100 text-foreground/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/70 mb-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </label>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-input text-foreground ${
                        errors.password ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-linear-to-r from-blue-900 to-blue-200 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Notification Preferences Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-xl border border-blue-100 bg-white hover:shadow-lg transition-all"
          >
            <Bell className="w-8 h-8 text-blue-900 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>

            {/* Master Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-900" />
                <label className="text-sm font-medium text-foreground">Enable Notifications</label>
              </div>
              <button
                onClick={handleNotificationEnabledToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPreferences.enabled ? "bg-blue-900" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${notificationPreferences.enabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Notification Categories */}
            {notificationPreferences.enabled && (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase text-foreground/50">Notification Categories</p>
                {[
                  { key: "somethingDue", label: "Something Due Reminder" },
                  { key: "taskNotDone", label: "Task Not Done Notification" },
                  { key: "taskAssigned", label: "New Task Assigned" },
                  { key: "projectAssigned", label: "New Project Assigned" },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between pl-2">
                    <label className="text-sm font-medium text-foreground">{pref.label}</label>
                    <button
                      onClick={() => handleNotificationToggle(pref.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPreferences[pref.key] ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${notificationPreferences[pref.key] ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}