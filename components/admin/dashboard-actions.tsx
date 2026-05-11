'use client'

import React, { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { ListFilter, RefreshCcw, Loader2, Download } from 'lucide-react'
import { refreshDashboard } from '@/app/actions/post-actions'
import { useRouter } from 'next/navigation'

interface DashboardActionsProps {
  data: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalCategories: number
    totalAuthors: number
    categoryData: any[]
    authorData: any[]
    monthlyData: any[]
    topPosts: any[]
    recentPosts: any[]
  }
}

export function DashboardActions({ data }: DashboardActionsProps) {
  const [isRefreshing, startRefresh] = useTransition()
  const router = useRouter()

  function handleRefresh() {
    startRefresh(async () => {
      await refreshDashboard()
      router.refresh()
    })
  }

  function handleExport() {
    // Build CSV content
    const lines: string[] = []

    // Summary
    lines.push('=== ស្ថិតិសរុប ===')
    lines.push(`ចំនួនអត្ថបទសរុប,${data.totalPosts}`)
    lines.push(`បានផ្សព្វផ្សាយ,${data.publishedPosts}`)
    lines.push(`សេចក្ដីព្រាង,${data.draftPosts}`)
    lines.push(`ចំនួនមើលសរុប,${data.totalViews}`)
    lines.push(`ចំនួនប្រភេទ,${data.totalCategories}`)
    lines.push(`ចំនួនអ្នកនិពន្ធ,${data.totalAuthors}`)
    lines.push('')

    // Category breakdown
    lines.push('=== ប្រភេទអត្ថបទ ===')
    lines.push('ប្រភេទ,ចំនួនអត្ថបទ')
    data.categoryData.forEach((cat: any) => {
      lines.push(`${cat.name},${cat.value}`)
    })
    lines.push('')

    // Author breakdown
    lines.push('=== អ្នកនិពន្ធ ===')
    lines.push('ឈ្មោះ,ចំនួនអត្ថបទ')
    data.authorData.forEach((author: any) => {
      lines.push(`${author.name},${author.articles}`)
    })
    lines.push('')

    // Monthly trend
    lines.push('=== និន្នាការប្រចាំខែ ===')
    lines.push('ខែ,ឆ្នាំ,ចំនួនអត្ថបទ')
    data.monthlyData.forEach((m: any) => {
      lines.push(`${m.month},${m.year},${m.posts}`)
    })
    lines.push('')

    // Top viewed
    lines.push('=== អត្ថបទដែលមានអ្នកអានច្រើនបំផុត ===')
    lines.push('ចំណាត់ថ្នាក់,ចំណងជើង,ចំនួនមើល,ប្រភេទ,អ្នកនិពន្ធ')
    data.topPosts.forEach((post: any, i: number) => {
      lines.push(`${i + 1},"${post.title}",${post.viewCount},${post.category?.name || ''},${post.author?.name || ''}`)
    })

    // Download
    const BOM = '\uFEFF'
    const csv = BOM + lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smenews-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button size="sm" variant="outline" onClick={handleExport}>
        <Download className="size-3.5 mr-1.5" />
        Export CSV
      </Button>
      <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        {isRefreshing ? (
          <Loader2 className="size-3.5 mr-1.5 animate-spin" />
        ) : (
          <RefreshCcw className="size-3.5 mr-1.5" />
        )}
        {isRefreshing ? 'កំពុងផ្ទុក...' : 'Refresh Data'}
      </Button>
    </div>
  )
}
