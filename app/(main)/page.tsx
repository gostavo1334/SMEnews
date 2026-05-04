import { HeroSection } from "@/components/hero-section";
import { NewsSection } from "@/components/news-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-12 relative">
      {/* WRAPPER FOR SIDE ADS */}
      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-4">
        
        {/* LEFT AD PANEL */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4">
          <div className="h-[600px] sticky top-24 bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-2xl tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow max-w-[1000px] w-full">
          <HeroSection />
          <NewsSection />
        </div>

        {/* RIGHT AD PANEL */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4">
          <div className="h-[600px] sticky top-24 bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-2xl tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        </div>

      </div>
    </div>
  );
}
