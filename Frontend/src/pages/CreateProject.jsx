import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ArrowLeft, Save, Upload, Trash2 } from "lucide-react"
import Textbox from "../components/Textbox"
import Button from "../components/Button"

const schema = yup.object({
  name: yup.string().required("Project name is required").min(3, "Name must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  dueDate: yup.string().required("Due date is required"),
  status: yup.string().required("Status is required"),
  assignMembers: yup.string().required("Assign members is required"),
  tasks: yup.string().required("Tasks are required"),
})

const CreateProject = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [attachments, setAttachments] = useState([])

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

  const onSubmit = (data) => {
    console.log("New Project:", data)
    console.log("Attachments:", attachments)
    alert("Project created successfully!")
    navigate("/projects")
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "[IMG]"
    if (fileType.includes("pdf")) return "[PDF]"
    if (fileType.includes("word") || fileType.includes("document")) return "[DOC]"
    if (fileType.includes("sheet") || fileType.includes("excel")) return "[XLS]"
    return "[FILE]"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new project</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Textbox
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            register={register("name")}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register("description")}
              placeholder="Describe your project..."
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textbox
              label="Due Date"
              type="date"
              placeholder=""
              register={register("dueDate")}
              error={errors.dueDate?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                {...register("status")}
                className={`w-full px-4 py-3 border ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
          </div>

          {/* Assign Members textbox */}
          <Textbox
            label="Assign Members"
            type="text"
            placeholder="Enter member names (comma separated)"
            register={register("assignMembers")}
            error={errors.assignMembers?.message}
          />

          {/* Tasks textbox */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
            <textarea
              {...register("tasks")}
              placeholder="Enter tasks (one per line)..."
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.tasks ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.tasks && <p className="text-red-500 text-sm mt-1">{errors.tasks.message}</p>}
          </div>

          {/* Attachments Section */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition">
              <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
              </label>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-600 w-12">{getFileIcon(attachment.type)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{attachment.size} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAttachment(attachment.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              label="Create Project"
              icon={<Save className="w-5 h-5" />}
              className="bg-blue-600 text-white hover:bg-blue-700"
            />
            <Button
              type="button"
              label="Cancel"
              onClick={() => navigate("/projects")}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProject
