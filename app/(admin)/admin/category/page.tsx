'use client'

import React from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Layers
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  { id: '1', name: 'ពាណិជ្ជកម្ម', slug: 'business', count: 1250 },
  { id: '2', name: 'សង្គមជាតិ-សេដ្ឋកិច្ច', slug: 'economy', count: 840 },
  { id: '3', name: 'នវានុវត្តន៍-បច្ចេកវិទ្យា', slug: 'tech', count: 620 },
  { id: '4', name: 'កសិកម្ម', slug: 'agriculture', count: 430 },
  { id: '5', name: 'សុខភាព', slug: 'health', count: 310 },
  { id: '6', name: 'អប់រំ', slug: 'education', count: 280 },
  { id: '7', name: 'ទេសចរណ៍', slug: 'tourism', count: 150 },
]

export default function CategoryPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រងប្រភេទអត្ថបទ (Manage Categories)</h1>
          <p className="text-sm text-muted-foreground KhmerOS">គ្រប់គ្រងប្រភេទព័ត៌មានសម្រាប់គេហទំព័ររបស់អ្នក</p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" />
          បន្ថែមប្រភេទថ្មី
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 w-full md:max-w-xs">
            <Search className="size-4 text-muted-foreground absolute ml-3" />
            <Input placeholder="ស្វែងរកប្រភេទ..." className="pl-9 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>ឈ្មោះប្រភេទ (Category Name)</TableHead>
                  <TableHead>ស្លាកតំណភ្ជាប់ (Slug)</TableHead>
                  <TableHead>ចំនួនអត្ថបទ (Post Count)</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{cat.id}</TableCell>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{cat.slug}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {cat.count}
                      </Badge>
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
        </CardContent>
      </Card>
    </div>
  )
}
