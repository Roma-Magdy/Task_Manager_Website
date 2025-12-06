import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"; // <--- Import Axios
import { ChevronLeft, Edit, Trash2, Calendar, User, AlertCircle } from "lucide-react";
import CommentSection from "../components/CommentSection";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [newSubtask, setNewSubtask] = useState("");

  // --- 1. FETCH FROM REAL BACKEND ---
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        
        // Call your API (Port 5258)
        const response = await axios.get(`http://localhost:5258/api/Tasks/${id}`);
        const data = response.data;

        // SAFEGUARD: Ensure arrays exist even if DB returns null
        // This prevents "map is not a function" errors
        const safeTask = {
            ...data,
            subtasks: data.subtasks || [], 
            comments: data.comments || [],
            // Handle potentially missing fields
            assignee: data.assignee || "Unassigned",
            project: data.project || "General",
            priority: data.priority || "Medium",
            status: data.status || "To-Do"
        };

        setTask(safeTask);

      } catch (error) {
        console.error("Error fetching task:", error);
        // Optional: Alert user if task doesn't exist
        // if (error.response && error.response.status === 404) alert("Task not found");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // --- 2. REAL DELETE FUNCTION ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5258/api/Tasks/${id}`);
        alert("Task deleted successfully!");
        navigate("/tasks");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  // --- Subtask Logic (Local State for now) ---
  const toggleSubtask = (subtaskId) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newItem = {
        id: Date.now(), // Temporary ID
        title: newSubtask,
        completed: false,
      };
      
      setTask((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, newItem],
      }));
      setNewSubtask("");
    }
  };

  const deleteSubtask = (subtaskId) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== subtaskId),
    }));
  };

  // --- Helper Functions ---
  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Critical: "bg-red-100 text-red-800",
      High: "bg-orange-100 text-orange-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-green-100 text-green-800",
      "To-Do": "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() =>
              projectId
                ? navigate(`/projects/${projectId}`)
                : navigate("/tasks")
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ChevronLeft size={20} />
            {projectId ? "Back to Project" : "Back to Tasks"}
          </button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {task.title}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                    task.priority
                  )}`}
                >
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Task Description
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} />
                    <span className="text-sm font-semibold">Created</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {task.createdDate ? new Date(task.createdDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar
                      size={18}
                      className={isOverdue(task.dueDate) ? "text-red-600" : ""}
                    />
                    <span className="text-sm font-semibold">Due Date</span>
                  </div>
                  <p
                    className={`font-semibold ${
                      isOverdue(task.dueDate) ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Task Information
              </h2>
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
                        {/* Initials Logic */}
                        {task.assignee ? task.assignee.substring(0,2).toUpperCase() : "?"}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {task.assignee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Subtasks</h2>
            <div className="space-y-3 mb-4">
              {task.subtasks.length === 0 && <p className="text-gray-500">No subtasks found.</p>}
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      subtask.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSubtask()}
                placeholder="Add a new subtask..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSubtask}
                className="bg-blue-900 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          <CommentSection taskId={id} comments={task.comments} />
        </div>
      </div>
    </div>
  );
}