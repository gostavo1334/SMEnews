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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"

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

export function SiteHeader() {
  return (
    <>
      {/* TOP BAR STONE */}
      <div className="w-full px-6 md:px-12 py-4 flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image 
                src="/Logo/logo.png" 
                alt="SME NEWS" 
                width={300} 
                height={80} 
                className="h-16 md:h-20 w-auto object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* ADS PANEL MIDDLE */}
        <div className="flex-grow hidden lg:flex justify-center">
          <div className="w-full max-w-[728px] h-20 bg-muted rounded flex items-center justify-center border border-dashed border-muted-foreground/30 relative cursor-pointer hover:bg-muted/80 transition-colors">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Advertisement Space</span>
          </div>
        </div>

        {/* SPONSOR RIGHT */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border overflow-hidden">
             <Image 
              src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=50&q=80" 
              alt="Sponsor" 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* NAV BAR STONE (STICKY) */}
      <div className="sticky top-0 z-50 border-y border-primary/20 bg-primary shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between md:justify-center gap-6 py-1">
          
          {/* MOBILE MENU TRIGGER */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 text-white hover:bg-white/10">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] KhmerOS">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="text-primary font-bold">ប្រភេទព័ត៌មាន</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-100px)]">
                  {navItems.map((item) => (
                    <div key={item.title} className="flex flex-col">
                      <Link 
                        href={item.href} 
                        className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        {item.title}
                      </Link>
                      {item.items && (
                        <div className="pl-6 flex flex-col border-l border-border/40 ml-4 gap-1 mt-1">
                          {item.items.map((sub) => (
                            <Link 
                              key={sub.title} 
                              href={sub.href}
                              className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* DESKTOP MENU - HIDDEN ON MOBILE */}
          <NavigationMenu className="hidden md:flex max-w-fit justify-start">
            <NavigationMenuList className="flex-wrap">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="text-[14px] font-medium !bg-transparent text-primary-foreground !hover:bg-white/10 hover:text-white data-[state=open]:!bg-white/10 data-[popup-open]:!bg-white/10">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-1 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <ListItem
                              key={subItem.title}
                              title={subItem.title}
                              href={subItem.href}
                            >
                              {subItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link 
                      href={item.href} 
                      className={cn(navigationMenuTriggerStyle(), "text-[14px] font-medium KhmerOS !bg-transparent text-primary-foreground !hover:bg-white/10 hover:text-white")}
                    >
                      {item.title}
                    </Link>
                  )}
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
            <ModeToggle />
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
    <li>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  )
}
