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
      <div className="relative w-24 h-24 overflow-hidden rounded shadow-sm bg-primary/10 hover:bg-primary/20 transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
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
      </div>
    </div>
  );
}
