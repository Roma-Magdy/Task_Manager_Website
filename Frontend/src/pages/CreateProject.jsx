import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../utils/axios"

const CreateProject = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Planning",
    assignMembers: "",
  })
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "",
    status: "To-Do",
    priority: "Medium",
    assignee: "",
  })
  const [attachments, setAttachments] = useState([])
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (!formData.status) newErrors.status = "Status is required"
    if (!formData.assignMembers.trim()) newErrors.assignMembers = "Assign members is required"
    if (tasks.length === 0) newErrors.tasks = "Add at least one task"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title")
      return
    }
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newTask,
      },
    ])
    setNewTask({
      title: "",
      status: "To-Do",
      priority: "Medium",
      assignee: "",
    })
  }

  const handleRemoveTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: file.type,
            url: reader.result,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const deleteAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
        assignMembers: formData.assignMembers,
        tasks: tasks,
        attachments: attachments
      }

      const response = await axios.post("/projects", projectData)

      if (response.data.success) {
        alert("Project created successfully!")
        navigate("/projects")
      } else {
        alert("Failed to create project: " + response.data.message)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      alert("An error occurred while creating the project")
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "[IMG]"
    if (fileType.includes("pdf")) return "[PDF]"
    if (fileType.includes("word") || fileType.includes("document")) return "[DOC]"
    if (fileType.includes("sheet") || fileType.includes("excel")) return "[XLS]"
    return "[FILE]"
  }

  const getStatusBg = (status) => {
    const colors = {
      "To-Do": "#f3f4f6",
      "In Progress": "#fef3c7",
      Completed: "#dcfce7",
      Planning: "#dbeafe",
    }
    return colors[status] || "#f3f4f6"
  }

  const getPriorityBg = (priority) => {
    const colors = {
      Low: "#dcfce7",
      Medium: "#fef3c7",
      High: "#fee2e2",
    }
    return colors[priority] || "#f3f4f6"
  }

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => navigate("/projects")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#4b5563",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "16px",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#111827")}
          onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
        >
          ← Back to Projects
        </button>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827" }}>Create New Project</h1>
        <p style={{ color: "#4b5563", marginTop: "8px" }}>Fill in the details to create a new project</p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "32px",
        }}
      >
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Project Name */}
          <div>
            <label
              style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
            >
              Project Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: errors.name ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => !errors.name && (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = errors.name ? "#ef4444" : "#d1d5db")}
            />
            {errors.name && <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label
              style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your project..."
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: errors.description ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => !errors.description && (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = errors.description ? "#ef4444" : "#d1d5db")}
            />
            {errors.description && (
              <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>{errors.description}</p>
            )}
          </div>

          {/* Due Date & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <label
                style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
              >
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: errors.dueDate ? "1px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.dueDate && (
                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>{errors.dueDate}</p>
              )}
            </div>
            <div>
              <label
                style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
              >
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: errors.status ? "1px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>{errors.status}</p>}
            </div>
          </div>

          {/* Assign Members */}
          <div>
            <label
              style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
            >
              Assign Members (comma separated)
            </label>
            <input
              type="text"
              name="assignMembers"
              placeholder="e.g., John Doe, Jane Smith"
              value={formData.assignMembers}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: errors.assignMembers ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.assignMembers && (
              <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>{errors.assignMembers}</p>
            )}
          </div>

          {/* Tasks */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
            >
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Project Tasks</label>
              <button
                type="button"
                onClick={handleAddTask}
                style={{
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontWeight: "600",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
              >
                + Add Task
              </button>
            </div>

            {/* Add Task Form */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                gap: "12px",
                alignItems: "end",
              }}
            >
              <div>
                <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="Enter task name"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>
                  Assignee
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, assignee: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Tasks Table */}
            {tasks.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Task</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                        Status
                      </th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                        Priority
                      </th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                        Assignee
                      </th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: "#374151" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "12px", color: "#111827" }}>{task.title}</td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              backgroundColor: getStatusBg(task.status),
                            }}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              backgroundColor: getPriorityBg(task.priority),
                            }}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#111827" }}>{task.assignee || "-"}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(task.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                            onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {errors.tasks && <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>{errors.tasks}</p>}
          </div>

          {/* Attachments */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <label
              style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "12px" }}
            >
              Attachments
            </label>

            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                backgroundColor: "#fafafa",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb"
                e.currentTarget.style.backgroundColor = "#eff6ff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db"
                e.currentTarget.style.backgroundColor = "#fafafa"
              }}
            >
              <input type="file" multiple onChange={handleFileUpload} style={{ display: "none" }} id="file-upload" />
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>PNG, JPG, PDF, DOC up to 10MB</p>
              </label>
            </div>

            {attachments.length > 0 && (
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb", width: "48px" }}>
                        {getFileIcon(attachment.type)}
                      </span>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", margin: 0 }}>
                          {attachment.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>{attachment.size} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAttachment(attachment.id)}
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "8px",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                      onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "600",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              style={{
                backgroundColor: "#e5e7eb",
                color: "#374151",
                fontWeight: "600",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#d1d5db")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProject
