import { 
  FileText, 
  Eye, 
  TrendingUp,
  Users,
  Layers,
  BookCheck,
  FileEdit,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { DashboardActions } from '@/components/admin/dashboard-actions'
import { getDashboardData } from '@/app/actions/post-actions'

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = [
    { label: 'ចំនួនអត្ថបទសរុប', value: data.totalPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', note: 'ពីមូលដ្ឋានទិន្នន័យ' },
    { label: 'បានផ្សព្វផ្សាយ', value: data.publishedPosts, icon: BookCheck, color: 'text-green-500', bg: 'bg-green-500/10', note: `${data.totalPosts > 0 ? Math.round((data.publishedPosts / data.totalPosts) * 100) : 0}% នៃសរុប` },
    { label: 'សេចក្ដីព្រាង', value: data.draftPosts, icon: FileEdit, color: 'text-amber-500', bg: 'bg-amber-500/10', note: 'រង់ចាំការផ្សព្វផ្សាយ' },
    { label: 'ចំនួនមើលសរុប', value: data.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10', note: 'គ្រប់អត្ថបទ' },
    { label: 'ចំនួនប្រភេទ', value: data.totalCategories, icon: Layers, color: 'text-cyan-500', bg: 'bg-cyan-500/10', note: 'គ្រប់គ្រងក្នុងផ្នែកប្រភេទ' },
    { label: 'ចំនួនអ្នកនិពន្ធ', value: data.totalAuthors, icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10', note: 'អ្នករួមចំណែក' },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px]">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">ទិន្នន័យសរុបអត្ថបទព័ត៌មាន</h1>
          <p className="text-sm text-muted-foreground mt-1">ទិដ្ឋភាពទូទៅនៃស្ថិតិអត្ថបទ និងអ្នកនិពន្ធពិតប្រាកដ</p>
        </div>

        {/* ACTIONS */}
        <DashboardActions data={data} />
      </div>

      {/* STATS CARDS - 6 cards in a grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`size-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`size-4.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{stat.label}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-[9px] text-muted-foreground">{stat.note}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <DashboardCharts data={data} />

    </div>
  )
}
