'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Clock, Share2, MessageCircle, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NewsCard } from "@/components/news-card"
import { toast } from "sonner"

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
  }
]

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params.slug

  return (
    <div className="min-h-screen pb-12 relative isolate">
      {/* ACCENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-[500px] -z-10 pointer-events-none opacity-40 blur-[100px] dark:opacity-30">
        <Image
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"
          alt="Blur Background"
          fill
          className="object-cover scale-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* WRAPPER FOR SIDE ADS */}
      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-6">
        
        {/* LEFT AD PANEL */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4">
          <div className="h-[600px] sticky top-24 bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-2xl tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow max-w-[1000px] w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ARTICLE CONTENT */}
            <article className="lg:w-2/3 space-y-6">
              {/* CATEGORY & TITLE */}
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary bg-primary/10 border-none hover:bg-primary/20">
                  បច្ចេកវិទ្យា
                </Badge>
                <h1 className="text-3xl md:text-4xl font-medium leading-tight">
                  បច្ចេកវិទ្យា AI ថ្មីជួយដល់អាជីវកម្មខ្នាតតូចក្នុងការបង្កើនផលិតភាពសម្រាប់ឆ្នាំ ២០២៦
                </h1>
                
                <div className="flex items-center justify-between py-2 border-y border-border/40">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span>០៤ ឧសភា ២០២៦</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="size-4" />
                      <span>១២ មតិ</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-full"
                      onClick={() => toast.success("អត្ថបទត្រូវបានចែករំលែក")}
                    >
                      <Share2 className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-full"
                      onClick={() => toast.success("អត្ថបទត្រូវបានរក្សាទុកដោយជោគជ័យ!")}
                    >
                      <Bookmark className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* MAIN IMAGE */}
              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/40 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"
                  alt="News Hero"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* AUTHOR INFO UNDER IMAGE */}
              <div className="flex items-center gap-3 py-3">
                <Avatar className="size-10 border border-border/40">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">សរសេរដោយៈ ចាន់ ធីតា</p>
                  <p className="text-xs text-muted-foreground mt-1">អ្នកយកព័ត៌មានផ្នែកបច្ចេកវិទ្យា</p>
                </div>
              </div>



              {/* ARTICLE BODY */}
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed KhmerOS">
                <p>
                  នៅក្នុងយុគសម័យឌីជីថលដែលកំពុងរីកចម្រើនយ៉ាងឆាប់រហ័ស បច្ចេកវិទ្យាបញ្ញាសិប្បនិម្មិត (AI) បានក្លាយជាឧបករណ៍ដ៏មានឥទ្ធិពលបំផុតមួយសម្រាប់សហគ្រាសធុនតូច និងមធ្យម (SMEs) នៅក្នុងប្រទេសកម្ពុជា។ តាមរយៈការប្រើប្រាស់ AI អាជីវកម្មអាចកាត់បន្ថយចំណាយប្រតិបត្តិការ និងបង្កើនប្រសិទ្ធភាពការងារបានយ៉ាងច្រើន។
                </p>
                <p>
                  លោកស្រី ចាន់ ធីតា អ្នកជំនាញផ្នែកបច្ចេកវិទ្យាបានលើកឡើងថា "AI មិនមែនសម្រាប់តែក្រុមហ៊ុនយក្សនោះទេ ប៉ុន្តែវាគឺជាជំនួយការដ៏វៃឆ្លាតសម្រាប់អាជីវកម្មខ្នាតតូចក្នុងការគ្រប់គ្រងទិន្នន័យអតិថិជន និងការផ្សព្វផ្សាយពាណិជ្ជកម្មដោយស្វ័យប្រវត្តិ"។
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-md my-8 shadow-md">
                   <Image
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                    alt="Article content"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  យោងតាមរបាយការណ៍ចុងក្រោយ អាជីវកម្មដែលបានបញ្ចូល AI ទៅក្នុងប្រព័ន្ធការងាររបស់ពួកគេ បានឃើញការកើនឡើងនៃផលិតភាពរហូតដល់ ៣០% ក្នុងរយៈពេលត្រឹមតែ ៦ ខែដំបូង។ នេះគឺជាសញ្ញាវិជ្ជមានសម្រាប់សេដ្ឋកិច្ចឌីជីថលរបស់កម្ពុជា។
                </p>
              </div>

              {/* TAGS */}
              <div className="pt-6 border-t border-border/40">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground mr-2">ស្លាកសញ្ញាៈ</span>
                  <Badge variant="outline" className="rounded-md hover:bg-accent cursor-pointer">បច្ចេកវិទ្យា</Badge>
                  <Badge variant="outline" className="rounded-md hover:bg-accent cursor-pointer">អាជីវកម្ម</Badge>
                  <Badge variant="outline" className="rounded-md hover:bg-accent cursor-pointer">កម្ពុជា</Badge>
                  <Badge variant="outline" className="rounded-md hover:bg-accent cursor-pointer">AI</Badge>
                </div>
              </div>

              {/* AD UNDER NEWS */}
              <div className="w-full h-32 bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
                <span className="text-muted-foreground/30 font-bold uppercase tracking-widest">Advertisement</span>
              </div>

              {/* RELATED ARTICLES - HORIZONTAL SCROLL */}
              <div className="space-y-6 pt-8 border-t border-border/40">
                <h2 className="text-xl font-bold border-l-4 border-primary pl-3">អត្តបទទាក់ទង</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {POPULAR_NEWS.map((news) => (
                    <NewsCard 
                      key={news.id} 
                      news={news} 
                      variant="horizontal" 
                      className="min-w-[280px] snap-start" 
                    />
                  ))}
                </div>
              </div>
            </article>

            {/* SIDEBAR - POPULAR */}
            <aside className="lg:w-1/3 space-y-8">
              <div className="space-y-4 sticky top-24">
                <h2 className="text-xl font-bold border-b pb-2 mb-4">ព័ត៌មានពេញនិយម</h2>
                <div className="space-y-3">
                  {POPULAR_NEWS.map((news) => (
                    <NewsCard key={news.id} news={news} variant="small" />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* RIGHT AD PANEL */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4">
          <div className="h-[600px] sticky top-24 bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-2xl tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        </div>

      </div>
    </div>
  )
}
