'use server';

import { encrypt } from '@/lib/auth';
import { hashPassword } from '@/lib/hash';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងលេខសម្ងាត់' };
  }

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (user && user.password === hashPassword(password)) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ 
      user: { 
        id: user.id,
        name: user.name || user.username, 
        role: user.role 
      }, 
      expires 
    });

    // Save the session in a cookie
    (await cookies()).set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

    return { success: true };
  }

  return { success: false, error: 'ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ' };
}

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/login');
}
