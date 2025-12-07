"use client"

import { useState, useEffect } from "react"
import { Trash2, Heart } from "lucide-react"
import axios from "../utils/axios"
import { toast } from "sonner"

export default function CommentSection({ taskId, comments = [], onCommentAdded }) {
  const [allComments, setAllComments] = useState(comments)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  // Update comments when prop changes
  useEffect(() => {
    setAllComments(comments)
  }, [comments])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(`/tasks/${taskId}/comments`, {
        comment: newComment
      })

      if (response.data.success) {
        toast.success("Comment added successfully")
        setNewComment("")
        // Refresh task data to get updated comments
        if (onCommentAdded) {
          onCommentAdded()
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      const response = await axios.delete(`/tasks/${taskId}/comments/${commentId}`)
      
      if (response.data.success) {
        toast.success("Comment deleted successfully")
        setAllComments(allComments.filter((c) => c.comment_id !== commentId))
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Comments</h2>
      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            CU
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="bg-blue-900 hover:bg-blue-900 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                {loading ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={() => setNewComment("")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {allComments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          allComments.map((comment) => (
            <div key={comment.comment_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {(comment.user_name || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{comment.user_name || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.comment_text}</p>

                  {/* Comment Actions */}
                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="text-gray-600 hover:text-red-600 flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
