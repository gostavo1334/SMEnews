import { Skeleton } from "@/components/ui/skeleton"

export function HeroSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[500px]">
      {/* Main Hero Skeleton */}
      <div className="lg:col-span-8 relative rounded-md overflow-hidden bg-muted animate-pulse h-[300px] lg:h-full">
        <div className="absolute bottom-0 left-0 p-6 space-y-3 w-full bg-gradient-to-t from-black/60 to-transparent">
          <Skeleton className="h-4 w-20 bg-white/20" />
          <Skeleton className="h-8 w-3/4 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Grid News Skeleton */}
      <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="relative rounded-md overflow-hidden bg-muted animate-pulse h-[150px] lg:h-[calc(50%-0.5rem)]">
            <div className="absolute bottom-0 left-0 p-4 space-y-2 w-full bg-gradient-to-t from-black/60 to-transparent">
              <Skeleton className="h-3 w-16 bg-white/20" />
              <Skeleton className="h-5 w-full bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
