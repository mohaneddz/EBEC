'use server';

import { createAdminClient } from './client';
import { requireRole } from './guard';

export async function deleteIssue(issueId: string) {
	await requireRole();
    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin.from('issues').delete().eq('id', issueId);

    if (error) {
        console.error('Error deleting issue:', error.message);
        return { success: false, error: 'Could not delete issue.' };
    }
    return { success: true };
}

export async function markIssue(issueId: string, status: 'Pending' | 'Resolved') {
	await requireRole();
    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin.from('issues').update({ status }).eq('id', issueId);

    if (error) {
        console.error('Error updating issue status:', error.message);
        return { success: false, error: 'Could not update issue status.' };
    }
    return { success: true };
}
