'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createUser } from '@/app/actions/user-actions'
import { Loader2, Upload } from 'lucide-react'

export function UserForm() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
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
      await createUser(formData)
      toast.success('បន្ថែមអ្នកប្រើប្រាស់ជោគជ័យ')
      e.currentTarget.reset()
      setPreview(null)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('មានបញ្ហាក្នុងការបន្ថែមអ្នកប្រើប្រាស់')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">ឈ្មោះពេញ</Label>
        <Input id="name" name="name" placeholder="បញ្ជូលឈ្មោះ..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">អ៊ីមែល (មិនបង្ខំ)</Label>
        <Input id="email" name="email" type="email" placeholder="example@gmail.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">រូបភាពផ្ទាល់ខ្លួន</Label>
        <Label 
          htmlFor="image"
          className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors relative min-h-[150px] overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">ចុចដើម្បីបង្ហោះរូបភាព</span>
            </>
          )}
          <Input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/*" 
            className="sr-only" 
            onChange={handleImageChange}
          />
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកអ្នកប្រើប្រាស់'}
      </Button>
    </form>
  )
}
