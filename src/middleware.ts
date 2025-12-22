import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // فقط لاگ کردن - فعلاً هیچ مانعی ایجاد نکن
  console.log('🔗 مسیر درخواست شده:', request.nextUrl.pathname);
  
  // اگر می‌خواهید واقعاً محافظت کنید:
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.includes('/login')) {
    
    const authCookie = request.cookies.get('admin_auth');
    
    // اگر کوکی وجود نداشت (فعلاً کامنت کنید)
    // if (!authCookie) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};