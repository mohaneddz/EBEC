'use server';

import { createAdminClient } from './client';

export async function getUser(userId: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

	if (error) {
		console.error('Error fetching user data:', error.message);
		return { user: null, error: 'Could not fetch user data.' };
	}
	return { user: data.user, error: null };
}

export async function getAllUsers() {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching all users:', error.message);
		return { users: [], error: 'Could not fetch all users.' };
	}

	return { users: data.users || [], error: null };
}

export async function promoteUser(userId: string, newRole: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
		user_metadata: { role: newRole },
	});

	if (error) {
		console.error('Error promoting user:', error.message);
		return { success: false, error: 'Could not promote user.' };
	}

	return { success: true, data };
}

export async function deleteUser(userId: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

	if (error) {
		console.error('Error deleting user:', error.message);
		return { success: false, error: 'Could not delete user.' };
	}

	return { success: true, data };
}

export async function updateUserScore(userId: string, scoreBonus: number) {
	const supabaseAdmin = await createAdminClient();

	const { data: userData, error: getError } = await supabaseAdmin.auth.admin.getUserById(userId);

	if (getError) {
		console.error('Error fetching user for score update:', getError.message);
		return { success: false, error: 'Could not fetch user for score update.' };
	}

	const currentScore = userData.user?.user_metadata?.score || 0;
	const newScore = currentScore + scoreBonus;

	const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
		user_metadata: { ...userData.user.user_metadata, score: newScore },
	});

	if (error) {
		console.error('Error updating user score:', error.message);
		return { success: false, error: 'Could not update user score.' };
	}

	return { success: true, data };
}

export async function updateUserStatus(userId: string, newStatus: 'Active' | 'Inactive') {
    const supabaseAdmin = await createAdminClient();
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { status: newStatus },
    });

    if (error) {
        console.error('Error updating user status:', error.message);
        return { success: false, error: 'Could not update user status.' };
    }

    return { success: true, data };
}
