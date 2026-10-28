import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { useSavedArticles } from '../hooks/useSavedArticles'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleSkeleton } from '../components/ArticleSkeleton'
import { ErrorState } from '../../../components/ui/ErrorState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Button } from '../../../components/ui/Button'

export function SavedArticlesPage() {
  const { data: articles, isLoading, isError, error, refetch } = useSavedArticles()

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#2d5356] uppercase mb-1">
          READING LIST
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#000000] tracking-tight">
            Saved Articles
          </h1>
          {!isLoading && !isError && Array.isArray(articles) && articles.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2d5356]/10 text-[#2d5356] border border-[#2d5356]/20">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </span>
          )}
        </div>
        <p className="text-sm text-[#525252] mt-2 max-w-2xl">
          Articles and stories you've bookmarked to read anytime.
        </p>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <ArticleSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Unable to load saved articles"
          message={
            error?.data?.message ||
            error?.message ||
            'We had trouble fetching your saved reading list. Please try again.'
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!articles || articles.length === 0) && (
        <EmptyState
          icon={Bookmark}
          title="No saved articles yet"
          description="You haven't bookmarked any articles yet. Explore stories and save your favorites to read anytime."
          action={
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Explore Articles
              </Button>
            </Link>
          }
        />
      )}

      {/* Articles Grid */}
      {!isLoading && !isError && Array.isArray(articles) && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id || article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
