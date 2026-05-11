import { AdminSidebar } from '@/components/admin/sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  const role = session.user.role
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar role={role} />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm text-muted-foreground">Dashboard</span>
            <div className="ml-auto flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                render={<Link href="/" />}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span>ត្រឡប់ទៅកាន់ទំព័រដើម</span>
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
