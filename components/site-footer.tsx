'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Code,
  User2,
  Send,

  ArrowDownLeft,
  MessageCircle,
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
    <footer id="site-footer" className="relative mt-20 w-full overflow-hidden bg-card/50 border-t">
      <div className="absolute inset-0 -z-10">
        <Waves
          lineColor="#3b82f6"
          backgroundColor="transparent"
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <div className="animate-energy-flow via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      <div className="relative w-full px-5">
        {/* Top Section */}
        <div className="py-12">
          <div className="space-y-6 flex flex-col items-center text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/Logo/logo.png"
                alt="SME NEWS Logo"
                width={300}
                height={100}
                className="h-32 w-auto object-contain"
              />
            </Link>
            <p className="text-black dark:text-white text-xl max-w-2xl leading-relaxed font-medium">
              ប្រភពព័ត៌មានអាជីវកម្ម នវានុវត្តន៍ និងបច្ចេកវិទ្យាឈានមុខគេក្នុងប្រទេសកម្ពុជា។ ផ្តល់ជូននូវព័ត៌មានពិត និងរហ័សទាន់ចិត្ត។
            </p>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="animate-rotate-3d via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
        <div className="text-muted-foreground container m-auto flex flex-col items-center justify-between gap-4 p-4 text-xs md:flex-row md:px-0 md:text-sm">
          <p className="">
            &copy; {currentYear} SME NEWS | រក្សាសិទ្ធិគ្រប់យ៉ាង
          </p>
          <div className="flex items-center gap-4">
            {data().bottomLinks.map(({ href, label }) => (
              <Link key={label} href={href} className="hover:text-foreground">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <span className="from-primary/20 absolute inset-x-0 bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
      </div>
    </footer>
  );
}
