'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import type { FormEvent } from 'react';

// Define a type for the toast message object for better type safety
type Toast = {
	message: string;
	type: 'success' | 'error';
} | null;

export default function useSign() {
	const [isSignup, setSignup] = useState<boolean>(false);
	const [toast, setToast] = useState<Toast>(null);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const [loading, setLoading] = useState<boolean>(false);

	const handleSignUpClick = (): void => setSignup(true);
	const handleSignInClick = (): void => setSignup(false);

	const supabase = createClient();

	useEffect(() => {
		const checkAuthStatus = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				window.location.href = '/'; // Redirect to home page
			}
		};

		checkAuthStatus();
	}, [supabase]);

	const signUpNewUser = async (email: string, password: string): Promise<void> => {
		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: 'https://ebec.vercel.app/',
					data: {
						display_name: 'First Last',
						department: 'Unassigned',
						image: null,
						score: 0,
						join_date: new Date().toISOString(),
					},
				},
			});

			if (error) {
				throw error; 
			}
		} catch (err) {
			throw err;
		}
	};

	const signInWithEmail = async (email: string, password: string): Promise<void> => {
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error; 
			}
		} catch (err: unknown) {
			throw err;
		}
	};

	const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		if (!email || !password || !confirmPassword) {
			setToast({ message: 'Please fill in all fields', type: 'error' });
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setToast({ message: 'Passwords do not match', type: 'error' });
			setLoading(false);
			return;
		}

		try {
			await signUpNewUser(email, password);
			setToast({
				message: 'Account created successfully! Check your email to verify.',
				type: 'success',
			});
			const { data: { user } } = await supabase.auth.getUser();
			window.location.href = `/user/${user?.id}`;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'An error occurred';
			setToast({ message, type: 'error' });
		} finally {
			setLoading(false);
			setTimeout(() => {
				setToast(null);
			}, 1500);
		}
	};

	const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		if (!email || !password) {
			setToast({ message: 'Please fill in all fields', type: 'error' });
			setLoading(false);
			return;
		}

		try {
			await signInWithEmail(email, password);
			const { data: { user } } = await supabase.auth.getUser();
			setToast({ message: 'Login Successful!', type: 'success' });
			window.location.href = `/user/${user?.id}`;
		} catch {
			setToast({ message: 'Invalid login credentials.', type: 'error' });
		} finally {
			setLoading(false);
			setTimeout(() => {
				setToast(null);
			}, 1500);
		}
	};

	return {
		email,
		password,
		setEmail,
		setPassword,
		handleLogin,
		handleSignUp,
		isSignup,
		handleSignUpClick,
		handleSignInClick,
		toast,
		setToast,
		loading,
		confirmPassword,
		setConfirmPassword,
	};
}