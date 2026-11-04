'use server';

import { createAdminClient } from './client';
import { requireRole } from './guard';

export async function deleteEvent(id: string) {
	await requireRole();
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.from('events').delete().eq('id', id);

	if (error) {
		console.error('Error deleting event:', error.message);
		return { success: false, error: 'Could not delete event.' };
	}

	return { success: true, data };
}
