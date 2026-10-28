export function HeroStats() {
  const stats = [
    { value: '10K+', label: 'Articles' },
    { value: '20+', label: 'Topics' },
    { value: '5K+', label: 'Active Learners' },
  ]

  return (
    <div className="flex items-center gap-5 sm:gap-7 pt-4">
      {stats.map((item, index) => (
        <div key={item.label} className="flex items-center">
          <div>
            <span className="font-sans text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight block">
              {item.value}
            </span>
            <span className="text-xs sm:text-sm text-[#737373] mt-0.5 block">
              {item.label}
            </span>
          </div>

          {index < stats.length - 1 && (
            <div className="w-px h-9 bg-[#e5e5e5] ml-5 sm:ml-7" />
          )}
        </div>
      ))}
    </div>
  )
}
