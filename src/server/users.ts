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
