'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteUser } from '@/app/actions/user-actions'

export function UserDeleteButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('តើអ្នកប្រាកដថាចង់លុបអ្នកប្រើប្រាស់នេះ?')) return

    setLoading(true)
    try {
      await deleteUser(id)
      toast.success('លុបអ្នកប្រើប្រាស់ជោគជ័យ')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('មានបញ្ហាក្នុងការលុប')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  )
}
