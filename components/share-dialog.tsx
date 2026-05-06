'use client'

import { useState, useEffect } from 'react'
import { Share2, Send, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function ShareDialog({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="size-8 rounded-full" />}>
        <Share2 className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ចែករំលែកអត្ថបទនេះ</DialogTitle>
          <DialogDescription>
            ចែករំលែកអត្ថបទនេះទៅកាន់បណ្តាញសង្គមរបស់អ្នក
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Link
            </label>
            <Input
              id="link"
              defaultValue={url}
              readOnly
            />
          </div>
          <Button size="sm" className="px-3" onClick={copyToClipboard}>
            <span className="sr-only">Copy</span>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-center gap-4 pt-2 border-t">
          <Button onClick={shareFacebook} variant="outline" className="w-full flex items-center gap-2 text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10 dark:hover:bg-[#1877F2]/20">
            <FacebookIcon className="size-5" />
            Facebook
          </Button>
          <Button onClick={shareTelegram} variant="outline" className="w-full flex items-center gap-2 text-[#0088cc] hover:text-[#0088cc] hover:bg-[#0088cc]/10 dark:hover:bg-[#0088cc]/20">
            <Send className="size-5" />
            Telegram
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
