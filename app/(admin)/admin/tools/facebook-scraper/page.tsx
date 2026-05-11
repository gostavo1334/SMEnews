'use client'

import * as React from "react"
import { format } from "date-fns"
import { 
  Search, 
  RefreshCcw, 
  MessageSquare,
  Globe,
  Clock,
  User,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { scrapeFacebookComments, type Comment } from "@/app/actions/scraper-actions"

export default function FacebookScraperPage() {
  const [url, setUrl] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [comments, setComments] = React.useState<Comment[]>([])

  const handleScrape = async () => {
    if (!url) return toast.error("Enter URL")
    setIsLoading(true)
    try {
      const result = await scrapeFacebookComments(url)
      if (result.success && result.data) {
        setComments(result.data)
        toast.success("Done")
      } else {
        toast.error(result.error || "Error")
      }
    } catch (e) {
      toast.error("Failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (comments.length === 0) return toast.error("No data to export")
    
    const headers = ["ID", "Author", "Comment", "Likes", "Timestamp"]
    const rows = comments.map(c => [
      c.id,
      `"${c.authorName.replace(/"/g, '""')}"`,
      `"${c.content.replace(/"/g, '""')}"`,
      c.likes,
      c.timestamp
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `fb-comments-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Exported to CSV")
  }

  const totalLikes = comments.reduce((sum, c) => sum + c.likes, 0)

  return (
    <div className="flex flex-col gap-8 p-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Facebook Scraper
          </h1>
          <p className="text-muted-foreground">
            Extract data and comments from Facebook posts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Badge>
        </div>
      </div>

      <Separator />

      {/* INPUT */}
      <Card>
        <CardHeader>
          <CardTitle>Scrape</CardTitle>
          <CardDescription>Enter post URL below.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Post URL</FieldLabel>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://facebook.com/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleScrape} disabled={isLoading}>
                  {isLoading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                  Scrape
                </Button>
              </div>
              <FieldDescription>Public posts only.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* RESULTS */}
      {comments.length > 0 ? (
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Results ({comments.length})
            </h2>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => setComments([])}>
                 Clear
               </Button>
               <Button size="sm" onClick={handleExport}>
                 <FileSpreadsheet className="mr-2 h-4 w-4" />
                 Export
               </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableCaption>Extracted Facebook comments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.authorAvatar} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.authorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{c.content}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {(() => {
                          const d = new Date(c.timestamp)
                          return isNaN(d.getTime()) ? c.timestamp : format(d, "MMM dd, HH:mm")
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{c.likes}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">{totalLikes}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>
      ) : (
        !isLoading && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Globe />
              </EmptyMedia>
              <EmptyTitle>No Results</EmptyTitle>
              <EmptyDescription>Paste a link to start.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
      )}
    </div>
  )
}
