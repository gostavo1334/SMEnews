import Image from 'next/image'
import { getAds } from '@/app/actions/post-actions'
import { Advertisement } from '@/types/prisma'

export async function AdsSidebar({ position }: { position: 'sidebar_left' | 'sidebar_right' }) {
  const ads = await getAds()
  
  return (
    <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4 sticky top-24 h-fit">
      {(() => {
        const sideAds = ads.filter((ad: Advertisement) => 
          ad.active && (ad.position === `${position}_1` || ad.position === `${position}_2`)
        ).sort((a: Advertisement, b: Advertisement) => a.position.localeCompare(b.position));

        return sideAds.length > 0 ? (
          sideAds.map((ad: Advertisement) => (
            <a key={ad.id} href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <div className="relative w-full h-[475px] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.02]">
                <Image 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  fill 
                  unoptimized
                  sizes="160px"
                  className="object-cover" 
                />
              </div>
            </a>
          ))
        ) : (
          <div className="h-[475px] bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-lg tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        );
      })()}
    </div>
  );
}
