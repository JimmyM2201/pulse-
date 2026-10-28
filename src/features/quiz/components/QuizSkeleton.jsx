import { Skeleton } from '../../../components/ui/Skeleton'

export function QuizSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-md mb-3" />
        <Skeleton className="h-4 w-full rounded-md mb-2" />
        <Skeleton className="h-4 w-2/3 rounded-md mb-6" />
      </div>

      <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}
