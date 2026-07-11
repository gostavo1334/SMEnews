'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Code,
  User2,
  Send,

  ArrowDownLeft,
  MessageCircle,
  Lock,
} from 'lucide-react';

import Waves from '@/components/waves';

const data = () => ({
  bottomLinks: [
    { href: '#', label: 'គោលការណ៍ឯកជនភាព' },
    { href: '#', label: 'លក្ខខណ្ឌប្រើប្រាស់' },
    { href: '#', label: 'គោលការណ៍ឃុកឃី' },
  ],
});

export function SiteFooter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <>
      {/* 25 PROVINCES BAR - ABOVE FOOTER */}
      <div className="w-full px-0 mt-[60px]">
        {/* <Image 
          //src="/Logo/25province.png" 
          alt="25 Provinces of Cambodia" 
          width={1920}
          height={300}
          className="w-full h-auto"
          priority
        /> */}
      </div>

      <footer id="site-footer" className="relative w-full overflow-hidden bg-green-800 text-white">

      <div className="absolute inset-0 -z-10 opacity-10">
        <Waves
          lineColor="#ffffff"
          backgroundColor="transparent"
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={24}
          yGap={64}
        />
      </div>
      
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* LEFT: LOGO & DESCRIPTION */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="https://res.cloudinary.com/hmcpifvi/image/upload/v1783567568/images_liqxxw.png"
                alt="SME NEWS"
                width={120}
                height={60}
                className="rounded-lg shadow-lg border border-white/20"
              />
            </Link>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight">Django</h3>
              <p className="text-white/80 text-base leading-relaxed max-w-sm font-normal">
                News Reporter of technology, business, and finance in Cambodia. Stay updated with the latest news and insights from the world of business and technology.
              </p>
            </div>
          </div>

          {/* MIDDLE: LINKS */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-6">
              <h4 className="text-sm font-medium uppercase tracking-widest text-white">មាតិកាពេញនិយម</h4>
              <ul className="space-y-3 text-base font-normal">
                <li><Link href="/category/business-idea" className="hover:text-sky-300 transition-colors">អាជីវកម្ម SME</Link></li>
                <li><Link href="/category/technology" className="hover:text-sky-300 transition-colors">បច្ចេកវិទ្យា</Link></li>
                <li><Link href="/category/banking" className="hover:text-sky-300 transition-colors">ហិរញ្ញវត្ថុ</Link></li>
                <li><Link href="/category/Commerce" className="hover:text-sky-300 transition-colors">ពាណិជ្ជកម្ម</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-medium uppercase tracking-widest text-white">អំពីយើង</h4>
              <ul className="space-y-3 text-base font-normal">
                <li><Link href="https://www.facebook.com/gosta.vo.345097/" className="hover:text-sky-300 transition-colors">About Us</Link></li>
                <li><Link href="https://www.facebook.com/gosta.vo.345097/" className="hover:text-sky-300 transition-colors">ទំនាក់ទំនង</Link></li>
                <li><Link href="/login" className="hover:text-sky-300 transition-colors flex items-center gap-2 font-medium"><Lock className="size-4" /> សម្រាប់បុគ្គលិក</Link></li>
              </ul>
            </div>
          </div>

          {/* RIGHT: FACEBOOK & QR */}
          <div className="md:col-span-4 space-y-6 pt-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="bg-white p-2 rounded-lg shrink-0">
                <Image 
                  src="/Logo/qrqr.png" 
                  alt="QR Code" 
                  width={80} 
                  height={80} 
                  className="rounded-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white/90 uppercase tracking-wider">ស្កេនដើម្បីផ្សព្វផ្សាយ</p>
                <p className="text-xs text-white/50 leading-relaxed font-normal">Scan QR Code Here</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors border border-white/10">
                <Send className="size-4 text-white/60" />
              </div>
              <div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors border border-white/10">
                <MessageCircle className="size-4 text-white/60" href="/business-idea" />
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40 uppercase tracking-widest font-medium">
          <p className="font-normal">&copy; {currentYear} Copyright © Django All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="https://t.me/limheangtem" className="hover:text-white transition-colors">Scan here for sponsorship</Link>
            <Link href="#" className="hover:text-white transition-colors"></Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
