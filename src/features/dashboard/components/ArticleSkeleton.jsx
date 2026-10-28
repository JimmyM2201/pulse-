import { Skeleton } from '../../../components/ui/Skeleton'

export function ArticleSkeleton() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
      {/* Flush Image Skeleton without inner padding div */}
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      {/* Content body with padding */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Read Time Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          {/* Title */}
          <Skeleton className="h-6 w-4/5 rounded-md mt-3" />
          <Skeleton className="h-5 w-2/3 rounded-md mt-1.5" />

          {/* Excerpt */}
          <Skeleton className="h-4 w-full rounded-md mt-2.5" />
          <Skeleton className="h-4 w-5/6 rounded-md mt-1.5" />
        </div>

        {/* Date */}
        <Skeleton className="h-3.5 w-20 rounded-md mt-4" />
      </div>
    </div>
  )
}
