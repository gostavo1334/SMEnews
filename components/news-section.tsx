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

const LATEST_NEWS = [
  {
    id: 1,
    title: "វិស័យទេសចរណ៍នៅកម្ពុជារំពឹងទទួលបានភ្ញៀវទេសចរអន្តរជាតិកាន់តែច្រើនក្នុងឆ្នាំ ២០២៦",
    category: "ទេសចរណ៍",
    date: "១០ នាទីមុន",
    image: "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
    author: { name: "ចាន់ ធីតា", avatar: "/avatars/chan.jpg" },
    summary: "រដ្ឋាភិបាលកម្ពុជាបានដាក់ចេញនូវយុទ្ធសាស្ត្រថ្មីៗជាច្រើនដើម្បីទាក់ទាញភ្ញៀវទេសចរអន្តរជាតិឱ្យមកកម្សាន្តនៅតំបន់ប្រវត្តិសាស្ត្រ និងតំបន់ធម្មជាតិ..."
  },
  {
    id: 2,
    title: "ការនាំចេញកសិផលរបស់កម្ពុជាទៅកាន់ទីផ្សារអន្តរជាតិមានការកើនឡើងគួរឱ្យកត់សម្គាល់",
    category: "កសិកម្ម",
    date: "៤៥ នាទីមុន",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
    author: { name: "ស៊ុយ ហេង", avatar: "/avatars/suy.jpg" },
    summary: "កសិករខ្មែរបានចាប់ផ្តើមប្រើប្រាស់បច្ចេកវិទ្យាទំនើបៗក្នុងការដាំដុះ ដែលធ្វើឱ្យគុណភាពកសិផលស្របតាមស្តង់ដារអន្តរជាតិ..."
  },
  {
    id: 3,
    title: "ការវិនិយោគក្នុងវិស័យបច្ចេកវិទ្យាហិរញ្ញវត្ថុ (FinTech) កំពុងមានសន្ទុះខ្លាំងនៅកម្ពុជា",
    category: "សេដ្ឋកិច្ច",
    date: "២ ម៉ោងមុន",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    author: { name: "លី ហួរ", avatar: "/avatars/ly.jpg" },
    summary: "ធនាគារជាតិបានជំរុញឱ្យមានការប្រើប្រាស់ប្រព័ន្ធទូទាត់ប្រាក់តាមឌីជីថលកាន់តែទូលំទូលាយ ដើម្បីសម្រួលដល់ការធ្វើអាជីវកម្ម..."
  },
  {
    id: 4,
    title: "សហគ្រាសធុនតូច និងមធ្យម (SMEs) ទទួលបានការគាំទ្រផ្នែកបច្ចេកទេសកាន់តែច្រើន",
    category: "អាជីវកម្ម",
    date: "៥ ម៉ោងមុន",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    author: { name: "សុខា ម៉ានី", avatar: "/avatars/sokha.jpg" },
    summary: "តាមរយៈការបណ្តុះបណ្តាល និងការផ្តល់ប្រឹក្សាយោបល់ SMEs អាចពង្រឹងសមត្ថភាពប្រកួតប្រជែងរបស់ខ្លួននៅលើទីផ្សារ..."
  }
]

const POPULAR_NEWS = [
  {
    id: 5,
    title: "របកគំហើញថ្មីនៃបច្ចេកវិទ្យាកសិកម្មនៅកម្ពុជា",
    category: "កសិកម្ម",
    date: "២ ម៉ោងមុន",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80"
  },
  {
    id: 6,
    title: "ឱកាសវិនិយោគក្នុងវិស័យទេសចរណ៍បៃតង",
    category: "សេដ្ឋកិច្ច",
    date: "៥ ម៉ោងមុន",
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=80"
  },
  {
    id: 7,
    title: "សហគ្រិនវ័យក្មេងខ្មែរឈ្នះពានរង្វាន់អាស៊ី",
    category: "អាជីវកម្ម",
    date: "១ ថ្ងៃមុន",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
  },
  {
    id: 8,
    title: "តម្លៃអចលនទ្រព្យនៅតំបន់ជាយក្រុងកំពុងកើនឡើង",
    category: "អចលនទ្រព្យ",
    date: "២ ថ្ងៃមុន",
    image: "https://images.unsplash.com/photo-1560514481-be691399e284?w=400&q=80"
  },
  {
    id: 9,
    title: "ការប្រើប្រាស់ថាមពលកកើតឡើងវិញក្នុងវិស័យឧស្សាហកម្ម",
    category: "បច្ចេកវិទ្យា",
    date: "៣ ថ្ងៃមុន",
    image: "https://images.unsplash.com/photo-1509391366360-fe5ab4445195?w=400&q=80"
  }
]

export function NewsSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN - LATEST NEWS */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">ព័ត៌មានថ្មីៗ</h2>
            <div className="text-sm text-primary hover:underline cursor-pointer font-medium">មើលទាំងអស់</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LATEST_NEWS.map((news) => (
              <NewsCard key={news.id} news={news} variant="large" />
            ))}
          </div>

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
              {POPULAR_NEWS.map((news) => (
                <NewsCard key={news.id} news={news} variant="small" />
              ))}
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
