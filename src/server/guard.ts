import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export const dashboardRoles = ['Manager', 'President', 'Vice-President', 'SG'];
export const topRoles = ['President', 'Vice-President', 'SG'];

export function getRole(user: User | null | undefined): string {
	const role = user?.app_metadata?.role;
	return typeof role === 'string' ? role : '';
}

export async function getSessionUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll: () => cookieStore.getAll(),
				setAll: () => {},
			},
		}
	);
	const { data, error } = await supabase.auth.getUser();
	return error ? null : data.user;
}

export async function requireUser(): Promise<User> {
	const user = await getSessionUser();
	if (!user) throw new Error('Unauthorized');
	return user;
}

export async function requireRole(allowed: string[] = dashboardRoles): Promise<User> {
	const user = await requireUser();
	if (!allowed.includes(getRole(user))) throw new Error('Forbidden');
	return user;
}
