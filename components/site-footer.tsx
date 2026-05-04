'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Code,
  User2,
  Send,
  Moon,
  Sun,
  ArrowDownLeft,
  MessageCircle,
} from 'lucide-react';

const data = () => ({
  navigation: {
    ផលិតផល: [
      { name: 'មុខងារ', href: '#' },
      { name: 'តម្លៃ', href: '#' },
      { name: 'ការតភ្ជាប់', href: '#' },
      { name: 'ផែនការ', href: '#' },
    ],
    ក្រុមហ៊ុន: [
      { name: 'អំពីយើង', href: '#' },
      { name: 'ប្លុក', href: '#' },
      { name: 'អាជីព', href: '#' },
      { name: 'ទំនាក់ទំនង', href: '#' },
    ],
    ធនធាន: [
      { name: 'ឯកសារយោង', href: '#' },
      { name: 'API', href: '#' },
      { name: 'សហគមន៍', href: '#' },
      { name: 'ស្ថានភាព', href: '#' },
    ],
    ច្បាប់: [
      { name: 'ឯកជនភាព', href: '#' },
      { name: 'លក្ខខណ្ឌ', href: '#' },
      { name: 'គោលការណ៍ឃុកឃី', href: '#' },
    ],
  },
  socialLinks: [
    { icon: Send, label: 'Twitter', href: '#' },
    { icon: Code, label: 'GitHub', href: '#' },
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: User2, label: 'LinkedIn', href: '#' },
  ],
  bottomLinks: [
    { href: '#', label: 'គោលការណ៍ឯកជនភាព' },
    { href: '#', label: 'លក្ខខណ្ឌប្រើប្រាស់' },
    { href: '#', label: 'គោលការណ៍ឃុកឃី' },
  ],
});

export function SiteFooter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <footer className="mt-20 w-full bg-card/50">
      <div className="animate-energy-flow via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      <div className="relative w-full px-5">
        {/* Top Section */}
        <div className="container m-auto grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/Logo/logo.png"
                alt="SME NEWS Logo"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              ប្រភពព័ត៌មានអាជីវកម្ម នវានុវត្តន៍ និងបច្ចេកវិទ្យាឈានមុខគេក្នុងប្រទេសកម្ពុជា។ ផ្តល់ជូននូវព័ត៌មានពិត និងរហ័សទាន់ចិត្ត។
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {data().socialLinks.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'icon' }),
                      "hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-500 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-1000 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-md space-y-3"
            >
              <label htmlFor="email" className="block text-sm font-medium">
                ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ
              </label>
              <div className="relative w-full">
                <Input
                  type="email"
                  id="email"
                  placeholder="អ៊ីមែលរបស់អ្នក"
                  className="h-12 w-full rounded-md"
                  required
                />
                <Button
                  type="submit"
                  className="absolute top-1.5 right-1.5 cursor-pointer transition-all duration-1000 hover:px-10 rounded-md"
                >
                  ចុះឈ្មោះ
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                ទទួលបានការអាប់ដេតចុងក្រោយ និងការផ្តល់ជូនពិសេសៗ។
              </p>
            </form>
            <h1 className="from-muted-foreground/15 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl">
              SME NEWS
            </h1>
          </div>
          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 items-start justify-between gap-4 px-0 lg:col-span-3">
            {(['ផលិតផល', 'ក្រុមហ៊ុន', 'ធនធាន', 'ច្បាប់'] as const).map(
              (section) => (
                <div key={section} className="w-full">
                  <h3 className="border-primary mb-3 border-l-2 pl-4 text-xs font-semibold tracking-wider uppercase">
                    {section}
                  </h3>
                  <ul className="space-y-2">
                    {data().navigation[section].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="group text-muted-foreground hover:text-foreground decoration-primary inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 hover:pl-2 hover:underline"
                        >
                          <ArrowDownLeft className="text-primary rotate-[225deg] opacity-30 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100 sm:group-hover:rotate-[225deg] md:rotate-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
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
