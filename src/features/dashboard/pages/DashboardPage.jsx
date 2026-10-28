import { useArticles } from '../hooks/useArticles'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleSkeleton } from '../components/ArticleSkeleton'
import { HeroSection } from '../components/hero/HeroSection'
import { QuizPromoBanner } from '../components/QuizPromoBanner'
import { ErrorState } from '../../../components/ui/ErrorState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Newspaper } from 'lucide-react'

export function DashboardPage() {
  const { data: articles, isLoading, isError, error, refetch } = useArticles()

  return (
    <div className="w-full space-y-12 sm:space-y-16 font-sans">
      {/* Static Hero Section */}
      <HeroSection />

      {/* Articles Feed */}
      <div id="articles-feed" className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
            Latest Stories
          </h2>
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
            title="Unable to load articles"
            message={
              error?.data?.message ||
              error?.message ||
              'We had trouble fetching the latest articles. Please try again.'
            }
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!articles || articles.length === 0) && (
          <EmptyState
            icon={Newspaper}
            title="No articles available"
            description="There are no active articles published right now. Check back soon for updates."
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

      {/* Quiz Promotion Banner */}
      <QuizPromoBanner />
    </div>
  )
}

