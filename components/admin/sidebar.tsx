'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  FilePlus, 
  FileText, 
  BookOpen, 
  FileDown, 
  FolderTree, 
  Megaphone, 
  CalendarClock, 
  UserPlus, 
  Settings,
  FileEdit,
  HeartHandshake,
  LogOut,
  AlertTriangle,
  MessageSquare
} from 'lucide-react'
import { logout } from '@/app/actions/auth-actions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'

const navItems = [
  { title: 'Analytics', href: '/admin', icon: BarChart3 },
  { title: 'Create Post', href: '/admin/create', icon: FilePlus },
  { title: 'Post Lists', href: '/admin/posts', icon: FileText },
  { title: 'Category', href: '/admin/category', icon: FolderTree },
  { title: 'Control Ads', href: '/admin/ads', icon: Megaphone },
  { title: 'Sponsors', href: '/admin/sponsors', icon: HeartHandshake },
  { title: 'Drafts', href: '/admin/drafts', icon: FileEdit },
  { title: 'Schedule', href: '/admin/schedule', icon: CalendarClock },
  { title: 'Reports', href: '/admin/reports', icon: AlertTriangle, adminOnly: true },
  { title: 'FB Scraper', href: '/admin/tools/facebook-scraper', icon: MessageSquare },
  { title: 'Add User', href: '/admin/users', icon: UserPlus, adminOnly: true },
]

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && role !== 'admin') return false
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image 
            src="/Logo/logo.png" 
            alt="SME News" 
            width={140} 
            height={40} 
            className="h-8 w-auto object-contain group-data-[collapsible=icon]:hidden"
          />
          <Image 
            src="/Logo/logo.png" 
            alt="SME" 
            width={32} 
            height={32} 
            className="h-7 w-auto object-contain hidden group-data-[collapsible=icon]:block"
          />
        </Link>
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-sidebar-foreground/70">SME News | Dashboard</p>
          <p className="text-[10px] text-sidebar-foreground/40">v2.0</p>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t space-y-2">
        <div className="flex items-center justify-center">
          <ModeToggle />
        </div>
        <form action={logout}>
          <button type="submit" className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
            <LogOut className="size-4" />
            <span>ចាកចេញ (Logout)</span>
          </button>
        </form>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
