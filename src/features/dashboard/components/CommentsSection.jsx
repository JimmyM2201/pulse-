import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  Loader2,
  CornerDownRight,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useGetUser } from '../../user/hooks/useGetUser'
import {
  useArticleComments,
  useCommentReplies,
  useAddArticleComment,
  useDeleteArticleComment,
} from '../hooks/useComments'
import { Skeleton } from '../../../components/ui/Skeleton'

// Helper: Format relative timestamp (e.g. "2 hours ago", "1 day ago")
function formatRelativeTime(dateString) {
  if (!dateString) return 'recently'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'recently'
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60)
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24)
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30)
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12)
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

// Deterministic pastel avatar background and text color palette
const AVATAR_PALETTE = [
  'bg-[#f0e7db] text-[#7a5e3a]',
  'bg-[#e1ecf7] text-[#2c5282]',
  'bg-[#e2f0e4] text-[#2f6f3e]',
  'bg-[#fbe8e8] text-[#9b2c2c]',
  'bg-[#efe4f8] text-[#5e3a87]',
  'bg-[#dce9e2] text-[#2d5356]',
]

function getAvatarColors(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[index]
}

export function CommentsSection({ articleId, initialCount = 0 }) {
  const { isAuthenticated } = useAuth()
  const { data: currentUser } = useGetUser()

  const [sortBy, setSortBy] = useState('newest')
  const [commentText, setCommentText] = useState('')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [replyingToId, setReplyingToId] = useState(null)
  const [replyText, setReplyText] = useState('')

  // Query comments
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useArticleComments(articleId, {
    sort_by: sortBy === 'newest' ? 'created_at' : 'created_at',
    sort_order: sortBy === 'newest' ? 'desc' : 'asc',
  })

  // Mutations
  const { mutate: doAddComment, isPending: isAdding } = useAddArticleComment(
    articleId,
    {
      onSuccess: () => {
        setCommentText('')
        setReplyingToId(null)
        setReplyText('')
        refetch()
      },
    }
  )

  const { mutate: doDeleteComment, isPending: isDeleting } =
    useDeleteArticleComment(articleId, {
      onSuccess: () => {
        setActiveMenuId(null)
        refetch()
      },
    })

  const comments = data?.comments || []
  const totalCount = data?.total ?? (comments.length || initialCount)

  const handlePostComment = (e) => {
    e.preventDefault()
    if (!commentText.trim() || isAdding) return

    doAddComment({
      text: commentText.trim(),
    })
  }

  const handlePostReply = (parentCommentId) => {
    if (!replyText.trim() || isAdding) return

    // Backend must support comment_id / parent_id on POST /user/article/comment or a dedicated reply endpoint
    doAddComment({
      text: replyText.trim(),
      comment_id: parentCommentId,
    })
  }

  const handleDelete = (commentId) => {
    if (isDeleting) return
    doDeleteComment({
      comment_id: commentId,
    })
  }

  // Current user initial
  const currentInitial = (
    currentUser?.full_name?.trim()?.charAt(0) ||
    currentUser?.email?.trim()?.charAt(0) ||
    'T'
  ).toUpperCase()

  return (
    <section
      id="comments-section"
      className="bg-[#fbfbfb] border border-[#e5e5e5] rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 mt-12 sm:mt-16 font-sans shadow-2xs"
    >
      {/* Header: Title, Count & Sort Control */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
            Comments
          </h2>
          <span className="text-lg sm:text-xl font-normal text-[#737373]">
            ({totalCount})
          </span>
        </div>

        {/* Sort by Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-[#525252] font-medium hidden sm:inline">
            Sort by
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-[#e5e5e5] rounded-xl px-3 sm:px-3.5 py-1.5 pr-8 text-xs sm:text-sm font-medium text-[#111111] shadow-2xs hover:border-[#cccccc] focus:outline-none focus:ring-1 focus:ring-[#2d5356] cursor-pointer transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Share your thoughts Box (Card) */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4 sm:p-5 mb-6 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#dce9e2] text-[#2d5356] font-semibold text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {currentInitial}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#000000] leading-snug">
              Share your thoughts
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mt-0.5 leading-snug">
              Join the discussion and add your perspective.
            </p>
          </div>
        </div>

        <form onSubmit={handlePostComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            disabled={!isAuthenticated || isAdding}
            className="w-full rounded-xl border border-[#e5e5e5] px-3.5 py-2.5 text-sm sm:text-base text-[#000000] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#2d5356] focus:ring-1 focus:ring-[#2d5356] resize-none transition-all disabled:bg-[#f6f6f6] disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between mt-2.5 pt-0.5">
            {!isAuthenticated ? (
              <p className="text-xs text-[#737373]">
                Please{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#2d5356] underline underline-offset-2 hover:opacity-80"
                >
                  log in
                </Link>{' '}
                to leave a comment.
              </p>
            ) : (
              <span className="text-xs text-[#a1a1aa]">
                {commentText.trim().length > 0
                  ? `${commentText.trim().length} characters`
                  : ''}
              </span>
            )}

            <button
              type="submit"
              disabled={!isAuthenticated || !commentText.trim() || isAdding}
              className="ml-auto inline-flex items-center gap-2 bg-[#162a28] hover:bg-[#223f41] active:bg-[#0f1d1b] text-white text-[16px] font-medium px-4.5 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isAdding && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
              <span>Post Comment</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-6 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4 py-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="py-8 text-center text-sm text-[#b42318] bg-red-50/60 rounded-xl border border-red-200/60 p-4 my-4">
          <p>
            {error?.data?.message ||
              error?.message ||
              'Unable to load comments. Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-xs font-semibold underline cursor-pointer text-[#2d5356]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && comments.length === 0 && (
        <div className="py-12 text-center text-[#737373] space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#2d5356]/10 text-[#2d5356] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="font-medium text-sm text-[#111111]">No comments yet</p>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Be the first to share your perspective on this article.
          </p>
        </div>
      )}

      {/* Comments List */}
      {!isLoading && !isError && comments.length > 0 && (
        <div className="space-y-1">
          {comments.map((comment) => {
            const commentId = comment.id || comment._id || comment.comment_id
            const author =
              comment.author_name ||
              comment.user_name ||
              comment.user?.full_name ||
              comment.full_name ||
              'Reader'
            const initial = author.trim().charAt(0).toUpperCase() || 'R'
            const avatarColorClass = getAvatarColors(author)
            const commentBody =
              comment.text || comment.comment || comment.content || ''
            const timeAgo = formatRelativeTime(
              comment.created_at || comment.createdAt
            )
            const likes = comment.likes ?? comment.likes_count ?? 0
            const isMenuOpen = activeMenuId === commentId
            const isReplying = replyingToId === commentId

            return (
              <div
                key={commentId}
                className="py-5 border-t border-[#ededed] first:border-t-0 flex items-start gap-3.5 sm:gap-4 transition-colors"
              >
                {/* Author Avatar Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 shadow-2xs select-none ${avatarColorClass}`}
                >
                  {initial}
                </div>

                {/* Comment Body Column */}
                <div className="flex-1 min-w-0">
                  {/* Author Name, Timestamp & 3-dots Menu */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-wrap gap-x-2">
                      <span className="font-bold text-sm sm:text-[15px] text-[#000000] leading-snug">
                        {author}
                      </span>
                      <span className="text-xs text-[#737373] font-normal">
                        {timeAgo}
                      </span>
                    </div>

                    {/* Three-dots menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : commentId)
                        }
                        className="p-1 rounded-md text-[#737373] hover:text-[#000000] hover:bg-black/5 transition-colors cursor-pointer"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown with Delete */}
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-[#e5e5e5] rounded-xl shadow-md py-1 z-30 font-sans">
                          <button
                            type="button"
                            onClick={() => handleDelete(commentId)}
                            disabled={isDeleting}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#b42318] hover:bg-[#fee4e2]/40 transition-colors text-left cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Text Content */}
                  <p className="text-sm sm:text-[15px] text-[#262626] leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
                    {commentBody}
                  </p>

                  {/* Actions: Likes & Reply */}
                  <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-[#525252]">
                    {/* Heart Like */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#b42318] transition-colors cursor-pointer group"
                      aria-label="Like comment"
                    >
                      <Heart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">{likes}</span>
                    </button>

                    <span className="text-[#e5e5e5] select-none">|</span>

                    {/* Reply Action */}
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingToId(isReplying ? null : commentId)
                      }
                      className="text-xs font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
                    >
                      {isReplying ? 'Cancel' : 'Reply'}
                    </button>
                  </div>

                  {/* Inline Reply Form */}
                  {isReplying && (
                    <div className="mt-3.5 p-3.5 bg-white border border-[#e5e5e5] rounded-xl shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#2d5356]">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Replying to {author}</span>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full rounded-lg border border-[#e5e5e5] p-2.5 text-xs sm:text-sm text-[#000000] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#2d5356] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingToId(null)}
                          className="px-3 py-1.5 text-xs text-[#737373] hover:text-[#000000] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePostReply(commentId)}
                          disabled={!replyText.trim() || isAdding}
                          className="px-4 py-1.5 bg-[#2d5356] hover:bg-[#223f41] text-white text-xs font-medium rounded-lg cursor-pointer disabled:opacity-50"
                        >
                          {isAdding ? 'Posting...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render Replies (if any) */}
                  {comment.replies &&
                    Array.isArray(comment.replies) &&
                    comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-[#e5e5e5] space-y-3">
                        {comment.replies.map((reply) => {
                          const replyAuthor =
                            reply.author_name ||
                            reply.user_name ||
                            reply.user?.full_name ||
                            'Reader'
                          const replyInitial = replyAuthor
                            .trim()
                            .charAt(0)
                            .toUpperCase()
                          return (
                            <div
                              key={reply.id || reply._id}
                              className="flex items-start gap-3 text-xs sm:text-sm"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 select-none ${getAvatarColors(
                                  replyAuthor
                                )}`}
                              >
                                {replyInitial}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#000000]">
                                    {replyAuthor}
                                  </span>
                                  <span className="text-[#737373] text-[11px]">
                                    {formatRelativeTime(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-[#262626] mt-0.5">
                                  {reply.text || reply.comment || reply.content || ''}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
