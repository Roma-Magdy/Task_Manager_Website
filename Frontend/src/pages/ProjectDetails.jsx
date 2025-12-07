import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Download, Trash2, ArrowLeft, Edit2, Plus } from "lucide-react"
import axios from "../utils/axios"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [availableMembers, setAvailableMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [memberSearchInput, setMemberSearchInput] = useState("")

  useEffect(() => {
    fetchProject()
    fetchAvailableMembers()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/projects/${id}`)
      
      if (response.data.success) {
        const projectData = response.data.data
        
        // Transform data to match component format
        const transformedProject = {
          id: projectData.project_id,
          name: projectData.project_name,
          description: projectData.description,
          status: projectData.status,
          progress: calculateProgress(projectData.tasks),
          dueDate: projectData.due_date ? new Date(projectData.due_date).toISOString().split('T')[0] : 'N/A',
          createdDate: projectData.created_at ? new Date(projectData.created_at).toISOString().split('T')[0] : 'N/A',
          attachments: projectData.attachments.map(att => ({
            id: att.attachment_id,
            name: att.file_name,
            size: att.file_size,
            type: att.file_type,
            path: att.file_path
          })),
          teamMembers: projectData.members.map(member => ({
            id: member.user_id,
            name: member.full_name,
            role: member.role
          })),
          tasks: projectData.tasks.map(task => ({
            id: task.task_id,
            title: task.title,
            status: mapTaskStatus(task.status),
            priority: mapTaskPriority(task.priority),
            assignee: task.assignee_name || 'Unassigned'
          }))
        }
        
        setProject(transformedProject)
        setSelectedMembers(transformedProject.teamMembers)
      }
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load project details")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableMembers = async () => {
    try {
      const response = await axios.get('/users/all')
      if (response.data.success) {
        const users = response.data.data.map(user => ({
          id: user.user_id,
          name: user.full_name,
          email: user.email
        }))
        setAvailableMembers(users)
      }
    } catch (err) {
      console.error("Error fetching members:", err)
    }
  }

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0
    const completed = tasks.filter(t => t.status === 'done').length
    return Math.round((completed / tasks.length) * 100)
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

  const handleDownloadAttachment = (attachment) => {
    // Download file from server
    const downloadUrl = `http://localhost:5000${attachment.path}`
    window.open(downloadUrl, '_blank')
  }

  const handleDeleteAttachment = async (attachmentId) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        const response = await axios.delete(`/projects/${id}/attachments/${attachmentId}`)
        
        if (response.data.success) {
          setProject((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((att) => att.id !== attachmentId),
          }))
          alert("Attachment deleted successfully!")
        }
      } catch (err) {
        console.error("Error deleting attachment:", err)
        alert("Failed to delete attachment")
      }
    }
  }

  const handleAddMember = (member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers((prev) => [...prev, member])
    }
  }

  const handleRemoveMember = (memberId) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const handleSaveMembers = async () => {
    try {
      const memberIds = selectedMembers.map(m => m.id)
      const response = await axios.put(`/projects/${id}`, {
        memberIds: memberIds
      })
      
      if (response.data.success) {
        setProject((prev) => ({
          ...prev,
          teamMembers: selectedMembers,
        }))
        setShowAssignModal(false)
        setMemberSearchInput("")
        alert("Team members updated successfully!")
      }
    } catch (err) {
      console.error("Error updating members:", err)
      alert("Failed to update team members")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Planning: { bg: "#dbeafe", text: "#1e40af" },
      "In Progress": { bg: "#fef3c7", text: "#92400e" },
      Completed: { bg: "#dcfce7", text: "#166534" },
      "To-Do": { bg: "#f3f4f6", text: "#374151" },
    }
    return colors[status] || { bg: "#f3f4f6", text: "#374151" }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      High: { bg: "#fee2e2", text: "#991b1b" },
      Medium: { bg: "#fef3c7", text: "#92400e" },
      Low: { bg: "#dcfce7", text: "#166534" },
    }
    return colors[priority] || { bg: "#f3f4f6", text: "#374151" }
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "[IMG]"
    if (fileType.includes("pdf")) return "[PDF]"
    if (fileType.includes("word") || fileType.includes("document")) return "[DOC]"
    if (fileType.includes("sheet") || fileType.includes("excel")) return "[XLS]"
    return "[FILE]"
  }

  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearchInput.toLowerCase()) &&
      !selectedMembers.find((m) => m.id === member.id),
  )

  if (loading) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ textAlign: "center", padding: "64px", color: "#4b5563" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Loading project...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
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

  if (!project) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ textAlign: "center", padding: "64px", color: "#4b5563" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Project not found</div>
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
      </div>
    )
  }

  const taskStats = {
    total: project.tasks.length,
    completed: project.tasks.filter((t) => t.status === "Completed").length,
    inProgress: project.tasks.filter((t) => t.status === "In Progress").length,
    todo: project.tasks.filter((t) => t.status === "To-Do").length,
  }

  const statusColor = getStatusColor(project.status)

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>{project.name}</h1>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                marginTop: "12px",
                backgroundColor: statusColor.bg,
                color: statusColor.text,
              }}
            >
              {project.status}
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate(`/projects/${project.id}/edit`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              <Edit2 size={16} style={{ display: "inline" }} /> Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
            >
              <Trash2 size={16} style={{ display: "inline" }} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Main Info */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
            Project Description
          </h2>
          <p style={{ color: "#4b5563", marginBottom: "24px" }}>{project.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Created</p>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", margin: "4px 0 0 0" }}>
                  {project.createdDate}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Due Date</p>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", margin: "4px 0 0 0" }}>
                  {project.dueDate}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Overall Progress</span>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#111827" }}>{project.progress}%</span>
            </div>
            <div
              style={{
                width: "100%",
                backgroundColor: "#e5e7eb",
                borderRadius: "9999px",
                height: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#2563eb",
                  height: "100%",
                  borderRadius: "9999px",
                  transition: "width 0.3s",
                  width: `${project.progress}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
            Task Statistics
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                backgroundColor: "#f0fdf4",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#374151" }}>Completed</span>
              <span style={{ fontWeight: "bold", color: "#111827" }}>{taskStats.completed}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                backgroundColor: "#fefce8",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#374151" }}>In Progress</span>
              <span style={{ fontWeight: "bold", color: "#111827" }}>{taskStats.inProgress}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#374151" }}>To-Do</span>
              <span style={{ fontWeight: "bold", color: "#111827" }}>{taskStats.todo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", marginTop: 0, marginBottom: 0 }}>
            Project Tasks
          </h2>
          <button
            onClick={() => navigate("/create-task", { state: { projectId: id, projectName: project.name } })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th
                  style={{ textAlign: "left", padding: "12px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}
                >
                  Task
                </th>
                <th
                  style={{ textAlign: "left", padding: "12px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}
                >
                  Status
                </th>
                <th
                  style={{ textAlign: "left", padding: "12px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}
                >
                  Priority
                </th>
                <th
                  style={{ textAlign: "left", padding: "12px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}
                >
                  Assignee
                </th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr 
                  key={task.id} 
                  style={{ 
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>{task.title}</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: getStatusColor(task.status).bg,
                        color: getStatusColor(task.status).text,
                      }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: getPriorityColor(task.priority).bg,
                        color: getPriorityColor(task.priority).text,
                      }}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>{task.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attachments Section */}
      {project.attachments.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "24px",
            marginBottom: "32px",
            minWidth: "fit-content",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
            Attachments
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {project.attachments.map((attachment) => (
              <div
                key={attachment.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  transition: "box-shadow 0.3s",
                  minWidth: "fit-content",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb", width: "48px" }}>
                    {getFileIcon(attachment.type)}
                  </span>
                  <div style={{ flex: 1, overflow: "hidden", minWidth: "fit-content" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#111827",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        wordBreak: "break-all",
                        minWidth: "fit-content",
                      }}
                      title={attachment.name}
                    >
                      {attachment.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>{attachment.size} KB</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "8px" }}>
                  <button
                    onClick={() => handleDownloadAttachment(attachment)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#2563eb",
                      transition: "color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#1d4ed8")}
                    onMouseLeave={(e) => (e.target.style.color = "#2563eb")}
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#dc2626",
                      transition: "color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                    onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: 0 }}>Team Members</h2>
          <button
            onClick={() => setShowAssignModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Assign Members
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {project.teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <p style={{ fontWeight: "500", color: "#111827", margin: 0, fontSize: "14px" }}>{member.name}</p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Members Modal */}
      {showAssignModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setShowAssignModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", marginTop: 0, marginBottom: "16px" }}>
              Assign Team Members
            </h2>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}
              >
                Search Members
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={memberSearchInput}
                onChange={(e) => setMemberSearchInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <h3
                  style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}
                >
                  Available Members
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleAddMember(member)}
                        style={{
                          padding: "12px",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#111827",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                      >
                        <div style={{ fontWeight: "500" }}>{member.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{member.email}</div>
                      </button>
                    ))
                  ) : (
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>No members available</p>
                  )}
                </div>
              </div>

              <div>
                <h3
                  style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}
                >
                  Selected Members ({selectedMembers.length})
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {selectedMembers.length > 0 ? (
                    selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "8px",
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#111827" }}>{member.name}</span>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: 0,
                          }}
                          onMouseEnter={(e) => (e.target.style.color = "#b91c1c")}
                          onMouseLeave={(e) => (e.target.style.color = "#dc2626")}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>No members selected</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
              <button
                onClick={handleSaveMembers}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                Save Members
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d1d5db")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetails
