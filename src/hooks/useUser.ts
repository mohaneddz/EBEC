import React, { useState, useEffect } from 'react';

// import useAuth from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import { supabaseAdmin } from '@/utils/supabase/admin';

interface User {
	id: string;
	email?: string | undefined | null;
	app_metadata?: {
		display_name?: string;
		role?: string;
		status?: string;
		department?: string;
	};
	user_metadata?: {
		display_name?: string;
	};
}

type ToastVariant = 'info' | 'success' | 'error';

export default function useUser() {
	const supabase = createClient();

	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
	const departments: string[] = ['IT', 'HR', 'Multimedia', 'Design', 'Relex', 'Events'];
	const [motivation, setMotivation] = useState<string>('');

	const [toastMessage, setToastMessage] = useState<string>('');
	const [toastVariant, setToastVariant] = useState<ToastVariant>('info');

	// const { user, loading } = useAuth();
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (mounted) setUser((data?.user as unknown as User) ?? null);
		})();
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (mounted) setUser((session?.user as unknown as User) ?? null);
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [supabase]);

	const [visible, setVisible] = useState<boolean>(false);

	function setManager() {
		if (user) {
			supabase.auth.updateUser({
				data: {
					department: 'IT',
					role: 'Manager',
				},
			});
		}
	}

	const handleMotivationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMotivation(e.target.value);
	};

	const handleSendRequest = () => {
		if (selectedDepartment) {
			sendRequest();
			showToast('Request sent successfully!', 'success');
		} else {
			showToast('Please select a department before sending a request.', 'error');
		}
	};

	const handleSelect = (department: string) => {
		setSelectedDepartment(department);
	};

	const openModal = () => {
		setIsVisible(true);
	};

	const closeModal = () => {
		setIsVisible(false);
		setSelectedDepartment(null); // Reset selection on close
	};

	const handleCloseToast = () => {
		setVisible(false);
	};

	const showToast = (message: string, variant: ToastVariant) => {
		setToastMessage(message);
		setToastVariant(variant);
		setVisible(true);

		setTimeout(() => {
			setVisible(false);
		}, 3000); // Auto-hide after 3 seconds
	};

	const handleLogOut = () => {
		supabase.auth
			.signOut()
			.then(() => {
				window.location.href = '/login';
			})
			.catch((_error) => {
				// silent
			});
	};

	const handleSaveChanges = async (displayName: string) => {
		const { error } = await supabaseAdmin.auth.updateUser({
			data: { display_name: displayName },
		});
		if (error) {
			console.error('Error updating display name:', error);
			return;
		}
		// Refresh local user state
		const { data } = await supabaseAdmin.auth.getUser();
		setUser((data?.user as unknown as User) ?? null);
	};

	const sendRequest = async () => {
		const displayName = user?.app_metadata?.display_name || user?.user_metadata?.display_name;
		await supabase.from('Emails').insert([
			{
				name: displayName,
				email: user?.email,
				type: 'Change Department',
				message: `Change from ${user?.app_metadata?.department} to ${selectedDepartment}.\nMotivation: ${motivation}`,
				date: new Date().toISOString(),
			},
		]);

		closeModal();
	};

	const allowed = ['President', 'Vice President', 'General Secretary'];

	return {
		user,
		allowed,
		setManager,
		openModal,
		visible,
		departments,
		isVisible,
		selectedDepartment,
		handleMotivationChange,
		handleSendRequest,
		closeModal,
		handleCloseToast,
		motivation,
		toastMessage,
		toastVariant,
		handleSelect,
		handleLogOut,
		handleSaveChanges,
	};
}
