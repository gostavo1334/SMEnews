'use server'

import { getDb } from "@/lib/prisma"
import { utapi } from "@/lib/uploadthing"
import { revalidatePath } from "next/cache"
import { Book } from "@/types/prisma"

export async function createBook(formData: FormData) {
  const db = getDb();
  
  try {
    const title = formData.get("title") as string
    const coverImageFile = formData.get("coverImage") as File
    const bookFile = formData.get("bookFile") as File

    let coverImageUrl = ""
    let fileUrl = ""

    // Upload cover image
    if (coverImageFile && coverImageFile.size > 0) {
      const response = await utapi.uploadFiles(coverImageFile)
      if (response.data) {
        coverImageUrl = response.data.url
      }
    }

    // Upload PDF file
    if (bookFile && bookFile.size > 0) {
      const response = await utapi.uploadFiles(bookFile)
      if (response.data) {
        fileUrl = response.data.url
      }
    }

    const book = await (db as any).book.create({
      data: {
        title,
        coverImage: coverImageUrl,
        fileUrl,
      }
    })

    revalidatePath("/admin/books")
    revalidatePath("/downloads")
    return { success: true, book }
  } catch (error: any) {
    console.error("[createBook] Error:", error)
    return { success: false, error: error.message || "Failed to create book" }
  }
}

export async function getBooks() {
  const db = getDb();
  const p = db as any;
  if (!p.book) {
    console.error("CRITICAL: prisma.book is missing from client. Try restarting dev server.");
    return [];
  }
  return await p.book.findMany({
    orderBy: { createdAt: 'desc' }
  }) as Book[]
}

export async function deleteBook(id: number) {
  const db = getDb();
  try {
    await (db as any).book.delete({ where: { id } })
    revalidatePath("/admin/books")
    revalidatePath("/downloads")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete book" }
  }
}
