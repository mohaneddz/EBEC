import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function updateSession(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const supabaseResponse = NextResponse.next();
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Protect /user/** pages
  if (pathname.startsWith('/user') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Protect /dashboard/** pages
  if (pathname.startsWith('/dashboard')) {
    const allowedRoles = ['Manager', 'President', 'Vice-President', 'SG'];
    const role = user?.user_metadata?.role || null;

    if (!role || !allowedRoles.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/error';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
