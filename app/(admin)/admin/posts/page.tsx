'use client'

import React from 'react'
import { 
  Edit2, 
  Trash2, 
  MoreVertical,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface StaticPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  avatar: string;
}

const posts: StaticPost[] = [
  { id: '5735', title: 'ក្រសួងពាណិជ្ជកម្មបង្ហាញពីវឌ្ឍនភាព...', category: 'ពាណិជ្ជកម្ម', date: '2026-05-04', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5734', title: 'រដ្ឋមន្រ្តីពាណិជ្ជកម្មជួបពិភាក្សា...', category: 'ពាណិជ្ជកម្ម', date: '2026-05-02', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5733', title: 'JICA ប្តេជ្ញាបន្តគាំទ្រការអភិវឌ្ឍ...', category: 'សង្គមជាតិ-សេដ្ឋកិច្ច', date: '2026-05-02', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5732', title: 'ក្រុមហ៊ុនបច្ចេកវិទ្យាថ្មីប្រកាស...', category: 'នវានុវត្តន៍-បច្ចេកវិទ្យា', date: '2026-05-02', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5731', title: 'ក្នុងករណីមានការប្រែប្រួលតម្លៃ...', category: 'សង្គមជាតិ-សេដ្ឋកិច្ច', date: '2026-05-02', author: 'ឃី ភារៈ', avatar: 'https://i.pravatar.cc/150?u=khee' },
  { id: '5730', title: 'ក្រុមហ៊ុនចិនគ្រោងវិនិយោគលើ...', category: 'ពាណិជ្ជកម្ម', date: '2026-04-30', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5729', title: 'ធនាគារ ARDB បញ្ចេញកម្ចីបន្ថែម...', category: 'ធនាគារ-ហិរញ្ញវត្ថុ', date: '2026-04-30', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5728', title: 'កម្មវិធី «សមធម៌» ថ្មីត្រូវបាន...', category: 'នវានុវត្តន៍-បច្ចេកវិទ្យា', date: '2026-04-30', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5727', title: 'ធនាគារពិភពលោកវាយតម្លៃខ្ពស់...', category: 'ធនាគារ-ហិរញ្ញវត្ថុ', date: '2026-04-29', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5726', title: 'អង្គភាព AMRO ព្យាករណ៍សេដ្ឋកិច្ច...', category: 'ធនាគារ-ហិរញ្ញវត្ថុ', date: '2026-04-29', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5725', title: 'ក្រុមហ៊ុនវៀតណាមចាប់អារម្មណ៍...', category: 'សង្គមជាតិ-សេដ្ឋកិច្ច', date: '2026-04-29', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5724', title: 'ក្រុមផលិតពោតក្រហមនៅប៉ៃលិន...', category: 'សង្គមជាតិ-សេដ្ឋកិច្ច', date: '2026-04-28', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5723', title: 'រដ្ឋមន្ត្រីក្រសួងប្រៃសណីយ៍...', category: 'នវានុវត្តន៍-បច្ចេកវិទ្យា', date: '2026-04-28', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5722', title: 'រោងចក្រកែច្នៃកៅស៊ូថ្មីនៅរតនគិរី...', category: 'ពាណិជ្ជកម្ម', date: '2026-04-28', author: 'ទូច សូរិយា', avatar: 'https://i.pravatar.cc/150?u=touch' },
  { id: '5721', title: 'ក្រសួងកសិកម្មរៀបចំកម្មវិធី...', category: 'សង្គមជាតិ-សេដ្ឋកិច្ច', date: '2026-04-28', author: 'SME News', avatar: 'https://i.pravatar.cc/150?u=sme' },
]

export default function PostListsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">បញ្ជីអត្ថបទព័ត៌មាន (Post News Lists)</h1>
          <p className="text-sm text-muted-foreground KhmerOS">អត្ថបទសរុប (Total Posts): <span className="font-bold text-foreground">5,650</span></p>
        </div>
        <Link href="/admin/create">
          <Button size="sm">
            <Plus className="size-4 mr-1.5" />
            បង្កើតថ្មី
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:max-w-xs">
              <Search className="size-4 text-muted-foreground absolute ml-3" />
              <Input placeholder="ស្វែងរកអត្ថបទ..." className="pl-9 h-9" />
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">គ្រប់ប្រភេទ (All)</SelectItem>
                  <SelectItem value="business">ពាណិជ្ជកម្ម</SelectItem>
                  <SelectItem value="tech">បច្ចេកវិទ្យា</SelectItem>
                  <SelectItem value="economy">សេដ្ឋកិច្ច</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[300px]">ចំណងជើង (Title)</TableHead>
                  <TableHead>ប្រភេទ (Category)</TableHead>
                  <TableHead>កាលបរិច្ឆេទ (Date)</TableHead>
                  <TableHead>អ្នកនិពន្ធ (Author)</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post: StaticPost) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{post.id}</TableCell>
                    <TableCell className="font-medium max-w-[400px] truncate">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-[11px] h-5">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{post.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border/50">
                          <AvatarImage src={post.avatar} alt={post.author} />
                          <AvatarFallback className="text-[10px]">{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{post.author}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon-xs" className="hover:text-primary">
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" className="hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-xs text-muted-foreground KhmerOS">
              ទំព័រទី <span className="font-medium text-foreground">1</span> នៃ <span className="font-medium text-foreground">377</span> (Page 1 of 377)
            </p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" text="មុន" className="h-8" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="h-8 w-8">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="h-8 w-8">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="h-8 w-8">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="h-8 w-8">377</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" text="បន្ទាប់" className="h-8" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
