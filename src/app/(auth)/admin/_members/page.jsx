// src/app/members/page.js (or wherever your Page component is)

import React, { useState, useEffect } from 'react';
import SortableTable from '@/components/Admin/Table'; // Adjust path if needed
import { supabase, handler } from '@/config/supabaseSuperClient';
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

    const needed = ['Picture', 'Display name', 'Email', 'Department', 'Role', 'Join date', 'Status', 'Id'];

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        setCols(null);
        setData(null);

        try {
            let { data: membersData, error: fetchError } = await supabase.auth.admin.listUsers();
            membersData = membersData?.users || []; // Ensure we have an array
            if (fetchError || !membersData) {
                throw fetchError; // Throw error to be caught below
            }
            membersData = membersData.map(member => {
                // add metadata to each member
                const { user_metadata, ...rest } = member;
                return {
                    ...rest,
                    ...user_metadata,
                };
            }).map(member => {
                // replace '_' with ' '
                const newMember = { ...member };
                Object.keys(newMember).forEach(key => {
                    if (key.includes('_')) {
                        const newKey = key.replace(/_/g, ' ');
                        newMember[newKey] = newMember[key];
                        delete newMember[key];
                    }
                }); // Added missing closing brace here
                return newMember;
            });

            setData(membersData || []); // Ensure data is an array even if null/empty

            // --- Dynamic Column Definition ---
            if (membersData && membersData.length > 0) {
                const sampleItem = membersData[0];
                const detectedKeys = Object.keys(sampleItem);
                console.log("Detected keys:", detectedKeys); // Debugging log

                // Add 'user_metadata' if it exists
                if (sampleItem.user_metadata) {
                    Object.keys(sampleItem.user_metadata).forEach((metadataKey) => {
                        detectedKeys.push(`user_metadata.${metadataKey}`);
                    });
                }
                let arr = [];
                const dynamicCols = detectedKeys
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

                        // Handle 'user_metadata' keys correctly
                        const lowerKey = key.toLowerCase();
                        if (lowerKey.includes('user_metadata.')) {
                            type = 'json'; // Define the type as 'json' for user_metadata keys
                        }

                        // Infer image type
                        if (lowerKey.includes('image') || lowerKey.includes('picture') || lowerKey.includes('logo') || lowerKey.includes('avatar') || lowerKey.includes('thumb')) {
                            type = 'image';
                            filterable = false; // Usually don't filter raw image data/URLs

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
                        if (typeof sampleItem[key] === 'boolean') {
                            type = 'boolean';
                            filterable = false; // Or implement boolean filter UI
                        } else if (!isNaN(Date.parse(sampleItem[key])) && typeof sampleItem[key] === 'string' && sampleItem[key].includes('-')) {
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
                    })
                    .filter(col => {
                        arr.push({ col: col.label, key: col.key, needed: needed.includes(col.label) });
                        return needed.includes(col.label);
                    })
                    .sort((a, b) => {
                        // Sort according to the order in `needed`
                        return needed.indexOf(a.label) - needed.indexOf(b.label);
                    });
                console.log("Filtered columns:", arr); // Debugging log
                console.log("Dynamic columns detected:", dynamicCols); // Debugging log
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

    // --- Load data and detect columns ---
    useEffect(() => {
        loadData();
    }, []);

    // --- Update Handler ---
    const handleSupabaseUpdate = async (updatedItem) => {
        setError(null);
        try {
            const { id, ...rest } = updatedItem;
            if (!id) {
                throw new Error("Cannot update user without ID.");
            }

            // Convert keys with spaces back to snake_case to match original user_metadata
            const transformedMetadata = {};
            for (const key in rest) {
                const snakeKey = key.replace(/ /g, '_'); // e.g., "Display name" => "display_name"
                transformedMetadata[snakeKey] = rest[key];
            }

            console.log("Updating user metadata:", transformedMetadata);

            const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
                user_metadata: transformedMetadata,
            });

            if (updateError) throw updateError;

            // Update the local state optimistically
            setData(prev =>
                prev.map(item => (item.id === id ? { ...item, ...rest } : item))
            );

        } catch (err) {
            console.error("Error updating user:", err);
            setError(`Failed to update user (ID: ${updatedItem.id}). ${err.message}`);
        }
    };

    // --- Delete Handler ---
    const handleSupabaseDelete = async (idToDelete) => {
        setError(null);
        const originalData = [...data];

        // Optimistically remove from UI
        setData(prev => prev.filter(item => item.id !== idToDelete));

        try {
            const { error: deleteError } = await supabase.auth.admin.deleteUser(idToDelete);

            if (deleteError) throw deleteError;

        } catch (err) {
            console.error("Error deleting user:", err);
            setError(`Failed to delete user (ID: ${idToDelete}). ${err.message}`);

            // Rollback UI
            setData(originalData);
        }
    };

    const refresh = async () => {
        setIsLoading(true);
        await loadData();
        setIsLoading(false);
    };

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
                    {/* button to refresh the tbale */}

                    {isLoading ? (
                        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex justify-center items-center">
                                {/* Spinner SVG */}
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none">
                                    <path d="M100 50.5908..." fill="currentColor" />
                                    <path d="M93.9676 39.0409..." fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            Loading members...
                        </div>
                    ) : (
                        Array.isArray(data) && data.length > 0 && cols && (
                            <SortableTable refresh={refresh} data={data} cols={cols} onUpdate={handleSupabaseUpdate} onDelete={handleSupabaseDelete} />
                        )
                    )}

                </div>
            </div>
        </>
    );
}