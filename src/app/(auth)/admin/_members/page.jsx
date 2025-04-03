// src/app/members/page.js (or wherever your Page component is)

import React, { useState, useEffect } from 'react';
import SortableTable from '@/components/Admin/Table'; // Adjust path if needed
import { supabase } from '@/config/supabaseClient'; // Adjust path if needed
import Head from 'next/head'; // Optional: For setting page title

// Keep defaultColumns for reference and explicit overrides
const defaultColumns = [
    { key: 'images', label: 'Images', type: 'image', width: 150, maxImages: 5 },
    { key: 'mainPicture', label: 'Main Picture', type: 'image', maxImages: 1 }, // Example single
    { key: 'name', label: 'Name', filterable: true, expandable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'department', label: 'Department', filterable: true },
    { key: 'role', label: 'Role' },
    { key: 'joinDate', label: 'Join Date' }, // Assuming it's a string/date type
    { key: 'status', label: 'Status' },
    { key: 'description', label: 'Description', expandable: true }, // Changed from longText for clarity
];

export default function MembersPage() { // Renamed for clarity
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Consolidated error state
    const [cols, setCols] = useState(null); // Start cols as null until fetched

    // --- Function to generate column label from key ---
    const generateLabel = (key) => {
        // Add spaces before uppercase letters (camelCase to Title Case)
        const spaced = key.replace(/([A-Z])/g, ' $1');
        // Capitalize first letter and trim whitespace
        return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
    };

    // --- Load data and detect columns ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            setCols(null); 
            setData(null); 

            try {
                const { data: membersData, error: fetchError } = await supabase
                    .from('Members') // Use your actual table name
                    .select('*')
                    .order('department', { ascending: true }); 

                if (fetchError) {
                    throw fetchError; // Throw error to be caught below
                }

                setData(membersData || []); // Ensure data is an array even if null/empty

                // --- Dynamic Column Definition ---
                if (membersData && membersData.length > 0) {
                    const sampleItem = membersData[0];
                    const detectedKeys = Object.keys(sampleItem);

                    const dynamicCols = detectedKeys
                        // .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at') // Exclude common meta columns
                        .map(key => {
                            // 1. Check explicit definition in defaultColumns
                            const defaultCol = defaultColumns.find(col => col.key === key);
                            if (defaultCol) {
                                return {
                                    ...defaultCol,
                                    label: defaultCol.label || generateLabel(key), // Ensure label exists
                                };
                            }

                            // 2. Infer properties if not explicitly defined
                            let type = undefined;
                            let maxImages = undefined;
                            let expandable = false; // Default expandable to false
                            let filterable = true; // Default filterable to true

                            // Infer image type
                            const lowerKey = key.toLowerCase();
                            if (lowerKey.includes('image') || lowerKey.includes('picture') || lowerKey.includes('logo') || lowerKey.includes('avatar') || lowerKey.includes('thumb')) {
                                type = 'image';
                                filterable = false; // Usually don't filter raw image data/URLs

                                // --- Refined maxImages logic ---
                                // Assume single image unless name clearly implies plural/gallery
                                if (lowerKey.includes('pictures') || lowerKey.includes('images') || lowerKey.includes('gallery') || lowerKey.includes('photos')) {
                                    maxImages = 5; // Default for multiple images
                                } else {
                                    maxImages = 1; // Safer default for single images
                                }
                            }

                            // Infer expandable for common long text fields
                            if (lowerKey.includes('description') || lowerKey.includes('notes') || lowerKey.includes('details') || lowerKey.includes('text') || lowerKey.includes('content') || lowerKey.includes('comment')) {
                                expandable = true;
                            }

                            // Basic type inference (optional enhancement)
                            // You could check sampleItem[key] typeof, but might be unreliable
                             if (typeof sampleItem[key] === 'boolean') {
                                 type = 'boolean';
                                 filterable = false; // Or implement boolean filter UI
                             } else if (!isNaN(Date.parse(sampleItem[key])) && typeof sampleItem[key] === 'string' && sampleItem[key].includes('-')) {
                                 // Basic date string check (could be improved)
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
                    // No data, maybe use default columns or show an empty state decided by SortableTable
                    console.log("No member data found, using default columns as fallback.");
                    setCols(defaultColumns); // Fallback to defaults if no data
                }

            } catch (err) {
                console.error("Error loading data:", err);
                setError(err.message || "An unexpected error occurred while loading data.");
                setData([]); // Set empty data on error
                setCols(defaultColumns); // Use default cols on error
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []); // Run only on mount

    // --- Update Handler ---
    const handleSupabaseUpdate = async (updatedItem) => {
        setError(null);
        try {
            const { id, ...updateData } = updatedItem; // Separate id from data to update
             if (!id) {
                throw new Error("Cannot update item without ID.");
            }

            // Optional: Add updated_at timestamp
            // updateData.updated_at = new Date().toISOString();

            const { error: updateError } = await supabase
                .from('Members')
                .update(updateData)
                .eq('id', id);

            if (updateError) {
                throw updateError;
            }

            // Optimistic update in local state
            setData(prevData =>
                prevData.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
            );

        } catch (err) {
            console.error("Error updating item:", err);
            setError(`Failed to update item (ID: ${updatedItem.id}). ${err.message}`);
            // Consider re-fetching data here if optimistic update might be wrong
             // await loadData(); // Uncomment to force reload on update error
        }
    };

    // --- Delete Handler ---
    const handleSupabaseDelete = async (idToDelete) => {
        setError(null);
        const originalData = [...data]; // Store original data for potential rollback

        // Optimistic update
        setData(prevData => prevData.filter(item => item.id !== idToDelete));

        try {
            const { error: deleteError } = await supabase
                .from('Members')
                .delete()
                .eq('id', idToDelete);

            if (deleteError) {
                throw deleteError;
            }
            // Success, optimistic update is correct

        } catch (err) {
            console.error("Error deleting item:", err);
            setError(`Failed to delete item (ID: ${idToDelete}). ${err.message}`);
            // Rollback optimistic update
            setData(originalData);
        }
    };

    // --- Render Logic ---
    return (
        <>
            <Head>
                <title>Members</title>
            </Head>
            <div className='flex flex-col gap-4 min-h-screen bg-gray-100 dark:bg-gray-900'>
                <div className='flex flex-col gap-2 bg-gradient-to-br from-primary-dark to-primary-light p-6 sm:p-8 shadow-md'>
                    <h1 className='text-3xl sm:text-5xl font-black text-secondary-light text-center'>MEMBERS</h1>
                </div>

                <div className="container mx-auto px-4 py-4 flex-grow">
                    {error && (
                        <div className="mb-4 text-red-700 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md border border-red-300 dark:border-red-600 text-sm">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex justify-center items-center">
                                {/* Basic Spinner SVG */}
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            Loading members...
                        </div>
                    ) : (
                         // Ensure cols is ready before rendering SortableTable
                         cols && <SortableTable data={data} cols={cols} onUpdate={handleSupabaseUpdate} onDelete={handleSupabaseDelete} />
                    )}
                </div>
            </div>
        </>
    );
}