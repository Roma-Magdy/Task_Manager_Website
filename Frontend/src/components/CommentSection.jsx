import { useState } from "react"
import { Trash2, Heart } from "lucide-react"

export default function CommentSection({ taskId, comments = [] }) {
  const [allComments, setAllComments] = useState(comments)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [likedComments, setLikedComments] = useState(new Set())

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      // Replace with actual API call:
      // const response = await fetch(`/api/tasks/${taskId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: newComment })
      // });
      // const data = await response.json();

      const newCommentObj = {
        id: Date.now(),
        author: "Current User",
        text: newComment,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      }

      setAllComments([...allComments, newCommentObj])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      // Replace with actual API call:
      // await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
      //   method: 'DELETE'
      // });

      setAllComments(allComments.filter((c) => c.id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      // Replace with actual API call:
      // await fetch(`/api/tasks/${taskId}/comments/${commentId}/like`, {
      //   method: 'POST'
      // });

      const newLiked = new Set(likedComments)
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId)
      } else {
        newLiked.add(commentId)
      }
      setLikedComments(newLiked)

      setAllComments(
        allComments.map((c) =>
          c.id === commentId ? { ...c, likes: (c.likes || 0) + (newLiked.has(commentId) ? 1 : -1) } : c,
        ),
      )
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Comments</h2>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
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
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
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
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {comment.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.text}</p>

                  {/* Comment Actions */}
                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 transition ${
                        likedComments.has(comment.id) ? "text-red-600" : "text-gray-600 hover:text-red-600"
                      }`}
                    >
                      <Heart size={16} fill={likedComments.has(comment.id) ? "currentColor" : "none"} />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
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
