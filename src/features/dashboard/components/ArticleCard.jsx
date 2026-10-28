import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { DateDisplay } from '../../../components/ui/DateDisplay'

export function ArticleCard({ article }) {
  const [imgError, setImgError] = useState(false)

  const articleId = article.id || article._id
  const detailUrl = `/articles/${articleId}`

  // Format read time: e.g. "5 min read"
  const formatReadTime = (time) => {
    if (!time) return '4 min read'
    const str = String(time).trim()
    if (str.toLowerCase().includes('read')) return str
    if (str.toLowerCase().includes('min')) return `${str} read`
    return `${str} min read`
  }

  const hasImage = Boolean(article.image && !imgError)
  const topic = article.topics?.[0]?.topic_name
  const excerpt = article.subtitle || article.excerpt || article.summary || article.description

  return (
    <article className="group bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#2d5356]/40 transition-all duration-200 flex flex-col justify-between">
      <Link to={detailUrl} className="flex flex-col flex-1 block">
        {/* Photo fits entire card width at top directly without any inner padding div */}
        {hasImage ? (
          <img
            src={article.image}
            alt={article.title || 'Article cover'}
            onError={() => setImgError(true)}
            className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[16/10] bg-[#f4f4f5] flex flex-col items-center justify-center text-[#2d5356]/70">
            <BookOpen className="w-8 h-8 text-[#2d5356] mb-1.5" />
            {topic && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2d5356]/80">
                {topic}
              </span>
            )}
          </div>
        )}

        {/* Content body with padding */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Category Badge & Read Time Row */}
            <div className="flex items-center justify-between">
              {topic ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f4f4f5] text-[#18181b]">
                  {topic}
                </span>
              ) : (
                <div />
              )}
              <span className="text-xs font-medium text-[#71717a]">
                {formatReadTime(article.read_time)}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-3 font-serif text-lg sm:text-[19px] font-bold text-[#000000] leading-snug tracking-tight line-clamp-2 group-hover:text-[#2d5356] transition-colors">
              {article.title || 'Untitled Article'}
            </h3>

            {/* Excerpt / Summary */}
            {excerpt && (
              <p className="mt-2 text-sm text-[#71717a] line-clamp-2 leading-relaxed">
                {excerpt}
              </p>
            )}
          </div>

          {/* Publication Date */}
          <div className="mt-4 pt-1">
            <DateDisplay
              date={article.created_at || article.published_at}
              className="text-xs font-medium text-[#71717a] block"
            />
          </div>
        </div>
      </Link>
    </article>
  )
}
