import React, { useState, useEffect } from 'react';

// import useAuth from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import { getSupabaseAdmin } from '@/utils/supabase/admin';

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
		image?: string;
		department?: string;
		status?: string;
		role?: string;
	};
}

type ToastVariant = 'info' | 'success' | 'error';

export default function useUser() {
	const supabase = createClient();

	const departments: string[] = ['IT', 'Finance', 'Media', 'Design', 'Relex', 'Events', 'Logistics'];

	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
	const [motivation, setMotivation] = useState<string>('');

	const [isIssuing, setIsIssuing] = useState<boolean>(false);
	const [issue, setIssue] = useState<string>('');

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

	async function setManager() {
		const allowed = await isAllowedToChangeDepartment();
		if (!allowed) {
			showToast('You can only request to change department once a day.', 'error');
			return;
		}
		if (user) {
			supabase.auth.updateUser({
				data: {
					department: 'IT',
					role: 'Manager',
				},
			});
		}
	}

	async function isAllowedToChangeDepartment() {
		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();
			if (authError || !user) {
				console.error('Authentication error:', authError);
				return false;
			}

			const { data, error } = await supabase
				.from('department_switch')
				.select('created_at')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(1);

			if (error) {
				console.error('Error fetching department switch data:', error);
				return false;
			}

			if (!data || data.length === 0) {
				return true; // No previous request, allow change
			}

			const lastRequest = new Date(data[0].created_at);
			const now = new Date();
			const oneDayMs = 24 * 60 * 60 * 1000;
			return now.getTime() - lastRequest.getTime() > oneDayMs;
		} catch (err) {
			console.error('Unexpected error:', err);
			return false;
		}
	}

	const handleMotivationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMotivation(e.target.value);
	};

	async function handleSendRequest() {
		if (selectedDepartment) {
			await sendRequest();
			window.location.reload();
			// showToast('Request sent successfully!', 'success');
		} else {
			showToast('Please select a department before sending a request.', 'error');
		}
	}

	const handleIssueSend = async () => {
		if (issue) {
			const { error } = await supabase.from('issues').insert([
				{
					user_id: user?.id,
					department: selectedDepartment ?? null,
					issue: issue ?? '',
					created_at: new Date().toISOString(),
					status: 'Pending',
				},
			]);

			if (error) {
				console.error('Error inserting issue:', error);
				showToast('Failed to send issue.', 'error');
				return;
			}

			showToast('Issue sent successfully!', 'success');
			closeModal();
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
		setMotivation('');
		setIssue('');
		setIsIssuing(false);
		setSelectedDepartment(null); // Reset selection on close
	};

	const handleCloseToast = () => {
		setVisible(false);
	};

	const showToast = (message: string, variant: ToastVariant = 'info', duration = 3000) => {
		setToastMessage(message);
		setToastVariant(variant);
		setVisible(true);

		setTimeout(() => {
			setVisible(false);
		}, duration); // Auto-hide after 3 seconds
	};

	const handleLogOut = () => {
		supabase.auth
			.signOut()
			.then(() => {
				window.location.href = '/login';
			})
			.catch(() => {
				// silent
			});
	};

	const uploadImageToStorage = async (userId: string, imageDataUrl: string): Promise<string | null> => {
		const supabaseAdmin = await getSupabaseAdmin();

		// Convert data URL to Blob
		const response = await fetch(imageDataUrl);
		const blob = await response.blob();

		// Upload to 'Profiles' bucket with userId.jpg as file name, overwrite if exists
		const { error } = await supabaseAdmin.storage.from('Profiles').upload(`public/${userId}.jpg`, blob, {
			upsert: true,
			contentType: 'image/jpeg',
		});

		if (error) {
			console.error('Error uploading image:', error);
			return null;
		}

		// Get public URL
		const { data: publicUrlData } = supabaseAdmin.storage
			.from('Profiles')
			.getPublicUrl(`public/${userId}.jpg`);

		return publicUrlData.publicUrl;
	};

	const sendRequest = async () => {
		const { error } = await supabase.from('department_switch').insert([
			{
				user_id: user?.id,
				department: selectedDepartment ?? null,
				motivation: motivation ?? '',
				created_at: new Date().toISOString(),
			},
		]);

		if (error) {
			console.error('Error inserting department request:', error);
			showToast('Failed to send request.', 'error');
			return;
		}

		showToast('Request sent successfully!', 'success');
		closeModal();
	};

	const handleSaveChanges = async (displayName: string, image?: string) => {
		let imageUrl: string | undefined;

		if (image) {
			const uploadedUrl = await uploadImageToStorage(user!.id, image);
			if (!uploadedUrl) {
				showToast('Failed to upload image.', 'error');
				return;
			}
			imageUrl = uploadedUrl;
		}

		const { error } = await supabase.auth.updateUser({
			data: { display_name: displayName, image: imageUrl },
		});

		if (error) {
			console.error('Error updating user:', error);
			showToast('Failed to save changes.', 'error');
			return;
		}

		setUser((prevUser) =>
			prevUser
				? {
						...prevUser,
						user_metadata: {
							...prevUser.user_metadata,
							display_name: displayName,
							image: imageUrl,
						},
				  }
				: null
		);
		showToast('Changes saved successfully!', 'success');
	};

	const allowed = ['President', 'Vice President', 'General Secretary', 'Manager'];

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
		isIssuing,
		setIsIssuing,
		issue,
		setIssue,
		handleIssueSend
	};
}
