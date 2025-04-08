import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Optional: For setting page title
import SortableTable from '@/components/Admin/Table'; // Adjust path if needed
import { supabase } from '@/config/supabaseClient'; // Adjust path if needed

// Define default columns for reference and explicit settings
const defaultColumns = [
    { key: 'name', label: 'Event Name', filterable: true, expandable: true }, // Make name expandable too?
    { key: 'mainPicture', label: 'Main Picture', type: 'image', width: 150, maxImages: 1, filterable: false },
    { key: 'pictures', label: 'Pictures', type: 'image', width: 150, maxImages: 4, filterable: false },
    { key: 'date', label: 'Date', filterable: true, type: 'date' }, // Hint type for potential sorting/filtering UI
    { key: 'location', label: 'Location', filterable: true },
    { key: 'description', label: 'Description', expandable: true, filterable: false }, // Often not good to filter long text
    { key: 'brief', label: 'Brief', expandable: true, filterable: true },
    { key: 'type', label: 'Type', filterable: true },
    { key: 'attendees', label: 'Attendees', filterable: true }, // Could be number or text
];

// Helper to generate labels from keys
const generateLabel = (key) => {
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
};


export default function EventsPage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Consolidated error state
    const [cols, setCols] = useState(null); // Start cols as null until fetched

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        setCols(null);
        setData(null);

        try {
            // Example: Order by date descending
            const { data: eventData, error: fetchError } = await supabase
                .from('Events') // Your table name
                .select('*')
                .order('date', { ascending: false }); // Adjust ordering if needed

            if (fetchError) {
                throw fetchError;
            }

            setData(eventData || []); // Ensure array

            // --- Dynamic Column Definition ---
            if (eventData && eventData.length > 0) {
                const sampleItem = eventData[0];
                const detectedKeys = Object.keys(sampleItem);

                const dynamicCols = detectedKeys
                     // Exclude common meta columns if they exist
                    .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
                    .map(key => {
                        // 1. Check explicit definition
                        const defaultCol = defaultColumns.find(col => col.key === key);
                        if (defaultCol) {
                            return {
                                ...defaultCol,
                                label: defaultCol.label || generateLabel(key),
                            };
                        }

                        // 2. Infer properties
                        let type = undefined;
                        let maxImages = undefined;
                        let expandable = false;
                        let filterable = true;
                        const lowerKey = key.toLowerCase();

                         // Infer image type
                        if (lowerKey.includes('image') || lowerKey.includes('picture') || lowerKey.includes('logo') || lowerKey.includes('avatar') || lowerKey.includes('thumb')) {
                            type = 'image';
                            filterable = false;
                            maxImages = (lowerKey.includes('pictures') || lowerKey.includes('images') || lowerKey.includes('gallery')) ? 4 : 1; // Use defined max or default
                        }

                        // Infer expandable
                        if (lowerKey.includes('description') || lowerKey.includes('notes') || lowerKey.includes('details') || lowerKey.includes('text') || lowerKey.includes('content') || lowerKey.includes('comment') || lowerKey.includes('brief')) {
                            expandable = true;
                            // Maybe don't filter very long text by default
                            if (lowerKey.includes('description') || lowerKey.includes('content')) filterable = false;
                        }

                         // Basic date hint
                         if (lowerKey === 'date' || lowerKey.includes('time')) {
                             type = 'date';
                         }

                        return {
                            key: key,
                            label: generateLabel(key),
                            filterable: filterable,
                            type,
                            maxImages,
                            expandable
                        };
                    });
                setCols(dynamicCols);
            } else {
                console.log("No event data found, using default columns.");
                setCols(defaultColumns); // Fallback
            }

        } catch (err) {
            console.error("Error loading event data:", err);
            setError(err.message || "An unexpected error occurred while loading events.");
            setData([]);
            setCols(defaultColumns); // Use defaults on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []); // Run only on mount

    // --- Update Handler ---
    const handleSupabaseUpdate = async (updatedItem) => {
        setError(null);
        try {
            const { id, ...updateData } = updatedItem;
             if (!id) throw new Error("Cannot update item without ID.");

            // Add updated_at timestamp if your table has it
            // updateData.updated_at = new Date().toISOString();

            const { error: updateError } = await supabase
                .from('Events')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            // Optimistic update
            setData(prevData =>
                prevData.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
            );

        } catch (err) {
            console.error("Error updating event:", err);
            setError(`Failed to update event (ID: ${updatedItem.id}). ${err.message}`);
             // Consider force reload on update error
             // await loadData();
        }
    };

    // --- Delete Handler ---
    const handleSupabaseDelete = async (idToDelete) => {
        setError(null);
        const originalData = [...data]; // Store for rollback

        // Optimistic update
        setData(prevData => prevData.filter(item => item.id !== idToDelete));

        try {
            const { error: deleteError } = await supabase
                .from('Events')
                .delete()
                .eq('id', idToDelete);

            if (deleteError) throw deleteError;
             // Success

        } catch (err) {
            console.error("Error deleting event:", err);
            setError(`Failed to delete event (ID: ${idToDelete}). ${err.message}`);
            // Rollback
            setData(originalData);
        }
    };

    const refresh = async () => {
        setIsLoading(true);
        await loadData();
        setIsLoading(false);
    };

    // --- Render Logic ---
    return (
        <>
            <Head>
                <title>Events Management</title>
            </Head>
            {/* Use same layout structure as MembersPage */}
            <div className='flex flex-col gap-4 min-h-screen bg-gray-100 dark:bg-gray-900'>
                 {/* Header */}
                <div className='flex flex-col gap-2 bg-gradient-to-br from-primary-dark to-primary-light p-6 sm:p-8 shadow-md'>
                    <h1 className='text-3xl sm:text-5xl font-black text-secondary-light text-center'>EVENTS</h1>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 py-4 flex-grow">
                     {/* Error Message */}
                    {error && (
                        <div className="mb-4 text-red-700 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md border border-red-300 dark:border-red-600 text-sm">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex justify-center items-center">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Spinner SVG Paths */}
                                     <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        // Render Table only when cols and data are ready
                         cols && data ? (
                            <SortableTable
                                refresh={refresh}
                                data={data}
                                cols={cols}
                                onUpdate={handleSupabaseUpdate}
                                onDelete={handleSupabaseDelete}
                            />
                         ) : null // Or show a specific "No data" message if data is empty array and cols are set
                    )}
                </div>
            </div>
        </>
    );
}