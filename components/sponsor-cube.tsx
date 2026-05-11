'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export function SponsorCube({ ads = [] }: { ads?: any[] }) {
  const sponsors = ads.filter(ad => ad.active).map(ad => ad.imageUrl);
  const displaySponsors = sponsors.length > 0 ? sponsors : ["https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&q=80"];
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (displaySponsors.length <= 1) return;
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displaySponsors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [displaySponsors.length]);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider KhmerOS">ឧបត្ថម្ភដោយ</span>
      <div 
        className="relative w-24 h-24 overflow-hidden rounded bg-white border border-border/50 hover:border-primary/30 transition-colors"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, rotateY: 110, scale: 0.5, z: -200, filter: 'blur(10px)' }}
            animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotateY: -110, scale: 0.5, z: -200, filter: 'blur(10px)' }}
            transition={{ 
              type: "spring",
              stiffness: 80,
              damping: 15,
              mass: 1,
              restDelta: 0.001
            }}
            className="absolute inset-0 flex items-center justify-center p-1"
          >
            <Image 
              src={displaySponsors[index]} 
              alt="Sponsor" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 shiny-effect pointer-events-none" />
      </div>
    </div>
  );
}
