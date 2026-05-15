'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Trash2, FileDown, BookOpen, Image as ImageIcon } from 'lucide-react'
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
import { createBook, deleteBook } from '@/app/actions/book-actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface Book {
  id: number
  title: string
  coverImage: string | null
  fileUrl: string
  createdAt: Date
}

export default function BooksClient({ initialBooks = [] }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [bookFileName, setBookFileName] = useState<string>("")

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setBookFileName(file.name)
    }
  }

  async function handleCreateBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createBook(formData)
      if (result.success && result.book) {
        setBooks([result.book as unknown as Book, ...books])
        toast.success("បន្ថែមសៀវភៅដោយជោគជ័យ")
        ;(e.target as HTMLFormElement).reset()
        setPreview(null)
        setBookFileName("")
      } else {
        toast.error(result.error || "មានបញ្ហាក្នុងការបន្ថែម")
      }
    } catch (error) {
      toast.error("មានបញ្ហាក្នុងការបន្ថែម")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("តើអ្នកចង់លុបសៀវភៅនេះមែនទេ?")) return
    
    startTransition(async () => {
      try {
        const result = await deleteBook(id)
        if (result.success) {
          setBooks(books.filter((book: Book) => book.id !== id))
          toast.success("លុបបានជោគជ័យ")
        } else {
          toast.error("កំហុស")
        }
      } catch (error) {
        toast.error("កំហុស")
      }
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រងសៀវភៅ (Book Management)</h1>
        <p className="text-sm text-muted-foreground KhmerOS">គ្រប់គ្រងសៀវភៅ និងឯកសារសម្រាប់ទាញយក</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD FORM */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>បន្ថែមសៀវភៅថ្មី</CardTitle>
            <CardDescription>បញ្ចូលព័ត៌មានសៀវភៅថ្មី</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ឈ្មោះសៀវភៅ</label>
                <Input name="title" placeholder="ឧៈ សហគ្រិនភាព" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">រូបភាពក្របសៀវភៅ (Cover)</label>
                <div className={cn(
                  "border-2 border-dashed border-border rounded-md p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[120px] flex flex-col items-center justify-center overflow-hidden",
                  preview && "border-primary/50 bg-primary/5"
                )}>
                  <input 
                    type="file" 
                    name="coverImage" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {preview ? (
                    <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden">
                      <Image src={preview} alt="Preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">ជ្រើសរើសរូបភាពក្រប</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ឯកសារសៀវភៅ (PDF/Doc)</label>
                <div className="border-2 border-dashed border-border rounded-md p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    name="bookFile" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <FileDown className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {bookFileName ? bookFileName : "ជ្រើសរើសឯកសារ PDF"}
                  </p>
                </div>
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
            <CardTitle>បញ្ជីសៀវភៅ</CardTitle>
            <CardDescription>គ្រប់គ្រងសៀវភៅដែលមានស្រាប់</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ក្រប</TableHead>
                  <TableHead>ឈ្មោះសៀវភៅ</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      មិនទាន់មានសៀវភៅនៅឡើយទេ
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="relative w-12 aspect-[3/4] rounded border overflow-hidden bg-muted">
                          {book.coverImage ? (
                            <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                          ) : (
                            <BookOpen className="size-6 m-auto absolute inset-0 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{book.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/api/download?url=${encodeURIComponent(book.fileUrl)}&name=${encodeURIComponent(book.title)}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon-xs">
                              <FileDown className="size-3.5" />
                            </Button>
                          </a>
                          <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(book.id)}
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
