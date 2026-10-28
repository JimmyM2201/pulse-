import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import heroLandscape from '../../../../assets/hero-landscape.jpg'

export function HeroFeaturedCard() {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-[28px] overflow-hidden shadow-md select-none group">
      {/* Background Image */}
      <img
        src={heroLandscape}
        alt="Mountain landscape with pine forest and alpine lake"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="eager"
      />

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

      {/* Card Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
        {/* Category Pill */}
        <div className="mb-2.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-white/90">
            Science
          </span>
        </div>

        {/* Featured Story Headline */}
        <h2 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-snug tracking-tight max-w-md">
          How nature is adapting to a changing climate
        </h2>

        {/* Bottom Bar: Action Arrow & Carousel Buttons */}
        <div className="flex items-center justify-between pt-4 mt-1">
          {/* Read article arrow */}
          <div className="text-white hover:text-white/80 transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous story"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 active:scale-95 text-white flex items-center justify-center transition-all duration-150 cursor-pointer backdrop-blur-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next story"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 active:scale-95 text-white flex items-center justify-center transition-all duration-150 cursor-pointer backdrop-blur-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
