import { useState } from 'react';
import { uploadEventImage } from "@/server/gallery";
import { compressToAvif } from "@/utils/convertion";
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { createManager, updateManager, uploadManagerImage } from "@/server/managers";

export default function useQuickActions() {
  // Add Manager states
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [managerFullName, setManagerFullName] = useState('');
  const [managerDepartment, setManagerDepartment] = useState<departments>('IT'); 
  const [managerRole, setManagerRole] = useState('');
  const [managerPicture, setManagerPicture] = useState<File | null>(null);
  const [managerPicturePreview, setManagerPicturePreview] = useState<string | null>(null);

  // Create Event states
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventBrief, setEventBrief] = useState('');
  const [eventAttendance, setEventAttendance] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({});

  const handleAddManager = async () => {
    try {
      // Create manager without picture first
      const createdManager = await createManager({
        full_name: managerFullName,
        department: managerDepartment,
        role: managerRole,
      });

      // If picture provided, upload and update
      if (managerPicture) {
        await uploadManagerImage(managerPicture, createdManager.id);
        const supabase = await getSupabaseAdmin();
        const { data: { publicUrl } } = supabase.storage.from('managers').getPublicUrl(`${createdManager.id}.avif`);
        await updateManager(createdManager.id, { picture: publicUrl });
      }

      console.log('Manager added successfully');
    } catch (error) {
      console.error('Error adding manager:', error);
    }

    // Reset states
    setIsAddManagerModalOpen(false);
    setManagerFullName('');
    setManagerDepartment('IT');
    setManagerRole('');
    setManagerPicture(null);
    setManagerPicturePreview(null);
  };

  const handleCreateEvent = async () => {
    const supabase = await getSupabaseAdmin();

    // Insert event without pictures first to get ID
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert({
        name: eventTitle,
        date: new Date(eventDate),
        brief: eventBrief,
        description: eventDescription,
        attendance: eventAttendance,
        location: eventLocation,
        pictures: [] // Empty initially
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return;
    }

    const eventId = insertData.id;

    // Upload selected files and get URLs using eventId
    const pictures = [];
    for (const key of ['picture1', 'picture2', 'picture3', 'picture4']) {
      if (selectedFiles[key]) {
        const number = parseInt(key.slice(-1));
        const publicUrl = await uploadEventImage(selectedFiles[key]!, eventId, number);
        pictures.push(publicUrl);
      } else {
        pictures.push(null);
      }
    }

    // Update event with pictures
    const { error: updateError } = await supabase
      .from('events')
      .update({ pictures: pictures.filter(Boolean) })
      .eq('id', eventId);

    if (updateError) {
      console.error('Update error:', updateError);
      return;
    }

    console.log('Creating event:', { eventTitle, eventDescription, eventDate, eventLocation, eventBrief, eventAttendance, pictures });
    setIsCreateEventModalOpen(false);
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
    setEventBrief('');
    setEventAttendance(0);
    setSelectedFiles({});
    setPreviews({});
  };

  return {
    // Add Manager
    isAddManagerModalOpen,
    setIsAddManagerModalOpen,
    managerFullName,
    setManagerFullName,
    managerDepartment,
    setManagerDepartment,
    managerRole,
    setManagerRole,
    managerPicture,
    setManagerPicture,
    managerPicturePreview,
    setManagerPicturePreview,
    handleAddManager,
    // Create Event
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    eventTitle,
    setEventTitle,
    eventDescription,
    setEventDescription,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    eventBrief,
    setEventBrief,
    eventAttendance,
    setEventAttendance,
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
    handleCreateEvent,
  };
}