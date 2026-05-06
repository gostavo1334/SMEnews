'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
} from 'recharts'

interface DashboardChartsProps {
  data: {
    categoryData: any[]
    authorData: any[]
  }
}

const authorConfig = {
  articles: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.45 0.15 250)' },
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
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
                value: { label: 'ចំនួនអត្ថបទ', color: 'oklch(0.45 0.15 250)' },
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
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                    <span className="text-muted-foreground">{cat.name}</span>
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
          <CardDescription className="text-xs">អ្នកនិពន្ធដែលមានអត្ថបទច្រើនបំផុត</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
           {data.authorData.length > 0 ? (
              <ChartContainer config={authorConfig} className="h-[280px] w-full">
                <BarChart data={data.authorData} layout="vertical">
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={11} width={90} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="articles" fill="var(--color-articles)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
           ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                មិនទាន់មានទិន្នន័យអ្នកនិពន្ធនៅឡើយទេ
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
