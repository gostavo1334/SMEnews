'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { SponsorCube } from "@/components/sponsor-cube"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  { title: "ទំព័រដើម", href: "/" },
  { 
    title: "អាជីវកម្មខ្នាតតូច-មធ្យម និងសិប្បកម្ម", 
    href: "/sme",
    items: [
      { title: "សហគ្រាសធុនតូច", href: "/sme/small", description: "ព័ត៌មានអំពីសហគ្រាសធុនតូច" },
      { title: "សហគ្រាសធុនមធ្យម", href: "/sme/medium", description: "ព័ត៌មានអំពីសហគ្រាសធុនមធ្យម" },
      { title: "សិប្បកម្ម", href: "/sme/crafts", description: "ព័ត៌មានអំពីសិប្បកម្មខ្មែរ" },
    ]
  },
  { title: "នវានុវត្តន៍-បច្ចេកវិទ្យា", href: "/tech" },
  { title: "សង្គមជាតិ-សេដ្ឋកិច្ច", href: "/society" },
  { title: "ធនាគារ-ហិរញ្ញវត្ថុ", href: "/finance" },
  { title: "ពាណិជ្ជកម្ម", href: "/commerce" },
  { title: "គំនិតអាជីវកម្ម", href: "/ideas" },
  { title: "វីដេអូ", href: "/video" },
  { title: "ទាញយកឯកសារ", href: "/downloads" },
]

export function SiteHeader({ topBannerAd, sponsorAds = [], categories = [] }: { topBannerAd?: any, sponsorAds?: any[], categories?: any[] }) {
  const dynamicNavItems = [
    { title: "ទំព័រដើម", href: "/" },
    ...categories
      .filter(cat => cat.name !== "វីដេអូ" && cat.name !== "ទំព័រដើម")
      .map(cat => ({
        title: cat.name,
        href: `/category/${cat.slug}`
      })),
    { title: "វីដេអូ", href: "/video" },
    { title: "ទាញយកឯកសារ", href: "/downloads" },
  ]

  return (
    <>
      {/* TOP BAR STONE */}
      <div id="site-header-top" className="relative z-30 w-full border-b border-border/10 bg-background/50">
        <div className="w-full px-6 py-2 flex items-center justify-between gap-8">
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image 
                  src="/Logo/logo.png" 
                  alt="SME NEWS" 
                  width={320} 
                  height={100} 
                  className="h-16 md:h-24 w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
 
          {/* ADS PANEL MIDDLE */}
          <div className="flex-grow hidden lg:flex justify-center">
            {topBannerAd ? (
              <a 
                href={topBannerAd.linkUrl || "#"} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full max-w-[900px] h-20 md:h-28 relative rounded overflow-hidden border border-border shadow-sm transition-transform hover:scale-[1.01]"
              >
                <Image src={topBannerAd.imageUrl} alt={topBannerAd.title} fill className="object-cover" unoptimized />
              </a>
            ) : (
              <div className="w-full max-w-[900px] h-20 md:h-28 bg-muted rounded flex items-center justify-center border border-dashed border-muted-foreground/30 relative cursor-pointer hover:bg-muted/80 transition-colors">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Advertisement Space</span>
              </div>
            )}
          </div>
 
          {/* SPONSOR RIGHT */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <SponsorCube ads={sponsorAds} />
          </div>
        </div>
      </div>

      {/* NAV BAR STONE (STICKY) */}
      <div id="site-header-nav" className="sticky top-0 z-50 border-y border-primary/20 bg-primary shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between md:justify-center gap-6 py-1">
          
          {/* MOBILE MENU TRIGGER */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger
                render={
                  <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-9 text-white hover:bg-white/10")}>
                    <Menu className="size-5" />
                  </button>
                }
              />
              <SheetContent side="left" className="w-[300px] sm:w-[400px] KhmerOS">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="text-primary font-bold">ប្រភេទព័ត៌មាន</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-100px)]">
                  {dynamicNavItems.map((item) => (
                    <div key={item.href} className="flex flex-col">
                      <Link 
                        href={item.href} 
                        className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        {item.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* DESKTOP MENU - HIDDEN ON MOBILE */}
          <NavigationMenu className="hidden md:flex max-w-fit justify-start">
            <NavigationMenuList className="flex-wrap">
              {dynamicNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link 
                    href={item.href} 
                    className={cn(navigationMenuTriggerStyle(), "text-[14px] font-medium KhmerOS !bg-transparent text-primary-foreground !hover:bg-white/10 hover:text-white")}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* SEARCH & TOGGLE - ALWAYS VISIBLE */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/70" />
              <Input
                type="search"
                placeholder="ស្វែងរក..."
                className="pl-8 h-8 w-[150px] text-xs bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:w-[200px] focus:bg-white/20 transition-all"
              />
            </div>
            <ModeToggle className="text-white hover:bg-white/10" />
          </div>
        </div>
      </div>
    </>
  )
}

function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
  return (
    <li {...props}>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  )
}
