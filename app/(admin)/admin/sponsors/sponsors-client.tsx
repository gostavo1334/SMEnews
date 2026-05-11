'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Trash2, Layout, Image as ImageIcon, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
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
import { createAd, toggleAdStatus, deleteAd } from '@/app/actions/post-actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Ad {
  id: number
  title: string
  position: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
  createdAt: Date
}

export default function SponsorsClient({ initialAds = [] }: { initialAds: Ad[] }) {
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const activeSponsorsCount = ads.filter(ad => ad.active).length

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
    
    if (activeSponsorsCount >= 6) {
      toast.error("អ្នកអាចបង្ហាញ Sponsor តែ ៦ ប៉ុណ្ណោះក្នុងពេលតែមួយ។ សូមបិទខ្លះសិន!")
      return
    }

    setIsUploading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('position', 'sponsor_cube')
    
    try {
      const newAd = await createAd(formData)
      setAds([newAd as unknown as Ad, ...ads])
      toast.success("បន្ថែម Sponsor ដោយជោគជ័យ")
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
    if (!currentStatus && activeSponsorsCount >= 6) {
      toast.error("អ្នកអាចបង្ហាញ Sponsor តែ ៦ ប៉ុណ្ណោះ!")
      return
    }

    startTransition(async () => {
      try {
        await toggleAdStatus(id, !currentStatus)
        setAds(ads.map((ad: Ad) => ad.id === id ? { ...ad, active: !currentStatus } : ad))
        toast.success("បច្ចុប្បន្នភាពស្ថានភាព")
      } catch (error) {
        toast.error("កំហុស")
      }
    })
  }

  async function handleDelete(id: number) {
    if (!confirm("តើអ្នកចង់លុប Sponsor នេះមែនទេ?")) return
    
    startTransition(async () => {
      try {
        await deleteAd(id)
        setAds(ads.filter((ad: Ad) => ad.id !== id))
        toast.success("លុបបានជោគជ័យ")
      } catch (error) {
        toast.error("កំហុស")
      }
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រង Sponsor (Topbar Sponsors)</h1>
          <p className="text-sm text-muted-foreground KhmerOS">គ្រប់គ្រងរូបភាព Sponsor ដែលបង្ហាញនៅផ្នែកខាងលើ (បង្វិលរៀងរាល់ ២ វិនាទី)</p>
        </div>
        <Badge variant="secondary" className="w-fit text-sm py-1 px-3">
          Sponsors សកម្ម: {activeSponsorsCount} / 6
        </Badge>
      </div>

      {activeSponsorsCount >= 6 && (
        <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>ដល់ដែនកំណត់</AlertTitle>
          <AlertDescription>
            អ្នកបានបន្ថែម Sponsor ដល់ ៦ ហើយ។ ប្រសិនបើចង់បន្ថែមទៀត សូមបិទ (Inactive) Sponsor ខ្លះសិន។
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD FORM */}
        <Card className="lg:col-span-1 h-fit border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle>បន្ថែម Sponsor ថ្មី</CardTitle>
            <CardDescription>រូបភាពគួរតែមានទំហំការ៉េ (ឧៈ 200x200)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ឈ្មោះក្រុមហ៊ុន Sponsor</label>
                <Input name="title" placeholder="ឧៈ ABA Bank" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">តំណភ្ជាប់ (Link URL)</label>
                <Input name="linkUrl" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">រូបភាព Logo Sponsor</label>
                <div className={cn(
                  "border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[150px] flex flex-col items-center justify-center overflow-hidden",
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
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border shadow-sm bg-white">
                      <Image src={preview} alt="Preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="size-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">ចុចទីនេះដើម្បីជ្រើសរើស Logo</p>
                    </>
                  )}
                </div>
                {fileName && (
                  <p className="text-[10px] text-muted-foreground truncate italic">
                    File: {fileName}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isUploading || activeSponsorsCount >= 6}>
                {isUploading ? "កំពុងបញ្ចូល..." : "រក្សាទុក Sponsor"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LIST TABLE */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>បញ្ជី Sponsor បច្ចុប្បន្ន</CardTitle>
            <CardDescription>Sponsor ដែលសកម្មនឹងបង្ហាញបង្វិលគ្នានៅលើ Topbar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">រូបភាព</TableHead>
                  <TableHead>ឈ្មោះក្រុមហ៊ុន</TableHead>
                  <TableHead>ស្ថានភាព</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic KhmerOS">
                      មិនទាន់មាន Sponsor នៅឡើយទេ
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="relative size-12 rounded-lg border border-border/40 overflow-hidden bg-white shadow-sm p-1">
                          <Image src={ad.imageUrl} alt={ad.title} fill className="object-contain" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-sm">{ad.title}</p>
                        {ad.linkUrl && <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{ad.linkUrl}</p>}
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleToggleStatus(ad.id, ad.active)}
                          className="focus:outline-none"
                        >
                          {ad.active ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 px-2 py-0.5">
                              <CheckCircle2 className="size-3 mr-1" /> សកម្ម (Active)
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="opacity-60 px-2 py-0.5">
                              <XCircle className="size-3 mr-1" /> មិនសកម្ម (Inactive)
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="size-4" />
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
