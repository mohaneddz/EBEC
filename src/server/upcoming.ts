'use server';

import sharp from 'sharp';
import { createAdminClient } from './client';

export async function updateUpcomingEvent(
	title: string,
	date: string | null,
	brief: string,
	location: string,
	picture: string,
	open: boolean,
	id: string
) {
	const supabaseAdmin = await createAdminClient();

	console.log('Starting upcoming event update for id:', id, 'with data:', {
		title,
		date,
		brief,
		location,
		picture,
		open,
	});

	// Fetch current event to check for old picture
	const { data: currentEvent, error: fetchError } = await supabaseAdmin
		.from('upcoming')
		.select('picture')
		.eq('id', id)
		.single();

	if (fetchError) {
		console.error('Error fetching current event:', fetchError);
		throw new Error('Failed to fetch current event');
	}

	// If there's an old picture different from the new one, delete it from storage
	if (currentEvent.picture && currentEvent.picture !== picture) {
		// Extract path from URL: e.g., 'Upcoming/filename.avif'
		const urlParts = currentEvent.picture.split('/storage/v1/object/public/');
		if (urlParts.length > 1) {
			const path = urlParts[1]; // e.g., 'Upcoming/1.avif'
			const { error: deleteError } = await supabaseAdmin.storage.from('Upcoming').remove([path]);
			if (deleteError) {
				console.error('Error deleting old image:', deleteError);
				// Don't throw, proceed with update
			} else {
				console.log('Old image deleted successfully:', path);
			}
		}
	}

	const processedDate = date ? date : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to 30 days from now if null

	const { data, error } = await supabaseAdmin
		.from('upcoming')
		.update({
			title,
			date: processedDate,
			brief,
			location,
			picture,
			open,
		})
		.eq('id', id);

	if (error) {
		console.error('Error updating upcoming event:', error);
		throw new Error('Failed to update upcoming event');
	}

	console.log('Upcoming event updated successfully for id:', id, 'returned data:', data);

	return data;
}

export async function clearEvent(id: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin
		.from('upcoming')
		.update({
			title: '',
			date: null,
			brief: '',
			location: '',
			picture: '',
			open: false,
		})
		.eq('id', id);

	if (error) {
		console.error('Error clearing upcoming event:', error);
		throw new Error('Failed to clear upcoming event');
	}

	return data;
}

export async function uploadEventImage(file: File, eventId: string) {
	const supabaseAdmin = await createAdminClient();

	// Convert to AVIF with high quality
	const avifBuffer = await sharp(await file.arrayBuffer())
		.avif({ quality: 90 }) // high quality, can go 0-100
		.toBuffer();

	// Make filename unique to avoid caching issues
	const timestamp = Date.now();
	const filePath = `${eventId}_${timestamp}.avif`;
	console.log('Uploading compressed AVIF file to path:', filePath);

	const { data, error: uploadError } = await supabaseAdmin.storage.from('Upcoming').upload(filePath, avifBuffer, {
		cacheControl: '3600',
		contentType: 'image/avif',
	});
    
	if (uploadError) {
		console.error('Error uploading AVIF image:', uploadError);
		throw new Error('Failed to upload AVIF image');
	}

	console.log('AVIF image uploaded successfully:', data);

	const {
		data: { publicUrl },
	} = supabaseAdmin.storage.from('Upcoming').getPublicUrl(filePath);

	console.log('Retrieved public URL for AVIF image:', publicUrl);

	return publicUrl;
}
