'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PostWithRelations } from '@/types/prisma'

interface NewsTickerProps {
  posts: PostWithRelations[]
}

export function NewsTicker({ posts }: NewsTickerProps) {
  if (!posts || posts.length === 0) return null

  // Duplicate posts for seamless looping
  const tickerItems = [...posts, ...posts]

  return (
    <div className="w-full bg-[#f0f7ff]/90 dark:bg-primary/10 backdrop-blur-xl shadow-sm overflow-hidden py-3 mb-6 select-none relative rounded-md">
      <div className="container mx-auto px-4 flex items-center gap-4">
        <Badge className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap px-3 py-1 rounded-sm text-[10px] uppercase font-bold shrink-0">
          ព័ត៌មានថ្មីៗ
        </Badge>
        {/* TICKER CONTAINER */}
        <div className="flex-grow overflow-hidden relative">
          <motion.div
            className="flex items-center gap-16 whitespace-nowrap"
            animate={{
              x: [0, -1200], // Adjust based on content width
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {tickerItems.map((post, index) => (
              <Link 
                key={`${post.id}-${index}`} 
                href={`/news/${post.slug}`}
                className="group flex items-center gap-3 hover:text-primary transition-colors cursor-pointer"
              >
                <span className="text-base font-bold text-primary group-hover:opacity-80 transition-opacity">
                  {post.title}
                </span>
                <span className="text-sm text-blue-400/80 group-hover:text-blue-500 hidden md:inline-block">
                  — {post.metaDesc || (post.content?.replace(/<[^>]*>/g, ' ').substring(0, 100) + "...")}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
