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
  X
} from 'lucide-react'
import dynamic from 'next/dynamic'
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), { ssr: false })
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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
import { Separator } from '@/components/ui/separator'

class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ default: reader.result });
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    }));
  }
  abort() {}
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

export default function CreatePostPage() {
  const [postDate, setPostDate] = React.useState<Date | undefined>(new Date())
  const [tags, setTags] = React.useState<string[]>(['SME', 'Cambodia', 'Digital'])
  const [tagInput, setTagInput] = React.useState('')
  const [content, setContent] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [metaDesc, setMetaDesc] = React.useState('')
  const [seoTitle, setSeoTitle] = React.useState('')

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return ""
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
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
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1200px]">
      
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
          <Button variant="outline" size="sm">
            រក្សាទុកព្រាង
          </Button>
          <Button size="sm">
            <Save className="size-4 mr-2" />
            បោះពុម្ពផ្សាយ
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
                <Label htmlFor="slug">ស្លាកតំណភ្ជាប់ (Permalink / Slug)</Label>
                <div className="flex items-center">
                  <div className="bg-muted px-3 h-9 flex items-center border border-r-0 rounded-l-md text-xs text-muted-foreground">
                    smenews.com.kh/news/
                  </div>
                  <Input 
                    id="slug" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-l-none h-9 text-xs" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">ខ្លឹមសារអត្ថបទ (Post Content)</Label>
                <div className="min-h-[400px] prose prose-sm dark:prose-invert max-w-none">
                  <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(_event, editor) => {
                      const data = editor.getData()
                      setContent(data)
                      // Auto-generate meta description if empty
                      if (!metaDesc || metaDesc.length < 5) {
                        const plainText = stripHtml(data)
                        setMetaDesc(plainText.substring(0, 160))
                      }
                    }}
                    config={{
                      placeholder: 'សរសេរខ្លឹមសារអត្ថបទរបស់អ្នកនៅទីនេះ...',
                      extraPlugins: [MyCustomUploadAdapterPlugin],
                      toolbar: [
                        'heading', '|', 
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 
                        'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 
                        'undo', 'redo'
                      ],
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>រូបភាពតំណាង (Featured Image)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="size-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-1">ទម្លាក់រូបភាពនៅទីនេះ ឬ ចុចដើម្បីជ្រើសរើស</h3>
                <p className="text-sm text-muted-foreground mb-4">រូបភាពគួរតែជាប្រភេទ JPG, PNG ឬ WEBP (អតិបរមា 5MB)</p>
                <Button variant="outline" size="sm">
                  ជ្រើសរើសឯកសារ
                </Button>
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
              <CardTitle>ព័ត៌មានបន្ថែម</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>អ្នកនិពន្ធ (Author)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសអ្នកនិពន្ធ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chan">ចាន់ ធីតា</SelectItem>
                    <SelectItem value="suy">ស៊ុយ ហេង</SelectItem>
                    <SelectItem value="ly">លី ហួរ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>កាលបរិច្ឆេទ (Post Date)</Label>
                <DatePicker date={postDate} setDate={setPostDate} />
              </div>

              <div className="space-y-2">
                <Label>ប្រភេទអត្ថបទ (Category)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">បច្ចេកវិទ្យា</SelectItem>
                    <SelectItem value="business">អាជីវកម្ម</SelectItem>
                    <SelectItem value="economy">សេដ្ឋកិច្ច</SelectItem>
                    <SelectItem value="agriculture">កសិកម្ម</SelectItem>
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
                  {tags.map(tag => (
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
                <Checkbox id="share-tg" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
