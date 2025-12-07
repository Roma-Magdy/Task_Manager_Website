import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Edit, Trash2, Calendar, Download } from "lucide-react"
import CommentSection from "../components/CommentSection"
import axios from "../utils/axios"
import { toast } from "sonner"

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/tasks/${id}`)
      
      const taskData = response.data.data
      
      // Map backend data to frontend format
      setTask({
        id: taskData.task_id,
        title: taskData.title,
        description: taskData.description,
        status: formatStatus(taskData.status),
        priority: formatPriority(taskData.priority),
        category: taskData.category,
        assignee: taskData.assigned_users || "Unassigned",
        dueDate: taskData.due_date,
        createdDate: taskData.created_at,
        project: taskData.project_name || "No Project",
        attachments: taskData.attachments?.map(att => ({
          id: att.attachment_id,
          name: att.file_name,
          size: att.file_size,
          type: att.file_type,
          path: att.file_path
        })) || [],
        comments: taskData.comments || []
      })
    } catch (error) {
      console.error("Error fetching task:", error)
      toast.error("Failed to load task details")
    } finally {
      setLoading(false)
    }
  }

  const formatStatus = (status) => {
    const statusMap = {
      'todo': 'To-Do',
      'in_progress': 'In Progress',
      'done': 'Completed',
      'blocked': 'Blocked'
    }
    return statusMap[status] || status
  }

  const formatPriority = (priority) => {
    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    }
    return priorityMap[priority] || priority
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${id}`)
        toast.success("Task deleted successfully")
        navigate("/tasks")
      } catch (error) {
        console.error("Error deleting task:", error)
        toast.error("Failed to delete task")
      }
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${id}`)
  }

  const handleDownloadAttachment = (attachment) => {
    const downloadUrl = `http://localhost:5000${attachment.path}`
    window.open(downloadUrl, '_blank')
  }

  const handleDeleteAttachment = async (attachmentId) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        await axios.delete(`/tasks/${id}/attachments/${attachmentId}`)
        toast.success("Attachment deleted successfully")
        setTask((prev) => ({
          ...prev,
          attachments: prev.attachments.filter((att) => att.id !== attachmentId),
        }))
      } catch (error) {
        console.error("Error deleting attachment:", error)
        toast.error("Failed to delete attachment")
      }
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word") || fileType.includes("document")) return "📝"
    if (fileType.includes("sheet") || fileType.includes("excel")) return "📊"
    if (fileType.includes("text")) return "📋"
    return "📎"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Critical: "bg-red-100 text-red-800",
      High: "bg-orange-100 text-orange-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-green-100 text-green-800",
      "To-Do": "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading task...</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Task not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ChevronLeft size={20} />
            Back to Tasks
          </button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{task.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Description</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-6">{task.description}</p>

              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} />
                    <span className="text-sm font-semibold">Created</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{formatDate(task.createdDate)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} className={isOverdue(task.dueDate) ? "text-red-600" : ""} />
                    <span className="text-sm font-semibold">Due Date</span>
                  </div>
                  <p className={`font-semibold ${isOverdue(task.dueDate) ? "text-red-600" : "text-gray-900"}`}>
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && <span className="ml-2 text-sm">(Overdue)</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{task.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project</p>
                  <p className="font-semibold text-gray-900">{task.project}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assigned To</p>
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {task.assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-semibold text-gray-900">{task.assignee}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attachments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {task.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition w-fit"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{attachment.size} KB</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleDownloadAttachment(attachment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

          <CommentSection taskId={id} comments={task.comments} onCommentAdded={fetchTask} />
        </div>
      </div>
    </div>
  )
}
