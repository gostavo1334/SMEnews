'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Download from "yet-another-react-lightbox/plugins/download"
import "yet-another-react-lightbox/styles.css"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, RotateCcw } from "lucide-react"

export function PostContentViewer({ featuredImage, title, content }: { featuredImage: string, title: string, content: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [images, setImages] = useState<{src: string, alt?: string}[]>([])
  const [fontSize, setFontSize] = useState(18)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Collect images
    const allImages: { src: string; alt: string }[] = []
    
    if (featuredImage) {
      allImages.push({ src: featuredImage, alt: title })
    }

    const imgElements = contentRef.current?.querySelectorAll('img') || []
    
    imgElements.forEach((img) => {
      // Avoid duplicates if the content uses the same image
      if (!allImages.find(i => i.src === img.src)) {
        allImages.push({ src: img.src, alt: img.alt || title })
      }
      img.style.cursor = 'zoom-in'
      img.classList.add('transition-opacity', 'hover:opacity-90')
    })

    setImages(allImages)

    // Event listener for clicks
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement
      const idx = allImages.findIndex(img => img.src === target.src)
      if (idx !== -1) {
        setLightboxIndex(idx)
        setLightboxOpen(true)
      }
    }

    imgElements.forEach(img => img.addEventListener('click', handleImageClick))

    return () => {
      imgElements.forEach(img => img.removeEventListener('click', handleImageClick))
    }
  }, [featuredImage, title, content])

  return (
    <>
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-md border border-border/40 cursor-zoom-in transition-opacity hover:opacity-90"
        onClick={() => {
          const idx = images.findIndex(img => img.src === featuredImage)
          setLightboxIndex(idx !== -1 ? idx : 0)
          setLightboxOpen(true)
        }}
      >
        <Image src={featuredImage || ""} alt={title} fill sizes="1000px" priority className="object-cover" />
      </div>

      {/* Simple Font Size Controls - Compact */}
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 font-bold"
          onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
        >
          A-
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 font-bold"
          onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
        >
          A+
        </Button>
        <span className="text-[10px] text-muted-foreground ml-2 uppercase font-medium">{fontSize}px</span>
      </div>

      <div 
        ref={contentRef}
        className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4 KhmerOS post-content" 
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
        dangerouslySetInnerHTML={{ __html: content || '' }} 
      />

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        plugins={[Zoom, Download]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
      />
    </>
  )
}
