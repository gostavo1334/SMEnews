'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { submitReport } from "@/app/actions/post-actions"

interface ReportDialogProps {
  postId: number;
  postTitle: string;
}

export function ReportDialog({ postId, postTitle }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  React.useEffect(() => {
    // Define global callback for Turnstile
    (window as any).onTurnstileSuccess = (token: string) => {
      setCaptchaToken(token)
      const el = document.getElementById('turnstile-token') as HTMLInputElement
      if (el) el.value = token
    }

    // Force render when dialog is open
    if (open && (window as any).turnstile) {
      setTimeout(() => {
        try {
          (window as any).turnstile.render('.cf-turnstile')
        } catch (e) {
          // Already rendered or other minor error
        }
      }, 150)
    }
  }, [open])

  const resetForm = () => {
    setReason('')
    setCaptchaToken(null)
    setLoading(false)
    // Manually reset the hidden input
    const el = document.getElementById('turnstile-token') as HTMLInputElement
    if (el) el.value = ''
  }

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check both state and hidden input just in case
    const token = captchaToken || (document.getElementById('turnstile-token') as HTMLInputElement)?.value

    if (!token) {
      toast.error("សូមបញ្ជាក់ថាអ្នកមិនមែនជា Robot (Please verify captcha)")
      return
    }

    if (reason.length < 5) {
      toast.error("សូមបញ្ចូលមូលហេតុនៃការរាយការណ៍ (Please enter a reason)")
      return
    }

    setLoading(true)
    try {
      const result = await submitReport(postId, reason, token)
      if (result.success) {
        toast.success("ការរាយការណ៍របស់អ្នកត្រូវបានបញ្ជូន (Report submitted)")
        setOpen(false)
        resetForm()
      } else {
        toast.error(result.error || "មានបញ្ហាក្នុងការបញ្ជូន (Failed to submit)")
      }
    } catch (error) {
      toast.error("មានកំហុសបច្ចេកទេស (Technical error)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-destructive transition-colors">
            <AlertTriangle className="size-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleReport}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              រាយការណ៍អត្ថបទ (Report Post)
            </DialogTitle>
            <DialogDescription>
              សូមបញ្ជាក់ពីមូលហេតុដែលអ្នករាយការណ៍អត្ថបទនេះ៖ "{postTitle}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">មូលហេតុ (Reason)</label>
              <Textarea 
                placeholder="ឧទាហរណ៍៖ ព័ត៌មានមិនពិត, មាតិកាមិនសមរម្យ..." 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 flex flex-col items-center min-h-[65px] justify-center">
              <div 
                className="cf-turnstile" 
                data-sitekey="1x00000000000000000000AA"
                data-callback="onTurnstileSuccess"
              />
              <input type="hidden" name="cf-turnstile-response" id="turnstile-token" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>បោះបង់</Button>
            <Button type="submit" variant="destructive" disabled={loading || !captchaToken}>
              {loading ? "កំពុងបញ្ជូន..." : "បញ្ជូនការរាយការណ៍"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
