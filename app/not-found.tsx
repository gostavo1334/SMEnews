import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="space-y-2">
        <p className="text-[12rem] font-bold text-primary/10 select-none leading-none">404</p>
        <h1 className="text-3xl font-bold text-foreground dark:text-white">រកមិនឃើញទំព័រ</h1>
        <p className="text-muted-foreground max-w-sm mx-auto KhmerOS">
          ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។
        </p>
      </div>
      
      <Button variant="outline" className="gap-2" render={<Link href="/" />}>
        <ArrowLeft className="size-4" />
        ត្រលប់ទៅទំព័រដើម
      </Button>
    </div>
  )
}
