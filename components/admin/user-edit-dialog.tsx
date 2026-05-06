'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { updateUser } from '@/app/actions/user-actions'

interface UserEditDialogProps {
  user: {
    id: number
    name: string | null
    email: string | null
    image: string | null
  }
}

export function UserEditDialog({ user }: UserEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(user.image)
  const router = useRouter()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateUser(user.id, formData)
      toast.success('ធ្វើបច្ចុប្បន្នភាពជោគជ័យ')
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('មានបញ្ហាក្នុងការរក្សាទុក')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Edit className="size-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>កែប្រែព័ត៌មានអ្នកប្រើប្រាស់</DialogTitle>
            <DialogDescription>
              ផ្លាស់ប្តូរឈ្មោះ ឬរូបភាពផ្ទាល់ខ្លួនរបស់អ្នក។
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">ឈ្មោះពេញ</Label>
              <Input id="edit-name" name="name" defaultValue={user.name || ''} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">អ៊ីមែល</Label>
              <Input id="edit-email" name="email" defaultValue={user.email || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">រូបភាពថ្មី (ទុកទំនេរបើមិនចង់ប្តូរ)</Label>
              <Label 
                htmlFor="edit-image"
                className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors relative min-h-[120px] overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="size-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">ចុចដើម្បីប្តូររូបភាព</span>
                  </>
                )}
                <Input 
                  id="edit-image" 
                  name="image" 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleImageChange}
                />
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              រក្សាទុកការផ្លាស់ប្តូរ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
