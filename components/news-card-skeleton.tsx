import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface NewsCardSkeletonProps {
  variant?: 'large' | 'small' | 'horizontal'
  className?: string
}

export function NewsCardSkeleton({ variant = 'large', className }: NewsCardSkeletonProps) {
  if (variant === 'horizontal' || variant === 'small') {
    return (
      <Card className={cn("border border-border/40 bg-card overflow-hidden p-2 rounded-md", className)}>
        <div className="flex gap-3">
          <Skeleton className="size-20 flex-shrink-0 rounded-md" />
          <div className="space-y-2 overflow-hidden flex-grow py-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20 border-l pl-2" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden border border-border/40 bg-card flex flex-col h-full rounded-md p-0", className)}>
      <Skeleton className="relative aspect-video rounded-t-md" />
      <div className="p-3 flex flex-col flex-grow space-y-3">
        <div className="flex items-center flex-wrap gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20 border-l pl-2" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="mt-auto pt-2">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  )
}
