import { Link } from 'react-router-dom'
import { ArrowRight, Atom, Globe, Laptop, Leaf } from 'lucide-react'

export function QuizPromoBanner() {
  const quizPreviews = [
    {
      title: 'Science Quiz',
      questions: '20 Questions',
      icon: Atom,
      iconColor: 'text-[#0284c7]',
      iconBg: 'bg-[#0284c7]/10',
      tilt: '-rotate-2 lg:-rotate-3',
      transform: 'hover:rotate-0 hover:-translate-y-1',
    },
    {
      title: 'World Quiz',
      questions: '25 Questions',
      icon: Globe,
      iconColor: 'text-[#16a34a]',
      iconBg: 'bg-[#16a34a]/10',
      tilt: 'rotate-3 lg:rotate-5',
      transform: 'hover:rotate-0 hover:-translate-y-1',
    },
    {
      title: 'Technology Quiz',
      questions: '20 Questions',
      icon: Laptop,
      iconColor: 'text-[#2563eb]',
      iconBg: 'bg-[#2563eb]/10',
      tilt: '-rotate-1 lg:-rotate-2',
      transform: 'hover:rotate-0 hover:-translate-y-1',
    },
    {
      title: 'Environment Quiz',
      questions: '20 Questions',
      icon: Leaf,
      iconColor: 'text-[#15803d]',
      iconBg: 'bg-[#15803d]/10',
      tilt: 'rotate-1 lg:rotate-2',
      transform: 'hover:rotate-0 hover:-translate-y-1',
    },
  ]

  return (
    <section className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#edf4f1] via-[#e4eee9] to-[#d8e6e0] border border-[#2d5356]/15 shadow-xs px-6 sm:px-8 lg:px-10 py-5 sm:py-6 lg:py-7 my-2">
      {/* Decorative Botanical Leaves on Top-Right Corner */}
      <div className="absolute -top-10 -right-10 w-48 h-48 pointer-events-none select-none opacity-85 z-0">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Leaf Stem */}
          <path d="M190 10 C160 50, 140 100, 110 180" stroke="#254a3d" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Leaf 1 (Top right) */}
          <path
            d="M175 25 C145 20, 130 45, 148 60 C165 50, 180 35, 175 25Z"
            fill="#346452"
            opacity="0.9"
          />
          <path d="M175 25 C160 40, 148 60, 148 60" stroke="#204235" strokeWidth="1" />

          {/* Leaf 2 (Upper middle) */}
          <path
            d="M155 65 C120 55, 110 85, 132 105 C150 90, 165 75, 155 65Z"
            fill="#3e7561"
            opacity="0.95"
          />
          <path d="M155 65 C140 85, 132 105, 132 105" stroke="#254a3d" strokeWidth="1" />

          {/* Leaf 3 (Right edge) */}
          <path
            d="M195 70 C165 75, 160 110, 185 125 C200 105, 205 85, 195 70Z"
            fill="#2d5848"
            opacity="0.9"
          />

          {/* Leaf 4 (Lower middle) */}
          <path
            d="M135 115 C100 110, 95 145, 120 160 C138 145, 148 130, 135 115Z"
            fill="#4b8770"
            opacity="0.85"
          />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Heading, Subtitle and CTA */}
        <div className="lg:col-span-5 space-y-3">
          {/* Kicker */}
          <div>
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#2d5356]">
              Learn &amp; Grow
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#000000] tracking-tight leading-[1.15]">
            How much do you know?
          </h2>

          {/* Subtitle */}
          <p className="text-[#525252] text-xs sm:text-sm leading-relaxed max-w-md">
            Take topic-based quizzes, challenge yourself and track your progress.
          </p>

          {/* Button */}
          <div className="pt-1">
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-[var(--radius-control)] bg-[#2d5356] hover:bg-[#223f41] active:bg-[#1a3234] text-white font-medium text-xs sm:text-sm transition-all duration-150 shadow-sm cursor-pointer hover:shadow-md"
            >
              <span>Explore Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Floating Preview Quiz Cards */}
        <div className="lg:col-span-7 relative flex items-center justify-center">
          {/* Playful Doodles / Accent Marks */}
          <div className="absolute -top-3 left-1/3 text-[#2d5356]/40 pointer-events-none select-none hidden sm:block">
            <svg width="30" height="18" viewBox="0 0 34 20" fill="none">
              <path
                d="M2 14C8 5 18 2 24 6C28 9 29 15 25 18C22 20 18 17 19 13C20 9 25 6 32 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute top-1/2 -left-4 text-[#2d5356]/40 pointer-events-none select-none hidden lg:block">
            <svg width="20" height="24" viewBox="0 0 22 28" fill="none">
              <path d="M4 6C10 8 16 12 18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 14C8 16 14 19 16 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 22C10 23 15 25 17 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* 2x2 Grid of Floating Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 w-full max-w-lg">
            {quizPreviews.map((quiz, index) => {
              const Icon = quiz.icon
              return (
                <Link
                  key={index}
                  to="/quizzes"
                  className={`bg-white rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#e5e5e5]/70 flex items-center gap-3 transition-all duration-200 cursor-pointer ${quiz.tilt} ${quiz.transform}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${quiz.iconBg} ${quiz.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title and Question Count */}
                  <div>
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-[#000000] leading-tight">
                      {quiz.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#737373] mt-0.5 font-medium">
                      {quiz.questions}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
