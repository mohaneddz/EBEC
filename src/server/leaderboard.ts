'use server';

import { createAdminClient } from './client';

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
