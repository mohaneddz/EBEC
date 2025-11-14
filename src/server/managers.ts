'use server';

import { createAdminClient } from './client';
import sharp from 'sharp';

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

export async function uploadManagerImage(file: File, managerId: string) {
    const supabaseAdmin = await createAdminClient();
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert to AVIF using Sharp
    const avifBuffer = await sharp(buffer)
        .avif({ quality: 80 }) // Adjust quality as needed
        .toBuffer();
    
    const fileName = `${managerId}.avif`;
    
    // delete existing file if exists
    await supabaseAdmin.storage
        .from('Managers')
        .remove([fileName]);
    
    // Upload to 'Managers' bucket
    const { data, error } = await supabaseAdmin.storage
        .from('Managers')
        .upload(fileName, avifBuffer, { 
            upsert: true,
            contentType: 'image/avif'
        });
    
    if (error) {
        console.error('Error uploading manager image:', error.message);
        throw error;
    }
    
    return data;
}

export async function createManager(managerData: { id?: string; full_name: string; role: string; department: string; picture?: string }) {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin
        .from('managers')
        .upsert(managerData, { onConflict: 'id' })
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error creating manager:', error.message);
        throw error;
    }

    return data;
}

