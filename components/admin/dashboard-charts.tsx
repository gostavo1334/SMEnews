'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Eye, TrendingUp, Clock } from 'lucide-react'

interface DashboardChartsProps {
  data: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    categoryData: any[]
    authorData: any[]
    monthlyData: any[]
    topPosts: any[]
    recentPosts: any[]
  }
}

const authorConfig = {
  articles: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.65 0.18 250)' },
}

const monthlyConfig = {
  posts: { label: 'អត្ថបទ', color: 'oklch(0.65 0.18 250)' },
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  // Radial data for published/draft
  const publishedPct = data.totalPosts > 0 ? Math.round((data.publishedPosts / data.totalPosts) * 100) : 0
  const draftPct = data.totalPosts > 0 ? Math.round((data.draftPosts / data.totalPosts) * 100) : 0

  const radialData = [
    { name: 'បានផ្សព្វផ្សាយ', value: publishedPct, fill: 'oklch(0.65 0.2 145)' },
    { name: 'សេចក្ដីព្រាង', value: draftPct, fill: 'oklch(0.65 0.2 30)' },
  ]

  return (
    <div className="space-y-6">

      {/* ROW 1: Monthly Trend + Published/Draft Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MONTHLY TREND - AREA CHART (spans 2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              និន្នាការអត្ថបទប្រចាំខែ
            </CardTitle>
            <CardDescription className="text-xs">ចំនួនអត្ថបទដែលបង្កើតក្នុង ១២ ខែចុងក្រោយ</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {data.monthlyData.length > 0 ? (
              <ChartContainer config={monthlyConfig} className="h-[280px] w-full">
                <AreaChart data={data.monthlyData}>
                  <defs>
                    <linearGradient id="gradientPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="posts"
                    stroke="oklch(0.65 0.18 250)"
                    strokeWidth={2.5}
                    fill="url(#gradientPosts)"
                    dot={{ r: 3, fill: 'oklch(0.65 0.18 250)', stroke: 'var(--background)', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                មិនទាន់មានទិន្នន័យ
              </div>
            )}
          </CardContent>
        </Card>

        {/* PUBLISHED vs DRAFT RADIAL */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ស្ថានភាពអត្ថបទ</CardTitle>
            <CardDescription className="text-xs">សមាមាត្រផ្សព្វផ្សាយ / សេចក្ដីព្រាង</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex flex-col items-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="40%"
                  outerRadius="90%"
                  barSize={16}
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.2 145)' }} />
                <div className="text-xs">
                  <span className="text-muted-foreground">ផ្សព្វផ្សាយ</span>
                  <span className="font-bold ml-1.5">{data.publishedPosts}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.2 30)' }} />
                <div className="text-xs">
                  <span className="text-muted-foreground">ព្រាង</span>
                  <span className="font-bold ml-1.5">{data.draftPosts}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: Category Pie + Author Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CATEGORY PIE CHART */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនសរុបនៃប្រភេទអត្ថបទ</CardTitle>
            <CardDescription className="text-xs">ការបែងចែកអត្ថបទតាមប្រភេទពិតប្រាកដ</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {data.categoryData.length > 0 ? (
              <>
                <ChartContainer config={{
                  value: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.65 0.18 250)' },
                }} className="h-[280px] w-full">
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      strokeWidth={2}
                      stroke="var(--background)"
                      paddingAngle={2}
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {data.categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <div className="size-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.fill }} />
                      <span className="text-muted-foreground truncate">{cat.name}</span>
                      <span className="font-medium ml-auto">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                មិនទាន់មានទិន្នន័យអត្ថបទនៅឡើយទេ
              </div>
            )}
          </CardContent>
        </Card>

        {/* AUTHOR ARTICLES HORIZONTAL BAR */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនសរុបនៃអត្ថបទរបស់អ្នកនិពន្ធ</CardTitle>
            <CardDescription className="text-xs">អ្នកនិពន្ធ ៨ នាក់ដែលមានអត្ថបទច្រើនបំផុត</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
             {data.authorData.length > 0 ? (
                <ChartContainer config={authorConfig} className="h-[340px] w-full">
                  <BarChart data={data.authorData} layout="vertical">
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="oklch(0.55 0.18 250)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.18 200)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={10} width={100} tick={{ fill: 'var(--muted-foreground)' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="articles" fill="url(#gradientBar)" radius={[0, 6, 6, 0]} barSize={22} />
                  </BarChart>
                </ChartContainer>
             ) : (
                <div className="h-[340px] flex items-center justify-center text-muted-foreground text-sm">
                  មិនទាន់មានទិន្នន័យអ្នកនិពន្ធនៅឡើយទេ
                </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Top Viewed Posts + Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TOP VIEWED POSTS */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              អត្ថបទដែលមានអ្នកអានច្រើនបំផុត
            </CardTitle>
            <CardDescription className="text-xs">ចំណាត់ថ្នាក់តាមចំនួនមើល</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-3">
              {data.topPosts.map((post: any, i: number) => (
                <div key={post.id} className="flex items-start gap-3 group">
                  <div className={`size-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-500/15 text-yellow-600' :
                    i === 1 ? 'bg-zinc-400/15 text-zinc-500' :
                    i === 2 ? 'bg-orange-500/15 text-orange-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {post.category?.name && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{post.category.name}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">{post.author?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Eye className="size-3" />
                    <span className="font-medium">{post.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {data.topPosts.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">មិនមានទិន្នន័យ</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RECENT POSTS */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              អត្ថបទថ្មីៗបំផុត
            </CardTitle>
            <CardDescription className="text-xs">អត្ថបទ ៥ ចុងក្រោយដែលបានបង្កើត</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-3">
              {data.recentPosts.map((post: any) => (
                <div key={post.id} className="flex items-start gap-3 group">
                  <div className={`size-2 rounded-full mt-2 flex-shrink-0 ${post.published ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {post.category?.name && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{post.category.name}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>
                        {new Date(post.createdAt).toLocaleDateString('km-KH')}
                      </span>
                      <Badge variant={post.published ? "default" : "outline"} className="text-[9px] px-1.5 py-0 h-4">
                        {post.published ? 'ផ្សព្វផ្សាយ' : 'ព្រាង'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {data.recentPosts.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">មិនមានទិន្នន័យ</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
