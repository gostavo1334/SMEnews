'use client'

import React from 'react'
import { 
  Edit2, 
  Trash2, 
  Search,
  Clock,
  Save,
  Upload,
  Loader2,
  Send
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { getScheduledPosts, deletePost, updatePost, getCategories, getAuthors, publishPostNow } from '@/app/actions/post-actions'
import { PostWithRelations, Category, User } from '@/types/prisma'
import { toast } from 'sonner'

const EditorWrapper = dynamic(() => import('@/components/admin/editor-wrapper'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">កំពុងផ្ទុក...</div>
})

export default function SchedulePage() {
  const [posts, setPosts] = React.useState<PostWithRelations[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  
  // Edit State
  const [editingPost, setEditingPost] = React.useState<PostWithRelations | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [editContent, setEditContent] = React.useState('')
  const [editCategory, setEditCategory] = React.useState('')
  const [editAuthor, setEditAuthor] = React.useState('')
  const [editDate, setEditDate] = React.useState<Date | undefined>(new Date())
  const [editTime, setEditTime] = React.useState('09:00')
  const [editFeaturedImage, setEditFeaturedImage] = React.useState<File | null>(null)
  const [editSeoTitle, setEditSeoTitle] = React.useState('')
  const [editMetaDesc, setEditMetaDesc] = React.useState('')
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState<number | null>(null)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Delete State
  const [deletingPost, setDeletingPost] = React.useState<PostWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // DB Data
  const [dbCategories, setDbCategories] = React.useState<Category[]>([])
  const [dbAuthors, setDbAuthors] = React.useState<User[]>([])

  const fetchPosts = async () => {
    setLoading(true)
    const scheduled = await getScheduledPosts() as PostWithRelations[]
    setPosts(scheduled)
    setLoading(false)
  }

  React.useEffect(() => {
    fetchPosts()
    getCategories().then(setDbCategories)
    getAuthors().then(setDbAuthors)
  }, [])

  const handleEditClick = (post: PostWithRelations) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditContent(post.content || '')
    setEditCategory(post.categoryId?.toString() || '')
    setEditAuthor(post.authorId?.toString() || '')
    const pDate = new Date(post.publishedAt)
    setEditDate(pDate)
    setEditTime(`${pDate.getHours().toString().padStart(2, '0')}:${pDate.getMinutes().toString().padStart(2, '0')}`)
    setEditSeoTitle(post.seoTitle || '')
    setEditMetaDesc(post.metaDesc || '')
    setEditFeaturedImage(null)
  }

  const handleUpdate = async (overrideStatus?: string) => {
    if (!editingPost) return
    setIsUpdating(true)

    const formData = new FormData()
    formData.append('title', editTitle)
    formData.append('content', editContent)
    if (editCategory) formData.append('categoryId', editCategory)
    if (editAuthor) formData.append('authorId', editAuthor)
    formData.append('seoTitle', editSeoTitle)
    formData.append('metaDesc', editMetaDesc)
    formData.append('published', overrideStatus === 'draft' ? 'false' : 'true')
    if (editDate) {
      const combinedDate = new Date(editDate)
      const [hours, minutes] = editTime.split(':')
      combinedDate.setHours(parseInt(hours), parseInt(minutes))
      formData.append('publishedAt', combinedDate.toISOString())
    }
    if (editFeaturedImage) formData.append('featuredImage', editFeaturedImage)

    try {
      await updatePost(editingPost.id, formData)
      toast.success(overrideStatus === 'draft' ? 'ប្តូរទៅព្រាងជោគជ័យ!' : 'កែប្រែជោគជ័យ!')
      setEditingPost(null)
      fetchPosts()
    } catch (error) {
      toast.error('ប្រតិបត្តិការបរាជ័យ!')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePublishNow = async (id: number) => {
    setIsPublishing(id)
    try {
      await publishPostNow(id)
      toast.success('បោះពុម្ពផ្សាយជោគជ័យ!')
      fetchPosts()
    } catch (error) {
      toast.error('ការបោះពុម្ពផ្សាយបរាជ័យ!')
    } finally {
      setIsPublishing(null)
    }
  }

  const handleDelete = async () => {
    if (!deletingPost) return
    setIsDeleting(true)
    try {
      await deletePost(deletingPost.id)
      toast.success('លុបជោគជ័យ!')
      setDeletingPost(null)
      fetchPosts()
    } catch (error) {
      toast.error('លុបបរាជ័យ!')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <Clock className="size-6 text-blue-500" />
            អត្ថបទកំណត់ពេលវេលា (Scheduled Posts)
          </h1>
          <p className="text-sm text-muted-foreground KhmerOS">អត្ថបទកំពុងរង់ចាំចុះផ្សាយ: <span className="font-bold text-foreground">{posts.length}</span></p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:max-w-xs relative">
              <Search className="size-4 text-muted-foreground absolute left-3" />
              <Input 
                placeholder="ស្វែងរកអត្ថបទ..." 
                className="pl-9 h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[300px]">ចំណងជើង</TableHead>
                  <TableHead>ពេលវេលាចុះផ្សាយ</TableHead>
                  <TableHead>ប្រភេទ</TableHead>
                  <TableHead>អ្នកនិពន្ធ</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">កំពុងផ្ទុក...</TableCell></TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">មិនមានអត្ថបទកំណត់ពេលទេ</TableCell></TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">#{post.id}</TableCell>
                      <TableCell className="font-medium max-w-[350px] truncate">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 gap-1 font-normal">
                          <Clock className="size-3" /> 
                          {new Date(post.publishedAt).toLocaleString('km-KH')}
                        </Badge>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="font-normal text-[11px] h-5">{post.category?.name || 'General'}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6 border border-border/50">
                            <AvatarImage src={post.author?.image || ""} />
                            <AvatarFallback className="text-[10px]">{post.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate max-w-[100px]">{post.author?.name || 'Anonymous'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="hover:text-green-600" 
                            title="Publish Now" 
                            onClick={() => handlePublishNow(post.id)}
                            disabled={isPublishing === post.id}
                          >
                            {isPublishing === post.id ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon-xs" className="hover:text-primary" onClick={() => handleEditClick(post)}>
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-xs" className="hover:text-destructive" onClick={() => setDeletingPost(post)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[96vw] w-[1400px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>កែប្រែការកំណត់ពេល</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2"><Label>ចំណងជើង</Label><Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label>ខ្លឹមសារ</Label><div className="border rounded-md min-h-[500px]"><EditorWrapper data={editContent} onChange={setEditContent} /></div></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>ពេលវេលាចុះផ្សាយ (Date & Time)</Label>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    បច្ចុប្បន្ន: {currentTime.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <DatePicker date={editDate} setDate={setEditDate} />
                  </div>
                  <TimePicker 
                    value={editTime}
                    onChange={setEditTime}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ប្រភេទ</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{dbCategories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>អ្នកនិពន្ធ</Label>
                  <Select value={editAuthor} onValueChange={setEditAuthor}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {dbAuthors.map(a => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          <div className="flex items-center gap-2">
                            {a.image ? (
                              <img src={a.image} alt={a.name || ''} className="size-5 rounded-full object-cover border border-border/50" />
                            ) : (
                              <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] border border-border/50">
                                {a.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <span>{a.name || 'Anonymous'}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>SEO Title</Label><Input value={editSeoTitle} onChange={(e) => setEditSeoTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={editMetaDesc} onChange={(e) => setEditMetaDesc(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingPost(null)}>បោះបង់</Button>
            <Button variant="secondary" onClick={() => handleUpdate('draft')} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              ប្តូរទៅព្រាង (Move to Draft)
            </Button>
            <Button variant="ghost" onClick={async () => { if (editingPost) { await handlePublishNow(editingPost.id); setEditingPost(null); } }} disabled={isPublishing === (editingPost?.id || -1)}>
               {isPublishing === (editingPost?.id || -1) ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
               បោះពុម្ពផ្សាយភ្លាមៗ (Publish Now)
            </Button>
            <Button onClick={() => handleUpdate()} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
              រក្សាទុកការកំណត់ពេល (Save Schedule)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>លុបការកំណត់ពេល?</AlertDialogTitle><AlertDialogDescription>អត្ថបទ "{deletingPost?.title}" នឹងត្រូវបានលុប។</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>បោះបង់</AlertDialogCancel><AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} className="bg-destructive" disabled={isDeleting}>{isDeleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />}លុប</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
