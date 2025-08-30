import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	try {
		const supabase = createMiddlewareClient({ req, res });
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const role = user?.user_metadata?.role;
		const department = user?.user_metadata?.department;

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
	matcher: ['/dashboard/:path*'],
};
