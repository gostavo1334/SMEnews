'use client'

import React from 'react'
import { 
  FileText, 
  Eye, 
  Heart, 
  TrendingUp,
  CalendarIcon,
  BookOpen,
  ListFilter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DatePicker } from '@/components/ui/date-picker'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'

// ── MOCK DATA ──────────────────────────────────────────────

const monthlyArticles = [
  { month: 'មករា', count: 420 },
  { month: 'កុម្ភៈ', count: 380 },
  { month: 'មីនា', count: 510 },
  { month: 'មេសា', count: 470 },
  { month: 'ឧសភា', count: 590 },
  { month: 'មិថុនា', count: 650 },
  { month: 'កក្កដា', count: 520 },
  { month: 'សីហា', count: 610 },
  { month: 'កញ្ញា', count: 490 },
  { month: 'តុលា', count: 430 },
  { month: 'វិច្ឆិកា', count: 380 },
  { month: 'ធ្នូ', count: 450 },
]

const authorArticles = [
  { name: 'ចាន់ ធីតា', articles: 342 },
  { name: 'ស៊ុយ ហេង', articles: 289 },
  { name: 'លី ហួរ', articles: 256 },
  { name: 'សុខា ម៉ានី', articles: 198 },
  { name: 'វណ្ណ ដារា', articles: 167 },
  { name: 'ម៉េង សុផា', articles: 145 },
]

const categoryData = [
  { name: 'សេដ្ឋកិច្ច', value: 1250, fill: 'oklch(0.45 0.15 250)' },
  { name: 'បច្ចេកវិទ្យា', value: 980, fill: 'oklch(0.55 0.12 250)' },
  { name: 'កសិកម្ម', value: 750, fill: 'oklch(0.65 0.10 250)' },
  { name: 'អាជីវកម្ម', value: 620, fill: 'oklch(0.50 0.18 220)' },
  { name: 'ទេសចរណ៍', value: 480, fill: 'oklch(0.60 0.14 200)' },
  { name: 'ហិរញ្ញវត្ថុ', value: 390, fill: 'oklch(0.70 0.08 250)' },
]

const readData = [
  { month: 'មករា', reads: 120000 },
  { month: 'កុម្ភៈ', reads: 145000 },
  { month: 'មីនា', reads: 132000 },
  { month: 'មេសា', reads: 168000 },
  { month: 'ឧសភា', reads: 189000 },
  { month: 'មិថុនា', reads: 210000 },
  { month: 'កក្កដា', reads: 195000 },
  { month: 'សីហា', reads: 225000 },
  { month: 'កញ្ញា', reads: 198000 },
  { month: 'តុលា', reads: 175000 },
  { month: 'វិច្ឆិកា', reads: 160000 },
  { month: 'ធ្នូ', reads: 182000 },
]

const vocabData = [
  { month: 'មករា', vocab: 45 },
  { month: 'កុម្ភៈ', vocab: 62 },
  { month: 'មីនា', vocab: 38 },
  { month: 'មេសា', vocab: 71 },
  { month: 'ឧសភា', vocab: 85 },
  { month: 'មិថុនា', vocab: 55 },
]

// ── CHART CONFIGS ──────────────────────────────────────────

const monthlyConfig = {
  count: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.45 0.15 250)' },
} satisfies Record<string, { label: string; color: string }>

const authorConfig = {
  articles: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.45 0.15 250)' },
} satisfies Record<string, { label: string; color: string }>

const readConfig = {
  reads: { label: 'ចំនួនអាន', color: 'oklch(0.45 0.15 250)' },
} satisfies Record<string, { label: string; color: string }>

const vocabConfig = {
  vocab: { label: 'វាក្យសព្ទ', color: 'oklch(0.55 0.12 250)' },
} satisfies Record<string, { label: string; color: string }>

// ── COMPONENT ──────────────────────────────────────────────

export default function AdminDashboard() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>(new Date())
  const [toDate, setToDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px]">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">ទិន្នន័យសរុបអត្ថបទព័ត៌មាន</h1>
          <p className="text-sm text-muted-foreground mt-1">ទិដ្ឋភាពទូទៅនៃស្ថិតិអត្ថបទ និងអ្នកអាន</p>
        </div>

        {/* DATE FILTER */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">From Date:</span>
            <DatePicker date={fromDate} setDate={setFromDate} placeholder="Start Date" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">To Date:</span>
            <DatePicker date={toDate} setDate={setToDate} placeholder="End Date" />
          </div>
          <Button size="sm">
            <ListFilter className="size-3.5 mr-1" />
            Filter
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
                <p className="text-3xl font-bold mt-1">5.7K</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="size-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+12.5%</span>
              <span className="text-xs text-muted-foreground ml-1">ធៀបនឹងខែមុន</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ចំនួនអ្នកអាន</p>
                <p className="text-3xl font-bold mt-1">1,828.8K</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="size-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+8.3%</span>
              <span className="text-xs text-muted-foreground ml-1">ធៀបនឹងខែមុន</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ចំនួនចូលចិត្ត</p>
                <p className="text-3xl font-bold mt-1">118</p>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="size-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="size-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+3.2%</span>
              <span className="text-xs text-muted-foreground ml-1">ធៀបនឹងខែមុន</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MONTHLY ARTICLES BAR CHART */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនអត្ថបទសរុបក្នុងខែនីមួយៗ</CardTitle>
            <CardDescription className="text-xs">ស្ថិតិអត្ថបទដែលបានបោះពុម្ពផ្សាយក្នុងឆ្នាំ ២០២៦</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={monthlyConfig} className="h-[280px] w-full">
              <BarChart data={monthlyArticles} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AUTHOR ARTICLES HORIZONTAL BAR */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនសរុបនៃអត្ថបទរបស់អ្នកនិពន្ធ</CardTitle>
            <CardDescription className="text-xs">អ្នកនិពន្ធដែលមានអត្ថបទច្រើនបំផុត</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={authorConfig} className="h-[280px] w-full">
              <BarChart data={authorArticles} layout="vertical" accessibilityLayer>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={11} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="articles" fill="var(--color-articles)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CATEGORY PIE CHART */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនសរុបនៃប្រភេទអត្ថបទ</CardTitle>
            <CardDescription className="text-xs">ការបែងចែកអត្ថបទតាមប្រភេទ</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={{
              value: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.45 0.15 250)' },
            }} className="h-[280px] w-full">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            {/* LEGEND */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="font-medium ml-auto">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* READS AREA CHART */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold">ចំនួនអានអត្ថបទសរុប</CardTitle>
            <CardDescription className="text-xs">ចំនួនអ្នកអានក្នុងមួយខែ</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={readConfig} className="h-[280px] w-full">
              <AreaChart data={readData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillReads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-reads)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-reads)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="reads"
                  stroke="var(--color-reads)"
                  fill="url(#fillReads)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* VOCABULARY STATS */}
      <Card>
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <CardTitle className="text-base font-bold">ទិន្នន័យសរុបវាក្យសព្ទ/សន្ទានុក្រម</CardTitle>
          </div>
          <CardDescription className="text-xs">ស្ថិតិវាក្យសព្ទដែលបានបន្ថែមក្នុង ៦ ខែចុងក្រោយ</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <ChartContainer config={vocabConfig} className="h-[200px] w-full">
            <LineChart data={vocabData} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="vocab"
                stroke="var(--color-vocab)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-vocab)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  )
}
