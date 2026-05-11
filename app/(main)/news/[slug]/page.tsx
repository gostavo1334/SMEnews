import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Share2, User, AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import { getPostBySlug, getAds, getPopularPosts, getPosts } from '@/app/actions/post-actions'
import { notFound } from 'next/navigation'
import { ShareDialog } from '@/components/share-dialog'
import { PostContentViewer } from '@/components/post-content-viewer'
import { ReportDialog } from '@/components/report-dialog'
import { Advertisement, PostWithRelations } from '@/types/prisma'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} - SME NEWS`,
    description: post.metaDesc || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
    openGraph: {
      title: `${post.title} - SME NEWS`,
      images: [{ url: post.featuredImage || "" }],
    },
  }
}

async function RelatedNews() {
  const related = await getPopularPosts()
  return (
    <div className="space-y-6 pt-8 border-t border-border/40">
      <h2 className="text-xl font-bold border-l-4 border-primary pl-3">អត្តបទទាក់ទង</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {related.map((p: PostWithRelations) => (
          <NewsCard 
            key={p.id} 
            news={{
              id: p.id, slug: p.slug, title: p.title, 
              category: p.category?.name || "General", categorySlug: p.category?.slug,
              date: new Date(p.createdAt).toLocaleDateString('km-KH'),
              image: p.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
              summary: p.metaDesc ?? undefined
            }} 
            variant="horizontal" className="min-w-[280px] snap-start" 
          />
        ))}
      </div>
    </div>
  )
}

async function AdAfterArticle() {
  const ads = await getAds()
  const ad = ads.find((ad: Advertisement) => ad.active && ad.position === 'after_article')
  if (!ad) return null
  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full mt-8">
      <div className="relative w-full aspect-[1920/200] rounded-md overflow-hidden border border-border/40">
        <Image src={ad.imageUrl} alt={ad.title} fill unoptimized sizes="1000px" className="object-cover" />
        <div className="absolute inset-0 shiny-effect pointer-events-none" />
      </div>
    </a>
  )
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug) as PostWithRelations | null
  if (!post) notFound()

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      <div className="lg:col-span-3 absolute top-0 left-0 w-full h-[500px] -z-10 pointer-events-none opacity-40 dark:opacity-60 overflow-hidden">
        <div className="absolute inset-0 blur-[60px] scale-125">
          <Image src={post.featuredImage || ""} alt="Glow" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <article className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-primary bg-primary/10 border-none">{post.category?.name || "General"}</Badge>
          <h1 className="text-3xl md:text-4xl font-medium leading-tight">{post.title}</h1>
          <div className="flex items-center justify-between py-2 border-y border-border/40 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><Clock className="size-4" />{formattedDate}</div>
            <div className="flex items-center gap-2">
              <ShareDialog title={post.title} />
              <ReportDialog postId={post.id} postTitle={post.title} />
            </div>
          </div>
        </div>
        <PostContentViewer 
          featuredImage={post.featuredImage || ""} 
          title={post.title} 
          content={post.content || ''} 
        />
        <div className="mt-4 py-3 flex items-center gap-4 border-t border-border/40"><Avatar className="size-14">{post.author?.image ? <AvatarImage src={post.author.image} /> : null}<AvatarFallback>{post.author?.name?.charAt(0) || 'U'}</AvatarFallback></Avatar><div><h3 className="text-base font-bold">{post.author?.name || "អ្នកយកព័ត៌មាន"}</h3><p className="text-xs text-muted-foreground">អ្នកយកព័ត៌មានផ្នែកសេដ្ឋកិច្ច</p></div></div>
        <Suspense fallback={null}><AdAfterArticle /></Suspense>
        <Suspense fallback={null}><RelatedNews /></Suspense>
      </article>
    </>
  )
}
