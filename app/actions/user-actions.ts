'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/hash';
import { revalidatePath } from 'next/cache';
import { redis } from '@/lib/redis';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role.toLowerCase() !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function getUsers() {
  await checkAdmin();
  try {
    return await prisma.user.findMany({
      orderBy: { username: 'asc' } as any,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        image: true,
        _count: {
          select: { posts: true }
        }
      }
    });
  } catch (error) {
    console.error("Prisma error, likely stale client:", error);
    // Fallback to sorting by id if username field is not yet recognized by runtime
    return await prisma.user.findMany({
      orderBy: { id: 'asc' } as any,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: { posts: true }
        }
      } as any
    });
  }
}

export async function createUser(formData: FormData) {
  await checkAdmin();
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;
  const email = formData.get('email') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'smenews/users' }, (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });
    imageUrl = (uploadResponse as any).secure_url;
  }

  let user;
  try {
    user = await prisma.user.create({
      data: {
        username,
        name,
        role,
        email: email || undefined,
        password: hashPassword(password),
        image: imageUrl || undefined,
      }
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('ឈ្មោះអ្នកប្រើប្រាស់នេះមានរួចហើយ (Username already exists)!');
    }
    console.error("Prisma error in createUser:", error);
    throw new Error('មិនអាចបង្កើតអ្នកប្រើប្រាស់បានទេ');
  }
  await redis.del('all_authors');
  revalidatePath('/admin/users');
  return user;
}

export async function updateUser(formData: FormData) {
  await checkAdmin();
  const id = parseInt(formData.get('id') as string);
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;
  const email = formData.get('email') as string;
  const imageFile = formData.get('image') as File;

  const data: any = {
    username,
    name,
    role,
    email: email || undefined,
  };

  if (password && password.trim() !== "") {
    data.password = hashPassword(password);
  }

  if (imageFile && imageFile.size > 0) {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'smenews/users' }, (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });
    data.image = (uploadResponse as any).secure_url;
  }

  let user;
  try {
    user = await prisma.user.update({
      where: { id },
      data
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('ឈ្មោះអ្នកប្រើប្រាស់នេះមានរួចហើយ (Username already exists)!');
    }
    console.error("Prisma error in updateUser:", error);
    throw new Error('មិនអាចធ្វើបច្ចុប្បន្នភាពបានទេ');
  }
  await redis.del('all_authors');
  revalidatePath('/admin/users');
  return user;
}

export async function deleteUser(id: number) {
  await checkAdmin();
  const user = await prisma.user.delete({
    where: { id }
  });
  await redis.del('all_authors');
  revalidatePath('/admin/users');
  return user;
}
