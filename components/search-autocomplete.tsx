'use client'

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchPosts } from "@/app/actions/post-actions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function SearchAutocomplete() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true)
        try {
          const data = await searchPosts(query)
          setResults(data)
          setIsOpen(true)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full lg:w-auto" ref={containerRef}>
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/70 animate-spin" />
        ) : (
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/70" />
        )}
        <Input
          type="search"
          placeholder="ស្វែងរក..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-8 h-8 w-[150px] md:w-[200px] lg:w-[150px] text-xs bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:lg:w-[250px] focus:bg-white/20 transition-all outline-none"
        />
      </div>

      {/* RESULTS DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[280px] md:w-[350px] bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-lg overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              <div className="space-y-1">
                <p className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">លទ្ធផលស្វែងរក ({results.length})</p>
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                    }}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors group"
                  >
                    <div className="relative size-12 flex-shrink-0 rounded overflow-hidden border border-border/40">
                      <Image 
                        src={post.featuredImage || "/placeholder-news.jpg"} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] text-primary font-bold uppercase mb-0.5">{post.category?.name}</p>
                      <h4 className="text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(post.publishedAt).toLocaleDateString('km-KH')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm KhmerOS">រកមិនឃើញលទ្ធផលសម្រាប់ "{query}"</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
