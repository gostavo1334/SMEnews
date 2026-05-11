'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Always show for testing or if more than 1 page

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost") // Base URL is relative
    url.searchParams.set("page", page.toString())
    return `${url.pathname}${url.search}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(p => 
    p === 1 || 
    p === totalPages || 
    (p >= currentPage - 1 && p <= currentPage + 1)
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-4">
      <Button 
        variant="outline" 
        size="icon" 
        disabled={currentPage === 1} 
        className="size-9"
        render={<Link href={getPageUrl(Math.max(1, currentPage - 1))} />}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {visiblePages.map((page, i) => {
        const showEllipsis = i > 0 && page - visiblePages[i - 1] > 1
        
        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-muted-foreground">...</span>}
            <Button 
              variant={currentPage === page ? "default" : "outline"} 
              className={cn(
                "size-9 p-0",
                currentPage === page ? "bg-primary text-white" : ""
              )}
              render={<Link href={getPageUrl(page)} />}
            >
              {page}
            </Button>
          </div>
        )
      })}

      <Button 
        variant="outline" 
        size="icon" 
        disabled={currentPage === totalPages} 
        className="size-9"
        render={<Link href={getPageUrl(Math.min(totalPages, currentPage + 1))} />}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
