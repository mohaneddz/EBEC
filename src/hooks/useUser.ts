import React, { useEffect, useState } from 'react';

import isSignedIn from '@/hooks/useAuth';
import supabase from '@/config/supabaseClient';
import useAuth from '@/hooks/useAuth';

interface User {
	id: string;
	email?: string | undefined | null;
	user_metadata?: {
		display_name?: string;
		role?: string;
		department?: string;
	};
}

type ToastVariant = 'info' | 'success' | 'error';

export default function useUser() {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
	const departments: string[] = ['IT', 'HR', 'Multimedia', 'Design', 'Relex', 'Events'];
	const [motivation, setMotivation] = useState<string>('');

	const [toastMessage, setToastMessage] = useState<string>('');
	const [toastVariant, setToastVariant] = useState<ToastVariant>('info');

	const { user, loading } = useAuth();

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
			.catch((error) => {
				// console.error('Error logging out:', error);
			});
	};

	const sendRequest = async () => {
		const { data, error } = await supabase.from('Emails').insert([
			{
				name: user?.user_metadata?.display_name,
				email: user?.email,
				type: 'Change Department',
				message: `Change from ${user?.user_metadata?.department} to ${selectedDepartment}.\nMotivation: ${motivation}`,
				date: new Date().toISOString(),
			},
		]);
		if (error) {
			// console.error('Error sending request:', error);
		} else {
			// console.log('Request sent successfully:', data);
		}

		closeModal();
	};

	const allowed = ['President', 'Vice President', 'General Secretary'];

	return {
		user,
		allowed,
		setManager,
		openModal,
		handleLogOut,
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
	};
}
