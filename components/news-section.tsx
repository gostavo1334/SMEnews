'use client'

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { NewsCard } from "@/components/news-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface NewsSectionProps {
  latestPosts: any[]
  popularPosts: any[]
}

export function NewsSection({ latestPosts = [], popularPosts = [] }: NewsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN - LATEST NEWS */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">ព័ត៌មានថ្មីៗ</h2>
            <div className="text-sm text-primary hover:underline cursor-pointer font-medium">មើលទាំងអស់</div>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestPosts.map((post) => (
                <NewsCard 
                  key={post.id} 
                  news={{
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    category: post.category?.name || "General",
                    date: new Date(post.createdAt).toLocaleDateString('km-KH'),
                    image: post.featuredImage || "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
                    author: { name: post.author?.name || "Anonymous", avatar: post.author?.image || "/avatars/default.jpg" },
                    summary: post.metaDesc ?? undefined
                  }} 
                  variant="large" 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">មិនទាន់មានព័ត៌មានថ្មីៗនៅឡើយទេ</p>
            </div>
          )}

          {/* PAGINATION */}
          <div className="mt-12 py-4 border-t">
            <Pagination>
              <PaginationContent className="gap-1 sm:gap-2">
                <PaginationItem>
                  <PaginationPrevious href="#" className="rounded-md hover:bg-accent text-xs sm:text-sm px-2 sm:px-4" />
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-block">
                  <PaginationLink href="#" isActive className="rounded-md bg-primary text-white border-primary">១</PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-block">
                  <PaginationLink href="#" className="rounded-md hover:bg-accent">២</PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-block">
                  <PaginationLink href="#" className="rounded-md hover:bg-accent">៣</PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-block">
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="rounded-md hover:bg-accent text-xs sm:text-sm px-2 sm:px-4" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="lg:w-1/3 space-y-8">
          {/* POPULAR NEWS */}
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">ព័ត៌មានពេញនិយម</h2>
            <div className="space-y-3">
              {popularPosts.length > 0 ? (
                popularPosts.map((post) => (
                  <NewsCard 
                    key={post.id} 
                    news={{
                      id: post.id,
                      slug: post.slug,
                      title: post.title,
                      category: post.category?.name || "General",
                      date: new Date(post.createdAt).toLocaleDateString('km-KH'),
                      image: post.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
                      author: { name: post.author?.name || "អ្នកយកព័ត៌មាន", avatar: post.author?.image || "/avatars/default.jpg" },
                      summary: post.metaDesc ?? undefined
                    }} 
                    variant="small" 
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">មិនទាន់មានព័ត៌មានពេញនិយម</p>
              )}
            </div>
          </div>

          {/* VIDEO PANEL */}
          <div className="bg-card rounded-md border border-border/40 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold">វីដេអូ</h2>
            </div>
            <div className="relative aspect-video rounded-md overflow-hidden group cursor-pointer border border-border/40">
              <Image 
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" 
                alt="Video thumbnail"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="size-6 fill-current" />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="font-medium text-sm leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                កិច្ចសម្ភាសន៍ពិសេសៈ ឱកាស និងបញ្ហាប្រឈមរបស់ SMEs កម្ពុជាក្នុងយុគសម័យឌីជីថល
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
