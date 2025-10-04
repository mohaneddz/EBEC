'use server';

import { createClient } from '@supabase/supabase-js';

export async function createAdminClient() {
	return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function getTotalMembers() {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching total members:', error.message);
		return { count: 0, error: 'Could not fetch total members.' };
	}

	return { count: data?.users?.length || 0, error: null };
}

export async function getLeaderboardData() {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.listUsers();

	if (error) {
		console.error('Error fetching leaderboard data:', error.message);
		return { data: [], error: 'Could not fetch leaderboard data.' };
	}

	const result = data.users.map((user) => ({
		user_id: user.id,
		name: user.user_metadata?.display_name || 'Unknown',
		score: user.user_metadata?.score || 0,
		department: user.user_metadata?.department || 'Unknown',
		picture: user.user_metadata?.image || '/imgs/DEFAULT.webp',
	}));

	return { data: result, error: null };
}

export async function getUser(userId: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

	if (error) {
		console.error('Error fetching user data:', error.message);
		return { user: null, error: 'Could not fetch user data.' };
	}
	return { user: data.user, error: null };
}

export async function switchDepartment(userId: string, newDepartment: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
		user_metadata: { department: newDepartment },
	});

	if (error) {
		console.error('Error switching department:', error.message);
		return { success: false, error: 'Could not switch department.' };
	}

	return { success: true, data };
}

export async function deleteDepartmentSwitch(userId: string) {
	const supabaseAdmin = await createAdminClient();

	const { error } = await supabaseAdmin.from('department_switch').delete().eq('user_id', userId);

	if (error) {
		console.error('Error deleting department switch:', error.message);
		return { success: false, error: 'Could not delete department switch.' };
	}

	return { success: true };
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

export async function changeUserDepartment(userId: string, newDepartment: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
		user_metadata: { department: newDepartment },
	});

	if (error) {
		console.error('Error changing user department:', error.message);
		return { success: false, error: 'Could not change user department.' };
	}

	return { success: true, data };
}