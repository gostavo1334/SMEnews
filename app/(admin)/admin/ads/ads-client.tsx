'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Trash2, ExternalLink, Layout, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAd, toggleAdStatus, deleteAd } from '@/app/actions/post-actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface Ad {
  id: number
  title: string
  position: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
  createdAt: Date
}

export default function AdsPage({ initialAds = [] }: { initialAds: Ad[] }) {
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const positions = [
    { value: 'sidebar_left_1', label: 'Sidebar Left - Slot 1 (398x1183)' },
    { value: 'sidebar_left_2', label: 'Sidebar Left - Slot 2 (398x1183)' },
    { value: 'sidebar_right_1', label: 'Sidebar Right - Slot 1 (398x1183)' },
    { value: 'sidebar_right_2', label: 'Sidebar Right - Slot 2 (398x1183)' },
    { value: 'after_popular', label: 'After Popular News (2480x2150)' },
    { value: 'after_article', label: 'After News Content (1920x200)' },
    { value: 'top_banner', label: 'Top Header GIF (600x100)' },
    { value: 'sponsor_cube', label: 'Top Header Sponsor Cube (80x80)' },
  ]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleCreateAd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const newAd = await createAd(formData)
      setAds([newAd as unknown as Ad, ...ads])
      toast.success("បន្ថែមពាណិជ្ជកម្មដោយជោគជ័យ")
      ;(e.target as HTMLFormElement).reset()
      setPreview(null)
      setFileName("")
    } catch (error) {
      toast.error("មានបញ្ហាក្នុងការបន្ថែម")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    startTransition(async () => {
      try {
        await toggleAdStatus(id, !currentStatus)
        setAds(ads.map(ad => ad.id === id ? { ...ad, active: !currentStatus } : ad))
        toast.success("បច្ចុប្បន្នភាពស្ថានភាព")
      } catch (error) {
        toast.error("កំហុស")
      }
    })
  }

  async function handleDelete(id: number) {
    if (!confirm("តើអ្នកចង់លុបពាណិជ្ជកម្មនេះមែនទេ?")) return
    
    startTransition(async () => {
      try {
        await deleteAd(id)
        setAds(ads.filter(ad => ad.id !== id))
        toast.success("លុបបានជោគជ័យ")
      } catch (error) {
        toast.error("កំហុស")
      }
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រងពាណិជ្ជកម្ម (Ads Management)</h1>
        <p className="text-sm text-muted-foreground KhmerOS">គ្រប់គ្រងផ្ទាំងពាណិជ្ជកម្មលើគេហទំព័រ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD FORM */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>បន្ថែមពាណិជ្ជកម្មថ្មី</CardTitle>
            <CardDescription>បញ្ចូលព័ត៌មានសម្រាប់ផ្ទាំងពាណិជ្ជកម្មថ្មី</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ចំណងជើងពាណិជ្ជកម្ម</label>
                <Input name="title" placeholder="ឧៈ កូកាកូឡា" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">ទីតាំងបង្ហាញ</label>
                <Select name="position" defaultValue="sidebar_right">
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសទីតាំង" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">តំណភ្ជាប់ (Link URL)</label>
                <Input name="linkUrl" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">រូបភាពពាណិជ្ជកម្ម</label>
                <div className={cn(
                  "border-2 border-dashed border-border rounded-md p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[120px] flex flex-col items-center justify-center overflow-hidden",
                  preview && "border-primary/50 bg-primary/5"
                )}>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    required 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {preview ? (
                    <div className="relative w-full aspect-video rounded-sm overflow-hidden">
                      <Image src={preview} alt="Preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">ចុចទីនេះដើម្បីជ្រើសរើសរូបភាព</p>
                    </>
                  )}
                </div>
                {fileName && (
                  <p className="text-[10px] text-muted-foreground truncate italic">
                    File: {fileName}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "កំពុងបញ្ចូល..." : "រក្សាទុក"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LIST TABLE */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>បញ្ជីពាណិជ្ជកម្ម</CardTitle>
            <CardDescription>គ្រប់គ្រង និងតាមដានពាណិជ្ជកម្មដែលមានស្រាប់</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">រូបភាព</TableHead>
                  <TableHead>ចំណងជើង / ទីតាំង</TableHead>
                  <TableHead>ស្ថានភាព</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      មិនទាន់មានពាណិជ្ជកម្មនៅឡើយទេ
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="relative size-12 rounded border overflow-hidden bg-muted">
                          <Image src={ad.imageUrl} alt={ad.title} fill className="object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{ad.title}</p>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {ad.position}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleToggleStatus(ad.id, ad.active)}
                          className="focus:outline-none"
                        >
                          {ad.active ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                              <CheckCircle2 className="size-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="opacity-60">
                              <XCircle className="size-3 mr-1" /> Inactive
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ad.linkUrl && (
                            <a href={ad.linkUrl} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="icon-xs">
                                <ExternalLink className="size-3.5" />
                              </Button>
                            </a>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
