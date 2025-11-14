'use server';

import { createAdminClient } from './client';
import { User } from '@supabase/supabase-js';

export async function getTotalMembers() {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching total members:', error.message);
        return { count: 0, error: 'Could not fetch total members.' };
    }

    if (!data?.users) {
        return { count: 0, error: 'Could not fetch total members.' };
    }

    const users = data.users as User[];

    return { count: users.length, error: null, active: users.filter(user => user.user_metadata?.status === 'Active').length };
}

export async function getLeaderboardData() {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching leaderboard data:', error.message);
        return { data: [], error: 'Could not fetch leaderboard data.' };
    }

    if (!data?.users) {
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
