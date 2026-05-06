'use server'

import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const imageFile = formData.get("image") as File
  
  let imageUrl = ""

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "smenews/users" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })
    
    imageUrl = (uploadResponse as any).secure_url
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      image: imageUrl
    }
  })

  revalidatePath("/admin/users")
  return user
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      id: 'desc'
    }
  })
}

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id }
  })
  revalidatePath("/admin/users")
}

export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const imageFile = formData.get("image") as File
  
  let data: any = { name, email }

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "smenews/users" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })
    
    data.image = (uploadResponse as any).secure_url
  }

  const user = await prisma.user.update({
    where: { id },
    data
  })

  revalidatePath("/admin/users")
  return user
}
