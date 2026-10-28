import { HeroContent } from './HeroContent'
import { HeroFeaturedCard } from './HeroFeaturedCard'

export function HeroSection() {
  return (
    <section className="w-full pt-2 pb-6 sm:pb-10 border-b border-[#e5e5e5]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 xl:col-span-6">
          <HeroContent />
        </div>
        <div className="lg:col-span-6 xl:col-span-6">
          <HeroFeaturedCard />
        </div>
      </div>
    </section>
  )
}
