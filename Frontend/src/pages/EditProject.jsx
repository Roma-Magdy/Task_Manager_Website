import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
import axios from "../utils/axios"

const EditProject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Planning",
  })
  const [attachments, setAttachments] = useState([])
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [newTask, setNewTask] = useState({ title: "", status: "To-Do", priority: "Medium", assignee: "" })
  const [newMember, setNewMember] = useState("")
  const [allMembers, setAllMembers] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchProject()
    fetchAllUsers()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/projects/${id}`)
      
      if (response.data.success) {
        const projectData = response.data.data
        
        setFormData({
          name: projectData.project_name,
          description: projectData.description,
          dueDate: projectData.due_date ? new Date(projectData.due_date).toISOString().split('T')[0] : '',
          status: projectData.status,
        })
        
        setAttachments(projectData.attachments.map(att => ({
          id: att.attachment_id,
          name: att.file_name,
          size: att.file_size,
          type: att.file_type,
          path: att.file_path,
          isExisting: true
        })))
        
        setTasks(projectData.tasks.map(task => ({
          id: task.task_id,
          title: task.title,
          status: mapTaskStatus(task.status),
          priority: mapTaskPriority(task.priority),
          assignee: task.assignee_name || '',
          isExisting: true
        })))
        
        setTeamMembers(projectData.members.map(member => ({
          id: member.user_id,
          name: member.full_name,
          email: member.email,
          role: member.role
        })))
      }
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/users/all')
      if (response.data.success) {
        setAllMembers(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching users:", err)
    }
  }

  const mapTaskStatus = (status) => {
    const statusMap = {
      'todo': 'To-Do',
      'in_progress': 'In Progress',
      'done': 'Completed',
      'blocked': 'Blocked'
    }
    return statusMap[status] || status
  }

  const mapTaskPriority = (priority) => {
    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    }
    return priorityMap[priority] || priority
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (!formData.status) newErrors.status = "Status is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const deleteAttachment = async (attachmentId, isExisting) => {
    // If it's an existing attachment, delete from server
    if (isExisting) {
      if (window.confirm("Are you sure you want to delete this attachment?")) {
        try {
          const response = await axios.delete(`/projects/${id}/attachments/${attachmentId}`)
          
          if (response.data.success) {
            setAttachments((prev) => prev.filter((att) => att.id !== attachmentId))
            alert("Attachment deleted successfully!")
          }
        } catch (err) {
          console.error("Error deleting attachment:", err)
          alert("Failed to delete attachment")
        }
      }
    } else {
      // Just remove from state if it's a new attachment not yet saved
      setAttachments((prev) => prev.filter((att) => att.id !== attachmentId))
    }
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert("Task title is required")
      return
    }
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTask.title,
        status: newTask.status,
        priority: newTask.priority,
        assignee: newTask.assignee,
      },
    ])
    setNewTask({ title: "", status: "To-Do", priority: "Medium", assignee: "" })
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleAddMember = () => {
    if (!newMember) {
      alert("Please select a team member")
      return
    }
    const selectedMember = allMembers.find((m) => m.user_id === parseInt(newMember))
    if (selectedMember && !teamMembers.find((m) => m.id === selectedMember.user_id)) {
      setTeamMembers((prev) => [...prev, {
        id: selectedMember.user_id,
        name: selectedMember.full_name,
        email: selectedMember.email,
        role: 'member'
      }])
      setNewMember("")
    } else {
      alert("Member already assigned")
    }
  }

  const handleRemoveMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
        memberIds: teamMembers.filter(m => m.role !== 'manager').map(m => m.id)
      }

      const response = await axios.put(`/projects/${id}`, updateData)

      if (response.data.success) {
        alert("Project updated successfully!")
        navigate(`/projects/${id}`)
      } else {
        alert("Failed to update project: " + response.data.message)
      }
    } catch (err) {
      console.error("Error updating project:", err)
      alert("An error occurred while updating the project")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`/projects/${id}`)
        if (response.data.success) {
          alert("Project deleted successfully!")
          navigate("/projects")
        }
      } catch (err) {
        console.error("Error deleting project:", err)
        alert("Failed to delete project")
      }
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "[IMG]"
    if (fileType.includes("pdf")) return "[PDF]"
    if (fileType.includes("word") || fileType.includes("document")) return "[DOC]"
    if (fileType.includes("sheet") || fileType.includes("excel")) return "[XLS]"
    return "[FILE]"
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "896px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ textAlign: "center", padding: "64px", color: "#4b5563" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Loading project...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: "896px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ 
          backgroundColor: "#fee2e2", 
          border: "1px solid #fecaca", 
          borderRadius: "8px", 
          padding: "16px", 
          color: "#991b1b",
          textAlign: "center"
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate("/projects")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Back to Projects
        </button>
      </div>
    )
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
          <ArrowLeft size={16} style={{ display: "inline" }} /> Back to Projects
        </button>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827" }}>Edit Project</h1>
        <p style={{ color: "#4b5563", marginTop: "8px" }}>Update the project details below</p>
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
              }}
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
              }}
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

          {/* Tasks */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
              Tasks
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                type="button"
                onClick={handleAddTask}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 12px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {tasks.length > 0 && (
              <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                      <th style={{ textAlign: "left", padding: "10px", color: "#6b7280", fontWeight: "600" }}>Task</th>
                      <th style={{ textAlign: "left", padding: "10px", color: "#6b7280", fontWeight: "600" }}>
                        Status
                      </th>
                      <th style={{ textAlign: "left", padding: "10px", color: "#6b7280", fontWeight: "600" }}>
                        Priority
                      </th>
                      <th style={{ textAlign: "left", padding: "10px", color: "#6b7280", fontWeight: "600" }}>
                        Assignee
                      </th>
                      <th style={{ textAlign: "center", padding: "10px", color: "#6b7280", fontWeight: "600" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px", color: "#111827" }}>{task.title}</td>
                        <td style={{ padding: "10px", color: "#6b7280" }}>{task.status}</td>
                        <td style={{ padding: "10px", color: "#6b7280" }}>{task.priority}</td>
                        <td style={{ padding: "10px", color: "#6b7280" }}>{task.assignee}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              cursor: "pointer",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                            onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Team Members */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
              Team Members
            </h3>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <select
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="">Select a team member to add</option>
                {allMembers
                  .filter((member) => !teamMembers.find((tm) => tm.id === member.user_id))
                  .map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.full_name} ({member.email})
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddMember}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {teamMembers.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      backgroundColor: member.role === 'manager' ? "#fef3c7" : "#eff6ff",
                      border: member.role === 'manager' ? "1px solid #fcd34d" : "1px solid #bfdbfe",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#111827", fontWeight: "500" }}>{member.name}</div>
                      <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "capitalize" }}>
                        {member.role}
                      </div>
                    </div>
                    {member.role !== 'manager' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: 0,
                          marginLeft: "8px",
                          display: "inline-flex",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                        onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb", width: "48px", flexShrink: 0 }}>
                        {getFileIcon(attachment.type)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                        <p style={{ 
                          fontSize: "14px", 
                          fontWeight: "500", 
                          color: "#111827", 
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={attachment.name}>
                          {attachment.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>{attachment.size} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAttachment(attachment.id, attachment.isExisting)}
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        padding: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                      onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                    >
                      <Trash2 size={18} />
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
              Save Changes
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
            <button
              type="button"
              onClick={handleDelete}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                fontWeight: "600",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "auto",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
            >
              Delete Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProject
