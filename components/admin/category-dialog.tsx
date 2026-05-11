'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory, updateCategory } from "@/app/actions/category-actions"
import { toast } from "sonner"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface Category {
  id: number
  name: string
  slug: string
  parentId?: number | null
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  allCategories: Category[]
}

export function CategoryDialog({ open, onOpenChange, category, allCategories }: CategoryDialogProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState<string>('none')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setParentId(category.parentId ? category.parentId.toString() : 'none')
    } else {
      setName('')
      setSlug('')
      setParentId('none')
    }
  }, [category, open])

  // Auto-generate slug
  useEffect(() => {
    if (!category && name) {
      setSlug(name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''))
    }
  }, [name, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const pId = parentId === 'none' ? undefined : parseInt(parentId)
      if (category) {
        await updateCategory(category.id, name, slug, pId)
        toast.success("បានកែប្រែដោយជោគជ័យ")
      } else {
        await createCategory(name, slug, pId)
        toast.success("បានបង្កើតដោយជោគជ័យ")
      }
      onOpenChange(false)
    } catch (error) {
      toast.error("មានបញ្ហាអ្វីមួយ")
    } finally {
      setLoading(false)
    }
  }

  // Only root categories can be parents (one-level deep rule)
  const availableParents = allCategories.filter(c => 
    !c.parentId && // Must be root
    (!category || c.id !== category.id) // Not self
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'កែប្រែប្រភេទ' : 'បន្ថែមប្រភេទថ្មី'}</DialogTitle>
          <DialogDescription>
            បញ្ចូលព័ត៌មានលម្អិតសម្រាប់ប្រភេទអត្ថបទរបស់អ្នក។
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">ឈ្មោះប្រភេទ</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="ឧទាហរណ៍៖ ពាណិជ្ជកម្ម" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">ស្លាកតំណភ្ជាប់ (Slug)</Label>
            <Input 
              id="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="ឧទាហរណ៍៖ business" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent">ប្រភេទមេ (Parent Category)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="ជ្រើសរើសប្រភេទមេ (ស្រេចចិត្ត)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">គ្មាន (ប្រភេទមេ)</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>បោះបង់</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
