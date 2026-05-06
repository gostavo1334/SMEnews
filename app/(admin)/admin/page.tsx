import React from 'react'
import { 
  FileText, 
  Eye, 
  Heart, 
  TrendingUp,
  BookOpen,
  ListFilter,
  Users,
  Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { getDashboardData } from '@/app/actions/post-actions'

// ── CHART CONFIGS ──────────────────────────────────────────

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px]">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">ទិន្នន័យសរុបអត្ថបទព័ត៌មាន</h1>
          <p className="text-sm text-muted-foreground mt-1">ទិដ្ឋភាពទូទៅនៃស្ថិតិអត្ថបទ និងអ្នកនិពន្ធពិតប្រាកដ</p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" variant="outline">
            <ListFilter className="size-3.5 mr-1" />
            Export Report
          </Button>
          <Button size="sm">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ចំនួនអត្ថបទសរុប</p>
                <p className="text-3xl font-bold mt-1">{data.totalPosts}</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="size-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Real-time</span>
              <span className="text-xs text-muted-foreground ml-1">ពីមូលដ្ឋានទិន្នន័យ</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ចំនួនប្រភេទសរុប</p>
                <p className="text-3xl font-bold mt-1">{data.totalCategories}</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs text-muted-foreground">គ្រប់គ្រងក្នុងផ្នែកប្រភេទ</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ចំនួនអ្នកនិពន្ធ</p>
                <p className="text-3xl font-bold mt-1">{data.totalAuthors}</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs text-muted-foreground">អ្នករួមចំណែកក្នុងគេហទំព័រ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW */}
      <DashboardCharts data={data} />

    </div>
  )
}
