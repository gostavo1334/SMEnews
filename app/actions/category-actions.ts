'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redis } from "@/lib/redis"

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
}

export async function createCategory(name: string, slug: string) {
  const category = await prisma.category.create({
    data: {
      name,
      slug
    }
  })
  
  await redis.del('home_page_data')
  revalidatePath("/admin/category")
  return category
}

export async function updateCategory(id: number, name: string, slug: string) {
  const category = await prisma.category.update({
    where: { id },
    data: { name, slug }
  })
  
  await redis.del('home_page_data')
  revalidatePath("/admin/category")
  return category
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({
    where: { id }
  })
  
  await redis.del('home_page_data')
  revalidatePath("/admin/category")
}
