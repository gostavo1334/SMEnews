'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryDialog } from './category-dialog'
import { deleteCategory } from '@/app/actions/category-actions'
import { toast } from 'sonner'
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

interface Category {
  id: number
  name: string
  slug: string
  parentId?: number | null
  parent?: { name: string } | null
  _count?: {
    posts: number
  }
}

interface CategoryClientTableProps {
  initialCategories: Category[]
}

export function CategoryClientTable({ initialCategories }: CategoryClientTableProps) {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

  const filteredCategories = initialCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete)
        toast.success("បានលុបដោយជោគជ័យ")
      } catch (error) {
        toast.error("មិនអាចលុបបានទេ ប្រហែលជាមានអត្ថបទនៅក្នុងប្រភេទនេះ")
      } finally {
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រងប្រភេទអត្ថបទ (Manage Categories)</h1>
          <p className="text-sm text-muted-foreground KhmerOS">គ្រប់គ្រងប្រភេទព័ត៌មានសម្រាប់គេហទំព័ររបស់អ្នក</p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="size-4 mr-1.5" />
          បន្ថែមប្រភេទថ្មី
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative flex items-center gap-2 w-full md:max-w-xs">
            <Search className="size-4 text-muted-foreground absolute ml-3" />
            <Input 
              placeholder="ស្វែងរកប្រភេទ..." 
              className="pl-9 h-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>ឈ្មោះប្រភេទ (Category Name)</TableHead>
                  <TableHead>ប្រភេទមេ (Parent)</TableHead>
                  <TableHead>ស្លាកតំណភ្ជាប់ (Slug)</TableHead>
                  <TableHead>ចំនួនអត្ថបទ (Post Count)</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{cat.id}</TableCell>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>
                        {cat.parent ? (
                          <Badge variant="outline" className="font-normal text-xs bg-primary/5 border-primary/20 text-primary">
                            {cat.parent.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">មេ (Root)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{cat.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {cat._count?.posts || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 hover:text-primary"
                            onClick={() => handleEdit(cat)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 hover:text-destructive"
                            onClick={() => handleDeleteClick(cat.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      រកមិនឃើញប្រភេទឡើយ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        category={editingCategory} 
        allCategories={initialCategories}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>តើអ្នកប្រាកដថាចង់លុបឬ?</AlertDialogTitle>
            <AlertDialogDescription>
              ការលុបនេះមិនអាចត្រឡប់វិញបានទេ។ ប្រភេទនេះនឹងត្រូវលុបចេញពីប្រព័ន្ធរៀងរហូត។
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>បោះបង់</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              លុប
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
