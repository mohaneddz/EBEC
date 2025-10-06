'use server';

import { createAdminClient } from './client';

export async function deleteEvent(id: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.from('events').delete().eq('id', id);

	if (error) {
		console.error('Error deleting event:', error.message);
		return { success: false, error: 'Could not delete event.' };
	}

	return { success: true, data };
}
