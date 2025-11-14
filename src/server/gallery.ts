'use server';

import sharp from 'sharp';
import { createAdminClient } from './client';

export async function updateEvent(
	name: string,
	date: string,
	brief: string,
	location: string,
	attendance: number,
	description: string,
	pictures: string[],
	eventId: string
) {
	const supabaseAdmin = await createAdminClient();

	console.log('Starting event update for eventId:', eventId, 'with data:', { name, date, brief, location, attendance, description, pictures });

	// Fetch current event to check for old pictures
	const { data: currentEvent, error: fetchError } = await supabaseAdmin
		.from('events')
		.select('pictures')
		.eq('id', eventId)
		.single();

	if (fetchError) {
		console.error('Error fetching current event:', fetchError);
		throw new Error('Failed to fetch current event');
	}

	// If there are old pictures not in the new pictures array, delete them from storage
	if (currentEvent.pictures && Array.isArray(currentEvent.pictures)) {
		const oldPictures = currentEvent.pictures.filter(pic => pic && typeof pic === 'string');
		const newPicturesSet = new Set(pictures.filter(pic => pic && typeof pic === 'string'));

		for (const oldPic of oldPictures) {
			if (!newPicturesSet.has(oldPic)) {
				// Extract path from URL: e.g., 'Events/eventName/number.avif'
				const urlParts = oldPic.split('/storage/v1/object/public/');
				if (urlParts.length > 1) {
					const path = urlParts[1]; // e.g., 'Events/EventName/1.avif'
					const { error: deleteError } = await supabaseAdmin.storage.from('Events').remove([path]);
					if (deleteError) {
						console.error('Error deleting old image:', deleteError);
						// Don't throw, proceed with update
					} else {
						console.log('Old image deleted successfully:', path);
					}
				}
			}
		}
	}

	// update table events:
	const { data, error } = await supabaseAdmin
		.from('events')
		.update({
			name,
			date,
			brief,
			location,
			attendance,
			description,
			pictures,
		})
		.eq('id', eventId);

	if (error) {
		console.error('Error updating event:', error);
		throw new Error('Failed to update event');
	}

	console.log('Event updated successfully for eventId:', eventId, 'returned data:', data);

	return data;
}

export async function deleteEvent(eventId: string) {
	const supabaseAdmin = await createAdminClient();

	const { data, error } = await supabaseAdmin.from('events').delete().eq('id', eventId);
	if (error) {
		console.error('Error deleting event:', error);
		throw new Error('Failed to delete event');
	}

	return data;
}

export async function uploadEventImage(file: File, eventId: string, number: number) {
	const supabaseAdmin = await createAdminClient();

	// Convert to AVIF with high quality
	const avifBuffer = await sharp(await file.arrayBuffer())
		.avif({ quality: 90 }) // high quality, can go 0-100
		.toBuffer();

	const filePath = `${eventId}/${number}.avif`;
	console.log('Uploading compressed AVIF file to path:', filePath);

	const { data, error: uploadError } = await supabaseAdmin.storage
		.from('Events')
		.upload(filePath, avifBuffer, {
			cacheControl: '3600',
			upsert: true,
			contentType: 'image/avif',
		});

	if (uploadError) {
		console.error('Error uploading AVIF image:', uploadError);
		throw new Error('Failed to upload AVIF image');
	}

	console.log('AVIF image uploaded successfully:', data);

	const {
		data: { publicUrl },
	} = supabaseAdmin.storage.from('Events').getPublicUrl(filePath);

	console.log('Retrieved public URL for AVIF image:', publicUrl);

	return publicUrl;
}
