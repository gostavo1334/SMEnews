import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  news: {
    id: number | string
    title: string
    category: string
    date: string
    image: string
    author?: {
      name: string
      avatar?: string
    }
  }
  variant?: 'large' | 'small' | 'horizontal'
  className?: string
}

export function NewsCard({ news, variant = 'large', className }: NewsCardProps) {
  if (variant === 'horizontal' || variant === 'small') {
    return (
      <Link href={`/news/${news.id}`} className={cn("block group", className)}>
        <Card className="group cursor-pointer border border-border/40 bg-card overflow-hidden p-2 rounded-md hover:border-primary/30 transition-all duration-300">
          <div className="flex gap-3">
            <div className="relative size-20 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="space-y-1 overflow-hidden">
              <Badge className="bg-primary hover:bg-primary text-white border-none text-[9px] px-1.5 py-0 h-4 rounded-sm">
                {news.category}
              </Badge>
              <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" />
                <span>{news.date}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/news/${news.id}`} className={cn("block group h-full", className)}>
      <Card className="overflow-hidden border border-border/40 bg-card cursor-pointer flex flex-col h-full rounded-md hover:border-primary/30 transition-all duration-300 p-0 py-0">
        <div className="relative aspect-video overflow-hidden rounded-t-md">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <Badge className="bg-primary hover:bg-primary text-white border-none px-2 py-0 text-[10px] rounded-sm">
              {news.category}
            </Badge>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              <span>{news.date}</span>
            </div>
            {news.author && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground border-l pl-2 border-border/40">
                <User className="size-3" />
                <span>{news.author.name}</span>
              </div>
            )}
          </div>
          <h3 className="text-base font-normal leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {news.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
            សេចក្តីរាយការណ៍បន្ថែមអំពី {news.title}...
          </p>
        </div>
      </Card>
    </Link>
  )
}
