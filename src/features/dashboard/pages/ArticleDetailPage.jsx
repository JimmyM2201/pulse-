import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Clock,
  User,
  Heart,
  MessageSquare,
  Bookmark,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useArticleDetails } from '../hooks/useArticleDetails'
import {
  useToggleArticleLike,
  useToggleArticleSave,
} from '../hooks/useArticleInteractions'
import { Skeleton } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/ErrorState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Button } from '../../../components/ui/Button'
import { DateDisplay } from '../../../components/ui/DateDisplay'
import { CommentsSection } from '../components/CommentsSection'


function formatReadTime(time) {
  if (!time) return '6 min read'
  const str = String(time).trim()
  if (str.toLowerCase().includes('read')) return str
  if (str.toLowerCase().includes('min')) return `${str} read`
  return `${str} min read`
}

export function ArticleDetailPage() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const commentsSectionRef = useRef(null)

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const { data: article, isLoading, isError, error, refetch } = useArticleDetails(articleId)
  const [imgError, setImgError] = useState(false)

  // Interactive state for Like & Save
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [savesCount, setSavesCount] = useState(0)

  // Initialize and sync with article data
  useEffect(() => {
    if (article) {
      const backendIsLiked =
        article.is_liked ?? article.isLiked ?? article.user_liked ?? article.has_liked
      if (backendIsLiked !== undefined) {
        setIsLiked(Boolean(backendIsLiked))
      }
      if (typeof article.like === 'number') {
        setLikesCount(article.like)
      }

      const backendIsSaved =
        article.is_saved ?? article.isSaved ?? article.user_saved ?? article.has_saved
      if (backendIsSaved !== undefined) {
        setIsSaved(Boolean(backendIsSaved))
      }
      if (typeof article.save === 'number') {
        setSavesCount(article.save)
      }
    }
  }, [article])

  const { mutate: toggleLike, isPending: isLikePending } = useToggleArticleLike()
  const { mutate: toggleSave, isPending: isSavePending } = useToggleArticleSave()

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (isLikePending || !articleId) return

    const previousLiked = isLiked
    const nextLiked = !previousLiked

    // Optimistic UI update
    setIsLiked(nextLiked)
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))

    toggleLike(articleId, {
      onSuccess: (res) => {
        const resLiked =
          res?.is_liked ?? res?.liked ?? res?.data?.is_liked ?? res?.data?.liked
        if (resLiked !== undefined) {
          setIsLiked(Boolean(resLiked))
        }
      },
      onError: () => {
        // Rollback state on error
        setIsLiked(previousLiked)
        setLikesCount((prev) => (previousLiked ? prev + 1 : Math.max(0, prev - 1)))
      },
    })
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (isSavePending || !articleId) return

    const previousSaved = isSaved
    const nextSaved = !previousSaved

    // Optimistic UI update
    setIsSaved(nextSaved)
    setSavesCount((prev) => (nextSaved ? prev + 1 : Math.max(0, prev - 1)))

    toggleSave(articleId, {
      onSuccess: (res) => {
        const resSaved =
          res?.is_saved ?? res?.saved ?? res?.data?.is_saved ?? res?.data?.saved
        if (resSaved !== undefined) {
          setIsSaved(Boolean(resSaved))
        }
      },
      onError: () => {
        // Rollback state on error
        setIsSaved(previousSaved)
        setSavesCount((prev) => (previousSaved ? prev + 1 : Math.max(0, prev - 1)))
      },
    })
  }

  const hasImage = Boolean(article?.image && !imgError)
  const commentsCount = article?.comments ?? 0
  const topic = article?.topics?.[0]?.topic_name

  return (
    <article className="max-w-5xl mx-auto font-sans pb-16">
      {/* Top Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm text-[#737373]">
        <Link to="/dashboard" className="hover:text-[#000000] transition-colors shrink-0">
          Home
        </Link>
        {topic && (
          <>
            <span className="text-[#8e8e93]">›</span>
            <Link to="/dashboard" className="hover:text-[#000000] transition-colors shrink-0">
              {topic}
            </Link>
          </>
        )}
        <span className="text-[#8e8e93]">›</span>
        <span className="text-[#737373] truncate">
          {article?.title || 'Article'}
        </span>
      </nav>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-12 w-4/5 rounded-lg" />
          <Skeleton className="h-12 w-3/5 rounded-lg" />
          <Skeleton className="h-5 w-full rounded-md mt-2" />
          <div className="flex items-center gap-4 py-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="aspect-[16/9] w-full rounded-2xl mt-4" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load article"
          message={
            error?.data?.message ||
            error?.message ||
            'We were unable to load this article. It may have been deactivated or removed.'
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Empty / Not Found State */}
      {!isLoading && !isError && !article && (
        <EmptyState
          icon={BookOpen}
          title="Article not found"
          description="The requested article does not exist or is no longer active."
          action={
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          }
        />
      )}

      {/* Article Detail View */}
      {!isLoading && !isError && article && (
        <div className="space-y-8">
          {/* Article Header */}
          <header className="space-y-4">
            {/* Topic Kicker */}
            {topic && (
              <div>
                <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#2d5356]">
                  {topic}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.15] text-[#000000] w-full">
              {article.title || 'Untitled Article'}
            </h1>

            {/* Subtitle / Lead Paragraph */}
            {article.subtitle && (
              <p className="text-base sm:text-lg lg:text-[19px] text-[#525252] leading-relaxed pt-1">
                {article.subtitle}
              </p>
            )}

            {/* Author and Engagement Meta Bar */}
            <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Side: Author, Date, Read Time */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Author Avatar & Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f4f2] border border-[#2d5356]/20 flex items-center justify-center text-[#2d5356] font-bold text-sm shrink-0">
                    {article.author_name ? article.author_name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-[#2d5356]" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#000000] leading-snug">
                      {article.author_name || 'Emily Carter'}
                    </p>
                    <p className="text-xs text-[#737373] leading-none mt-0.5">
                      {article.author_role || 'Science Correspondent'}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-[#e5e5e5]" />

                {/* Publication Date */}
                <DateDisplay date={article?.created_at} showIcon fallback="Apr 10, 2024" />

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-[#e5e5e5]" />

                {/* Read Time */}
                <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                  <Clock className="w-3.5 h-3.5 text-[#737373]" />
                  <span>{formatReadTime(article.read_time)}</span>
                </div>
              </div>

              {/* Right Side: Like, Comments & Save Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-center">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={isLikePending}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border ${
                    isLiked
                      ? 'bg-red-50 text-[#b42318] border-red-200 shadow-xs'
                      : 'bg-white text-[#525252] border-[#e5e5e5] hover:text-[#b42318] hover:border-red-200 hover:bg-red-50/50'
                  } ${isLikePending ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-label={isLiked ? 'Unlike article' : 'Like article'}
                >
                  <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? 'fill-[#b42318] text-[#b42318]' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                {/* Comments (Smooth Scroll to Comments Section) */}
                <button
                  type="button"
                  onClick={scrollToComments}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#525252] border border-[#e5e5e5] hover:text-[#2d5356] hover:border-[#2d5356]/40 hover:bg-[#f6f6f6] transition-all cursor-pointer shadow-2xs"
                  aria-label="Jump to comments"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{commentsCount}</span>
                </button>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSavePending}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border ${
                    isSaved
                      ? 'bg-amber-50 text-[#d09724] border-amber-200 shadow-xs'
                      : 'bg-white text-[#525252] border-[#e5e5e5] hover:text-[#d09724] hover:border-amber-200 hover:bg-amber-50/50'
                  } ${isSavePending ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-label={isSaved ? 'Unsave article' : 'Save article'}
                >
                  <Bookmark className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isSaved ? 'fill-[#d09724] text-[#d09724]' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Full-Width Featured Cover Image */}
          {hasImage && (
            <div className="aspect-[16/9] sm:aspect-[21/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e5e5e5] bg-[#f6f6f6] shadow-xs">
              <img
                src={article.image}
                alt={article.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Insights Callout (if present) */}
          {article.key_insights && typeof article.key_insights === 'string' && (
            <div className="p-5 sm:p-6 bg-[#2d5356]/5 border border-[#2d5356]/20 rounded-2xl flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-xs border border-[#2d5356]/20 text-[#d09724]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d5356] block mb-1">
                  Key Insight
                </span>
                <p className="text-sm sm:text-base text-[#000000] leading-relaxed">
                  {article.key_insights}
                </p>
              </div>
            </div>
          )}

          {/* Editorial Quote Box (Styled matching reference image) */}
          {article.quote && typeof article.quote === 'string' && (
            <blockquote className="my-8 p-6 sm:p-8 bg-[#f2f7f4] border-l-4 border-[#2d5356] rounded-r-2xl shadow-xs">
              <div className="flex items-start gap-3.5">
                <span className="font-serif text-4xl sm:text-5xl text-[#2d5356] leading-none select-none shrink-0">
                  “
                </span>
                <div className="flex-1">
                  <p className="font-serif italic text-base sm:text-lg text-[#000000] leading-relaxed">
                    "{article.quote}"
                  </p>
                  {article.quote_author && (
                    <div className="mt-3">
                      <p className="font-bold text-sm text-[#000000]">
                        {article.quote_author}
                      </p>
                      {article.quote_role && (
                        <p className="text-xs text-[#737373]">
                          {article.quote_role}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </blockquote>
          )}

          {/* Main Article Body (HTML Content) */}
          {article.content ? (
            <div
              className="article-body font-sans text-base sm:text-lg leading-relaxed text-[#262626] pt-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="py-8 text-center text-[#737373] text-sm">
              No additional content body available for this article.
            </div>
          )}

          {/* Comments Section */}
          <div ref={commentsSectionRef}>
            <CommentsSection
              articleId={articleId}
              initialCount={commentsCount}
            />
          </div>
        </div>
      )}
    </article>
  )
}
