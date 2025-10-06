'use server';

import { createAdminClient } from './client';

export async function deleteManager(id: string){
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin
        .from('managers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting manager:', error.message);
    }
    
    return { data, error };
}

export async function updateManager(id: string, updates: { picture?: string; full_name?: string; role?: string; department?: string }) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('managers')
    .update(updates)
    .eq('id', id);
  if (error) {
    console.error('Error updating manager:', error);
    throw error;
  }
}