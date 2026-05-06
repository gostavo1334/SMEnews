import { NewsCardSkeleton } from "./news-card-skeleton"

export function NewsSectionSkeleton() {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded-md mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <NewsCardSkeleton key={i} variant="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
