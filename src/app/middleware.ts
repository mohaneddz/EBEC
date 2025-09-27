import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
  // Run Supabase session update first
  const updateRes = await updateSession(req);

  // If updateSession already returns a response (redirect, rewrite, etc.), return it
  if (updateRes) return updateRes;

  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    const department = user?.app_metadata?.department;

    const allowed =
      role === 'Manager' && (department === 'IT' || department === 'HR');

    if (!allowed) {
      // Forward to not-found without changing the URL
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }

    return res;
  } catch {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
