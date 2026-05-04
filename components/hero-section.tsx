'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const HERO_NEWS = [
  {
    id: 1,
    title: "សន្ទស្សន៍សេដ្ឋកិច្ចកម្ពុជារំពឹងថានឹងកើនឡើង ៦.៦% ក្នុងឆ្នាំ ២០២៦",
    date: new Date(Date.now() - 86400000), // Yesterday
    category: "សេដ្ឋកិច្ច",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
  },
  {
    id: 2,
    title: "បច្ចេកវិទ្យា AI ថ្មីជួយដល់អាជីវកម្មខ្នាតតូចក្នុងការបង្កើនផលិតភាព",
    date: new Date(Date.now() - 86400000), // Yesterday
    category: "បច្ចេកវិទ្យា",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
  },
  {
    id: 3,
    title: "ការនាំចេញកសិផលខ្មែរទៅកាន់ទីផ្សារអន្តរជាតិមានការកើនឡើងគួរឱ្យកត់សម្គាល់",
    date: new Date(Date.now() - 86400000), // Yesterday
    category: "កសិកម្ម",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
  }
]

const GRID_NEWS = [
  {
    id: 4,
    title: "គន្លឹះជោគជ័យសម្រាប់សហគ្រិនថ្មីថ្មោង",
    date: new Date(),
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
  },
  {
    id: 5,
    title: "ធនាគារកណ្តាលប្រកាសពីគោលនយោបាយរូបិយវត្ថុថ្មី",
    date: new Date(),
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=80"
  },
  {
    id: 6,
    title: "ពិព័រណ៍បច្ចេកវិទ្យាឌីជីថលឆ្នាំ ២០២៦ ចាប់ផ្តើមហើយ",
    date: new Date(),
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80"
  },
  {
    id: 7,
    title: "ការកើនឡើងនៃសហគ្រិនភាពក្នុងស្រុក",
    date: new Date(),
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80"
  }
]

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-2 pb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT 50% - CAROUSEL */}
        <div className="w-full lg:w-1/2">
          <Carousel className="w-full h-full group" opts={{ loop: true }}>
            <CarouselContent>
              {HERO_NEWS.map((news) => (
                <CarouselItem key={news.id}>
                  <Link href={`/news/${news.id}`}>
                    <Card className="border-none overflow-hidden h-[300px] md:h-[400px] relative cursor-pointer rounded-md">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Badge className="mb-3 bg-primary hover:bg-primary/90 text-white border-none">
                        {news.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-medium leading-tight mb-2 line-clamp-2">
                        {news.title}
                      </h2>
                      <div className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Clock className="size-3.5" />
                        <span>១ ថ្ងៃមុន</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* RIGHT 50% - GRID */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 h-[300px] md:h-[400px]">
          {GRID_NEWS.map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} className="block h-full">
              <Card className="overflow-hidden relative group border-none h-full cursor-pointer rounded-md">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="text-sm md:text-base font-medium leading-snug line-clamp-2 mb-1">
                  {news.title}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <Clock className="size-3" />
                  <span>១ ថ្ងៃមុន</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      </div>
    </section>
  )
}
