import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Edit, Trash2, Calendar } from "lucide-react"
import CommentSection from "../components/CommentSection"

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        // Replace with actual API call:
        // const response = await fetch(`/api/tasks/${id}`);
        // const taskData = await response.json();

        const mockTask = {
          id: 2,
          title: "Fix login bug",
          description:
            "Resolve authentication issue in production. Users are unable to log in with their credentials. This is a critical issue affecting all users.",
          status: "To-Do",
          priority: "Critical",
          category: "Bug Fixes",
          assignee: "Mike Johnson",
          dueDate: "2025-11-30",
          createdDate: "2025-11-28",
          project: "Security",
        }
        setTask(mockTask)
      } catch (error) {
        console.error("Error fetching task:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Replace with actual API call:
      // await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      navigate("/tasks")
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${id}`)
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
                  <p className="text-gray-900 font-semibold">{task.createdDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} className={isOverdue(task.dueDate) ? "text-red-600" : ""} />
                    <span className="text-sm font-semibold">Due Date</span>
                  </div>
                  <p className={`font-semibold ${isOverdue(task.dueDate) ? "text-red-600" : "text-gray-900"}`}>
                    {task.dueDate}
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

          <CommentSection taskId={id} />
        </div>
      </div>
    </div>
  )
}
