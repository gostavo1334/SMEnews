'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-8xl font-bold text-primary/20 select-none">404</p>
      <h1 className="text-2xl font-semibold text-foreground">រកមិនឃើញទំព័រ</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ប្តូរ។
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        <ArrowLeft className="size-4" />
        ត្រលប់ទៅទំព័រដើម
      </Link>
    </div>
  )
}
