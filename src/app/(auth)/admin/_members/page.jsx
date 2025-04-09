// src/app/(auth)/admin/_members/page.jsx  <- Corrected path based on warning
// or src/app/members/page.js if that's where the component lives

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import SortableTable from '@/components/Admin/Table';
import { supabase } from '@/config/supabaseSuperClient'; // Removed handler unless used elsewhere
import Head from 'next/head';

// --- Moved outside component: These don't depend on component state/props ---
const generateLabel = (key) => {
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
};

const needed = ['Display name', 'Email', 'Department', 'Role', 'Join date', 'Status', 'Id'];

const defaultColumns = [
    { key: 'display name', label: 'Display name', filterable: true, expandable: true }, // Match needed label
    { key: 'email', label: 'Email', filterable: true },
    { key: 'department', label: 'Department', filterable: true },
    { key: 'role', label: 'Role' },
    { key: 'join date', label: 'Join date' }, // Match needed label
    { key: 'status', label: 'Status' },
    // Removed unused/less common defaults from original, add back if needed
    // { key: 'description', label: 'Description', expandable: true },
    { key: 'id', label: 'Id', filterable: false }, // Add Id to defaults if needed for fallback
];
// --- End Moved outside component ---

export default function MembersPage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cols, setCols] = useState(null);

    // Wrap loadData with useCallback
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        // Resetting cols/data might cause flicker if loading is fast, consider if needed
        // setCols(null);
        // setData(null);

        try {
            let { data: listUsersResponse, error: fetchError } = await supabase.auth.admin.listUsers();

            if (fetchError) {
                throw fetchError;
            }

            let membersData = listUsersResponse?.users || []; // Ensure we have an array

            membersData = membersData.map(member => {
                // Flatten user_metadata into the main object
                const { user_metadata, ...rest } = member;
                // Convert snake_case keys in user_metadata to space case for consistency
                const formattedMetadata = {};
                if (user_metadata) {
                    Object.keys(user_metadata).forEach(key => {
                        const spaceKey = key.replace(/_/g, ' ');
                        formattedMetadata[spaceKey] = user_metadata[key];
                    });
                }
                return {
                    ...rest,
                    ...formattedMetadata, // Spread formatted metadata
                    'join date': member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A', // Add join date from created_at
                    // Assuming 'status' might be in metadata or needs mapping
                    status: formattedMetadata.status || 'Active', // Example: provide default status
                    'display name': formattedMetadata['display name'] || member.email, // Default display name if missing
                };
            });


            setData(membersData); // Set the processed data

            // --- Dynamic Column Definition ---
            if (membersData && membersData.length > 0) {
                const sampleItem = membersData[0];
                const detectedKeys = Object.keys(sampleItem);
                // console.log("Detected keys:", detectedKeys); // Debugging log

                let arr = [];
                const dynamicCols = needed // Start from 'needed' to ensure order and inclusion
                    .map(neededLabel => {
                        // Find the corresponding key in the sample data (case-insensitive match if needed)
                        // We rely on the data transformation step above to ensure keys match 'needed' labels (e.g., 'display name')
                        const key = neededLabel === 'Id' ? 'id' : neededLabel.toLowerCase(); // map 'Id' to 'id', others to lowercase space case

                        if (!detectedKeys.includes(key)) {
                            // console.warn(`Needed column "${neededLabel}" (key: "${key}") not found in data sample.`);
                            return null; // Skip if key doesn't exist in the data
                        }

                        // Check explicit definition in defaultColumns using the label
                        const defaultCol = defaultColumns.find(col => col.label === neededLabel);

                        if (defaultCol) {
                            return {
                                ...defaultCol,
                                key: key, // Ensure the key matches the actual data key
                                label: neededLabel, // Use the label from 'needed'
                            };
                        }

                        // Infer basic properties if not in defaultColumns (less likely if defaultColumns covers 'needed')
                        let type = undefined;
                        let filterable = true;
                        let expandable = false;

                        if (neededLabel === 'Display name') expandable = true; // Example: make name expandable
                        if (neededLabel === 'Id') filterable = false; // Usually don't filter ID

                        return {
                            key: key,
                            label: neededLabel, // Use label from 'needed'
                            filterable: filterable,
                            type,
                            expandable,
                            // Add other inferred properties if necessary
                        };
                    })
                    .filter(col => col !== null); // Remove nulls for keys not found


                // console.log("Dynamic columns generated:", dynamicCols); // Debugging log
                setCols(dynamicCols);
            } else {
                // No data, use default columns matching 'needed' or show empty state
                // console.log("No member data found, attempting fallback columns.");
                // Filter defaultColumns to only include those in 'needed' and maintain order
                const fallbackCols = needed
                    .map(neededLabel => defaultColumns.find(col => col.label === neededLabel))
                    .filter(col => col !== undefined);
                setCols(fallbackCols.length > 0 ? fallbackCols : []); // Use filtered defaults or empty array
            }

        } catch (err) {
            console.error("Error loading data:", err);
            setError(err.message || "An unexpected error occurred while loading data.");
            setData([]); // Set empty data on error
            // Use filtered default cols on error as well
            const fallbackCols = needed
                .map(neededLabel => defaultColumns.find(col => col.label === neededLabel))
                .filter(col => col !== undefined);
            setCols(fallbackCols.length > 0 ? fallbackCols : []);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array is correct here because setters and external constants/imports are stable

    // --- Load data on mount ---
    useEffect(() => {
        loadData();
    }, [loadData]); // Now loadData is stable, effect runs only once on mount

    // --- Update Handler ---
    const handleSupabaseUpdate = useCallback(async (updatedItem) => { // Wrap in useCallback
        setError(null);
        try {
            const { id, email, 'join date': joinDate, status, ...metadataUpdates } = updatedItem; // Separate non-metadata fields
            if (!id) {
                throw new Error("Cannot update user without ID.");
            }

            // Convert keys with spaces back to snake_case for user_metadata
            const transformedMetadata = {};
            for (const key in metadataUpdates) {
                // Only include keys that likely belong in user_metadata
                // Exclude potential top-level fields if necessary
                if (key !== 'created_at' && key !== 'updated_at' /* add others? */) {
                    const snakeKey = key.replace(/ /g, '_'); // e.g., "display name" => "display_name"
                    transformedMetadata[snakeKey] = metadataUpdates[key];
                }
            }

            // console.log("Updating user metadata:", transformedMetadata);
            // console.log("Updating user core fields:", { email }); // Example if you allow email update

            // Prepare update payload
            const updatePayload = {
                user_metadata: transformedMetadata,
                // You can potentially update other fields like email here if needed/allowed
                // email: email, // Uncomment if email update is intended
            };

            const { error: updateError } = await supabase.auth.admin.updateUserById(id, updatePayload);

            if (updateError) throw updateError;

            // Update the local state optimistically
            setData(prev =>
                prev.map(item => (item.id === id ? updatedItem : item)) // Replace entire item
            );

        } catch (err) {
            console.error("Error updating user:", err);
            setError(`Failed to update user (ID: ${updatedItem.id}). ${err.message}`);
            // Optionally trigger a refresh here on error: loadData();
        }
    }, []); // Empty dependency array is likely okay, relies on setters and supabase

    // --- Delete Handler ---
    const handleSupabaseDelete = useCallback(async (idToDelete) => { // Wrap in useCallback
        setError(null);
        const originalData = data ? [...data] : []; // Ensure data is array before spreading

        // Optimistically remove from UI
        setData(prev => (prev ? prev.filter(item => item.id !== idToDelete) : []));

        try {
            const { error: deleteError } = await supabase.auth.admin.deleteUser(idToDelete);

            if (deleteError) throw deleteError;

        } catch (err) {
            console.error("Error deleting user:", err);
            setError(`Failed to delete user (ID: ${idToDelete}). ${err.message}`);
            // Rollback UI
            setData(originalData);
        }
    }, [data]); // Add `data` as dependency because it's used to create originalData for rollback

    // --- Refresh Handler ---
    // No need to wrap refresh in useCallback unless passed as prop or used in useEffect
    const refresh = () => {
        // No need for async/await here, loadData handles its own state
        loadData();
    };

    return (
        <>
            <Head>
                <title>Members</title>
            </Head>
            <div className='flex flex-col gap-4 min-h-screen bg-gray-100 dark:bg-gray-900'>
                <div className='flex flex-col gap-2 bg-gradient-to-br from-primary-dark to-primary-light p-6 sm:p-8 shadow-md'>
                    <h1 className='text-3xl sm:text-5xl font-black text-secondary-light text-center'>MEMBERS</h1>
                    {/* Add Refresh button near the title or table */}
                    <button
                        onClick={refresh}
                        disabled={isLoading}
                        className="mt-2 mx-auto px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded disabled:opacity-50"
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh List'}
                    </button>
                </div>

                {error && ( // Display error prominently
                    <div className="container mx-auto px-4 py-2">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    </div>
                )}


                <div className="container mx-auto px-4 py-4 flex-grow">
                    {isLoading && !data ? ( // Show loading spinner only on initial load
                        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex justify-center items-center">
                                {/* Spinner SVG */}
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            Loading members...
                        </div>
                    ) : (
                        // Check if cols are defined and data is an array before rendering table
                        Array.isArray(data) && cols ? (
                            data.length > 0 ? (
                                <SortableTable
                                    refresh={refresh} // Pass refresh down
                                    data={data}
                                    cols={cols}
                                    onUpdate={handleSupabaseUpdate}
                                    onDelete={handleSupabaseDelete}
                                    isLoading={isLoading} // Pass loading state for potential use in table
                                />
                            ) : (
                                // Handle empty data state after loading
                                <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                                    No members found.
                                </div>
                            )
                        ) : (
                            // Handle state where cols are not yet defined (should be brief)
                            <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                                Preparing table...
                            </div>
                        )
                    )}

                </div>
            </div>
        </>
    );
}