import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const expectedUserAgent = process.env.NEXT_PUBLIC_FLUTTER_USER_AGENT || 'flutter_x_pwa';
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return NextResponse.next();
  }
  
  // Skip middleware for download page and API routes
  if (
    request.nextUrl.pathname.startsWith('/download') ||
    request.nextUrl.pathname.startsWith('/offline') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // If user agent doesn't match, redirect to download page
  if (userAgent !== expectedUserAgent) {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.well-known|icons).*)',
  ],
};
