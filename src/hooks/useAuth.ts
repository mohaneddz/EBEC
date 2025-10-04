'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export default function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		const initialize = async () => {
			const supabase = await createClient();

			const fetchUser = async () => {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (active) {
					setUser(user ?? null);
					setLoading(false);
				}
			};

			fetchUser().catch(() => {
				if (active) setLoading(false);
			});

			const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
				if (active) setUser(session?.user ?? null);
			});

			return () => {
				active = false;
				subscription?.subscription.unsubscribe();
			};
		};

		initialize();

		return () => {
			active = false;
		};
	}, []);

	return{
		user,
		loading,
	}
}
