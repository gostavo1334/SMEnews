import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

// Add paths that don't require authentication
const publicRoutes = ['/login', '/', '/api'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // Check if the route is /admin or starts with /admin
  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute) {
    const cookie = (await cookies()).get('session')?.value;
    const session = cookie ? await decrypt(cookie).catch(() => null) : null;

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  // If user is logged in and tries to access login page, redirect to admin
  if (path === '/login') {
    const cookie = (await cookies()).get('session')?.value;
    const session = cookie ? await decrypt(cookie).catch(() => null) : null;
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
