'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"

import { PostWithRelations } from "@/types/prisma"

interface HeroSectionProps {
  heroNews: PostWithRelations[]
  gridNews: PostWithRelations[]
}

export function HeroSection({ heroNews = [], gridNews = [] }: HeroSectionProps) {
  // If no data, show nothing or placeholder
  if (heroNews.length === 0 && gridNews.length === 0) return null

  return (
    <section className="container mx-auto px-4 pt-2 pb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT - CAROUSEL (Full width if no grid news) */}
        <div className={cn("w-full", gridNews.length > 0 ? "lg:w-1/2" : "lg:w-full")}>
          <Carousel 
            className="w-full h-full group" 
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent>
              {heroNews.map((news) => (
                <CarouselItem key={news.id}>
                  <Link href={`/news/${news.slug}`}>
                    <Card className="border-none overflow-hidden h-[300px] md:h-[400px] relative cursor-pointer rounded-md">
                    <Image
                      src={news.featuredImage || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"}
                      alt={news.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 100vw"
                      className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                    <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">

                      <h2 className="text-2xl md:text-3xl font-medium leading-tight mb-2 line-clamp-2">
                        {news.title}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          <span suppressHydrationWarning>{new Date(news.createdAt).toLocaleDateString('km-KH')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* RIGHT - GRID (Only show if news exists) */}
        {gridNews.length > 0 && (
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 h-[300px] md:h-[400px]">
            {gridNews.map((news) => (
              <Link key={news.id} href={`/news/${news.slug}`} className="block h-full">
                <Card className="overflow-hidden relative group border-none h-full cursor-pointer rounded-md">
                <Image
                  src={news.featuredImage || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="text-sm md:text-base font-medium leading-snug line-clamp-2 mb-1">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span suppressHydrationWarning>{new Date(news.createdAt).toLocaleDateString('km-KH')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}
