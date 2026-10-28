import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroStats } from './HeroStats'

export function HeroContent() {
  const handleExploreClick = () => {
    const feed = document.getElementById('articles-feed')
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col space-y-6 sm:space-y-7">
      {/* Eyebrow / Kicker */}
      <div>
        <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#2d5356]">
          Stay Informed. Stay Ahead.
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#000000] leading-[1.12] tracking-tight">
        News Today.
        <br />
        <span className="text-[#2d5356]">A Smarter</span>
        <br />
        Tomorrow.
      </h1>

      {/* Description */}
      <p className="text-[#525252] text-base sm:text-lg leading-relaxed max-w-lg">
        Discover insightful stories, explore new perspectives and test your knowledge with engaging quizzes.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="button"
          onClick={handleExploreClick}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[var(--radius-control)] bg-[#2d5356] hover:bg-[#223f41] active:bg-[#1a3234] text-white font-medium text-sm sm:text-base transition-colors duration-150 cursor-pointer shadow-sm"
        >
          <span>Explore News</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          to="/quizzes"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-[var(--radius-control)] border border-[#e5e5e5] hover:border-[#cccccc] bg-white hover:bg-[#f6f6f6] text-[#000000] font-medium text-sm sm:text-base transition-colors duration-150"
        >
          Try a Quiz
        </Link>
      </div>

      {/* Stats Divider & Row */}
      <div className="pt-2">
        <HeroStats />
      </div>
    </div>
  )
}
