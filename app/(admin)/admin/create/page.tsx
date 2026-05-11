'use client'

import React from 'react'
import { 
  ArrowLeft, 
  Upload, 
  Globe,
  MessageCircle, 
  Camera, 
  Share2, 
  Send, 
  Save,
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Badge } from '@/components/ui/badge'
import { createPost, getCategories, getAuthors } from '@/app/actions/post-actions'
import { TimePicker } from '@/components/ui/time-picker'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const EditorWrapper = dynamic(() => import('@/components/admin/editor-wrapper'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">កំពុងផ្ទុកកម្មវិធីសរសេរអត្ថបទ...</div>
})

export default function CreatePostPage() {
  const [postDate, setPostDate] = React.useState<Date | undefined>(new Date())
  const [tags, setTags] = React.useState<string[]>(['SME', 'Cambodia', 'Digital'])
  const [tagInput, setTagInput] = React.useState('')
  const [content, setContent] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [slug] = React.useState(() => Math.random().toString(36).substring(2, 10))
  const [metaDesc, setMetaDesc] = React.useState('')
  const [seoTitle, setSeoTitle] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDrafting, setIsDrafting] = React.useState(false)
  const [dbCategories, setDbCategories] = React.useState<{id: number, name: string}[]>([])
  const [dbAuthors, setDbAuthors] = React.useState<{id: number, name: string | null}[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [selectedAuthor, setSelectedAuthor] = React.useState('')
  const [featuredImage, setFeaturedImage] = React.useState<File | null>(null)
  const [status, setStatus] = React.useState('published')
  const [postTime, setPostTime] = React.useState('09:00')
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [shareTelegram, setShareTelegram] = React.useState(false)

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  const router = useRouter()

  React.useEffect(() => {
    getCategories().then(setDbCategories)
    getAuthors().then(setDbAuthors)
  }, [])

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '')
  }


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(newTitle)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove))
  }

  const handleSubmit = async (overrideStatus?: string) => {
    if (!title || !content) {
      toast.error('សូមបញ្ចូលចំណងជើង និងខ្លឹមសារ!')
      return
    }

    if (!selectedAuthor) {
      toast.error('សូមជ្រើសរើសអ្នកនិពន្ធ!')
      return
    }

    const finalStatus = overrideStatus || status
    if (finalStatus === 'draft') setIsDrafting(true)
    else setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('content', content)
    formData.append('seoTitle', seoTitle)
    formData.append('metaDesc', metaDesc)
    if (selectedCategory) formData.append('categoryId', selectedCategory)
    if (selectedAuthor) formData.append('authorId', selectedAuthor)
    if (featuredImage) formData.append('featuredImage', featuredImage)
    
    // Status Logic
    formData.append('published', finalStatus === 'draft' ? 'false' : 'true')
    if (postDate) {
      const combinedDate = new Date(postDate)
      const [hours, minutes] = postTime.split(':')
      combinedDate.setHours(parseInt(hours), parseInt(minutes))
      formData.append('publishedAt', combinedDate.toISOString())
    }
    if (shareTelegram) formData.append('shareTelegram', 'true')

    try {
      await createPost(formData)
      toast.success(finalStatus === 'draft' ? 'បានរក្សាទុកក្នុងព្រាងជោគជ័យ!' : 'អត្ថបទត្រូវបានរក្សាទុកដោយជោគជ័យ!')
      router.push(finalStatus === 'draft' ? '/admin/drafts' : '/admin/posts')
    } catch (error) {
      console.error(error)
      toast.error('មានបញ្ហាក្នុងការរក្សាទុក!')
    } finally {
      setIsSubmitting(false)
      setIsDrafting(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 w-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading">បង្កើតអត្ថបទថ្មី</h1>
            <p className="text-sm text-muted-foreground KhmerOS">បំពេញព័ត៌មានខាងក្រោមដើម្បីចុះផ្សាយព័ត៌មាន</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => handleSubmit('draft')} disabled={isSubmitting || isDrafting}>
            {isDrafting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            រក្សាទុកព្រាង (Save Draft)
          </Button>
          <Button size="sm" onClick={() => handleSubmit()} disabled={isSubmitting || isDrafting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            {isSubmitting ? 'កំពុងរក្សាទុក...' : status === 'scheduled' ? 'កំណត់ពេលចុះផ្សាយ' : 'បោះពុម្ពផ្សាយ'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ខ្លឹមសារអត្ថបទ</CardTitle>
              <CardDescription>បញ្ចូលចំណងជើង និងខ្លឹមសារលម្អិតនៃអត្ថបទរបស់អ្នក</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ចំណងជើងអត្ថបទ (Post Title)</Label>
                <Input 
                  id="title" 
                  placeholder="បញ្ចូលចំណងជើងនៅទីនេះ..." 
                  className="h-11 text-lg font-medium" 
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="space-y-2">
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">ខ្លឹមសារអត្ថបទ (Post Content)</Label>
                <EditorWrapper 
                  data={content} 
                  onChange={(data) => {
                    setContent(data)
                    if (!metaDesc || metaDesc.length < 5) {
                      setMetaDesc(stripHtml(data).substring(0, 160))
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>រូបភាពតំណាង (Featured Image)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group relative">
                  {featuredImage ? (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="size-16 text-primary mb-2" />
                      <p className="text-sm font-medium">{featuredImage.name}</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={(e) => {
                        e.stopPropagation()
                        setFeaturedImage(null)
                      }}>លុបចេញ</Button>
                    </div>
                  ) : (
                    <>
                      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="size-8 text-primary" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">ទម្លាក់រូបភាពនៅទីនេះ ឬ ចុចដើម្បីជ្រើសរើស</h3>
                      <p className="text-sm text-muted-foreground mb-4">រូបភាពគួរតែជាប្រភេទ JPG, PNG ឬ WEBP (អតិបរមា 5MB)</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setFeaturedImage(file)
                    }}
                    accept="image/*"
                  />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ការកំណត់ SEO (SEO Settings)</CardTitle>
              <CardDescription>កំណត់ពាក្យគន្លឹះ និងការពិពណ៌នាសម្រាប់ម៉ាស៊ីនស្វែងរក (Google)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input 
                  id="seo-title" 
                  placeholder="បញ្ចូលចំណងជើង SEO..." 
                  value={seoTitle} 
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">ចំណងជើងដែលនឹងបង្ហាញលើ Google (អតិបរមា 60 តួអក្សរ)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
                  placeholder="បញ្ចូលការពិពណ៌នាខ្លីសម្រាប់ SEO..." 
                  className="min-h-[100px]"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">ការពិពណ៌នាខ្លីដែលនឹងបង្ហាញលើ Google (150-160 តួអក្សរ)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - SETTINGS */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ការកំណត់ការចុះផ្សាយ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>ស្ថានភាព (Status)</Label>
                <Select value={status === 'draft' ? 'published' : status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសស្ថានភាព" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">បោះពុម្ពផ្សាយភ្លាមៗ</SelectItem>
                    <SelectItem value="scheduled">កំណត់ពេលវេលា</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{status === 'scheduled' ? 'ពេលវេលាចុះផ្សាយ (Schedule Time)' : 'ថ្ងៃខែឆ្នាំ និងម៉ោង (Post Date & Time)'}</Label>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    បច្ចុប្បន្ន: {currentTime.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <DatePicker date={postDate} setDate={(date) => {
                      setPostDate(date)
                      if (date && date > new Date() && status !== 'draft') {
                        setStatus('scheduled')
                      }
                    }} />
                  </div>
                  <TimePicker 
                    value={postTime}
                    onChange={setPostTime}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>អ្នកនិពន្ធ (Author)</Label>
                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសអ្នកនិពន្ធ" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbAuthors.length > 0 ? (
                      dbAuthors.map((author: any) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          <div className="flex items-center gap-2">
                            {author.image ? (
                              <img src={author.image} alt={author.name} className="size-5 rounded-full object-cover border border-border/50" />
                            ) : (
                              <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] border border-border/50">
                                {author.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <span>{author.name || 'Anonymous'}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>កំពុងផ្ទុកអ្នកនិពន្ធ...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>


              <div className="space-y-2">
                <Label>ប្រភេទអត្ថបទ (Category)</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbCategories.length > 0 ? (
                      dbCategories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>កំពុងផ្ទុកប្រភេទ...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">ស្លាក (Tags)</Label>
                <Input 
                  id="tags" 
                  placeholder="បញ្ចូលស្លាក រួចចុច Enter" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="rounded-md flex items-center gap-1 pr-1">
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ចែករំលែកទៅកាន់បណ្តាញសង្គម</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-muted-foreground" />
                  <Label htmlFor="share-web" className="font-normal cursor-pointer">Website</Label>
                </div>
                <Checkbox id="share-web" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-blue-600" />
                  <Label htmlFor="share-fb" className="font-normal cursor-pointer">Facebook</Label>
                </div>
                <Checkbox id="share-fb" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-pink-600" />
                  <Label htmlFor="share-ig" className="font-normal cursor-pointer">Instagram</Label>
                </div>
                <Checkbox id="share-ig" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Share2 className="size-4 text-sky-500" />
                  <Label htmlFor="share-tw" className="font-normal cursor-pointer">Twitter</Label>
                </div>
                <Checkbox id="share-tw" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Send className="size-4 text-blue-500" />
                  <Label htmlFor="share-tg" className="font-normal cursor-pointer">Telegram</Label>
                </div>
                <Checkbox id="share-tg" checked={shareTelegram} onCheckedChange={(v) => setShareTelegram(!!v)} />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
