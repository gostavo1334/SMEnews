import React from 'react'
import { getCategories } from '@/app/actions/category-actions'
import { CategoryClientTable } from '@/components/admin/category-client-table'

export default async function CategoryPage() {
  const categories = await getCategories()

  return (
    <div className="p-6 md:p-8 space-y-6">
      <CategoryClientTable initialCategories={categories} />
    </div>
  )
}
