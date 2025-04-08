import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Optional: For setting page title
import SortableTable from '@/components/Admin/Table'; // Adjust path if needed
import { supabase } from '@/config/supabaseClient'; // Adjust path if needed

// Define default columns for reference (can be simplified or removed if truly dynamic)
const BASE_COLUMNS = [
    // Define non-field columns you ALWAYS want, if any.
    // Example:
    // { key: 'eventName', label: 'Event Name', filterable: true },
    // { key: 'userName', label: 'User Name', filterable: true },
    { key: 'timestamp', label: 'Timestamp', filterable: true, type: 'date' },
    // Add other known, non-'fields' columns here
];

// Helper to generate labels from keys (optional, but useful)
const generateLabel = (key) => {
    // Handle specific cases like 'field X'
    if (key.startsWith('field ')) {
        return `Field ${key.split(' ')[1]}`;
    }
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
};


export default function FormsPage() {
    const [data, setData] = useState(null); // Start with null to clearly indicate "not loaded yet"
    const [cols, setCols] = useState(null); // Start with null
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Combined Data Loading and Processing ---
    const loadAndProcessData = async () => {
        setIsLoading(true);
        setError(null);
        // Reset state before fetching
        setData(null);
        setCols(null);

        try {
            // 1. Fetch Raw Data
            const { data: rawData, error: fetchError } = await supabase
                .from('Forms')
                .select('*')
                .order('timestamp', { ascending: false });

            if (fetchError) throw fetchError;

            if (!rawData || rawData.length === 0) {
                setData([]);
                // Use BASE_COLUMNS OR decide on a different default if needed
                const initialCols = BASE_COLUMNS.map(col => ({ ...col })); // Make copies
                setCols(initialCols);
                setIsLoading(false);
                return;
            }

            // 2. Process Data & Find Max Fields
            let processedData = [];
            let maxFields = 0; // Track the maximum number of fields found ACROSS ALL ROWS
            const baseKeysFound = new Set(); // Keep track of non-field keys encountered

            for (const row of rawData) {
                const newRow = { ...row }; // Start with original row data
                let fieldCounter = 0;

                 // Add non-field keys from this row to our set
                Object.keys(row).forEach(key => {
                    if (key !== 'fields') { // Exclude the raw fields array itself
                        baseKeysFound.add(key);
                    }
                });

                if (row.fields && Array.isArray(row.fields) && row.fields.length > 0 && typeof row.fields[0] === 'string') {
                    try {
                        const fieldsObj = JSON.parse(row.fields[0]);
                        for (const value of Object.values(fieldsObj)) {
                            fieldCounter++;
                            const fieldName = `field ${fieldCounter}`;
                            newRow[fieldName] = value;
                        }
                    } catch (parseError) {
                        // console.error(`Error parsing fields JSON for row ID ${row.id}:`, parseError, "Raw fields:", row.fields[0]);
                        newRow.parseError = `Error parsing fields: ${parseError.message}`;
                        baseKeysFound.add('parseError'); // Add this special key if it occurs
                    }
                }

                // Update maxFields if this row has more fields than seen so far
                if (fieldCounter > maxFields) {
                    maxFields = fieldCounter;
                }

                // Optional: Remove the original 'fields' array
                // delete newRow.fields; // Uncomment if you don't want the 'fields' column

                processedData.push(newRow);
            }

            // 3. Determine Columns based on ALL potential keys
            let finalColumns = [];
            const allPossibleKeys = new Set(baseKeysFound); // Start with base keys found

            // Add all potential 'field X' keys up to the maximum found
            for (let i = 1; i <= maxFields; i++) {
                allPossibleKeys.add(`field ${i}`);
            }

            // Add any BASE_COLUMNS keys that might not have appeared in the data yet
            BASE_COLUMNS.forEach(col => allPossibleKeys.add(col.key));


            // Filter out keys we *never* want as columns
            const columnKeys = Array.from(allPossibleKeys).filter(key =>
                key !== 'fields' &&     // Exclude the original fields array (if not deleted earlier)
                key !== 'id' &&         // Usually handled internally by the table or not displayed
                key !== 'created_at' && // Often not needed in display table
                key !== 'updated_at'    // Often not needed in display table
                // Add any other keys to always exclude (e.g., maybe 'parseError' if you handle it differently)
            );


            // Map the final keys to column configuration objects
            finalColumns = columnKeys.map(key => {
                // Check if it's a predefined base column
                const baseCol = BASE_COLUMNS.find(c => c.key === key);
                if (baseCol) {
                    // Return a copy of the base column config to prevent potential mutation issues
                    return { ...baseCol };
                }

                // Default properties for dynamically found columns (including fields)
                const columnConfig = {
                    key: key,
                    label: generateLabel(key), // Use helper for label
                    filterable: true, // Default filterable
                    expandable: false, // Default not expandable
                    type: undefined,   // Default type
                };

                // Specific rules for 'field X' columns
                if (key.startsWith('field ')) {
                    columnConfig.expandable = true; // Good default for potentially long field values
                    // columnConfig.filterable = false; // Example: Maybe disable filtering for dynamic fields
                }

                // Infer type if not already set (like for timestamp)
                const lowerKey = key.toLowerCase();
                 if (!columnConfig.type && (lowerKey === 'timestamp' || lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('received'))) {
                     columnConfig.type = 'date';
                 }
                 // Add other type inference here if needed (e.g., number)

                return columnConfig;
            });

            // Sort columns logically (e.g., base columns first, then fields numerically)
            finalColumns.sort((a, b) => {
                const aIsBase = BASE_COLUMNS.some(c => c.key === a.key);
                const bIsBase = BASE_COLUMNS.some(c => c.key === b.key);
                const aIsField = a.key.startsWith('field ');
                const bIsField = b.key.startsWith('field ');

                // Prioritize Base Columns defined in BASE_COLUMNS
                const baseIndexA = BASE_COLUMNS.findIndex(c => c.key === a.key);
                const baseIndexB = BASE_COLUMNS.findIndex(c => c.key === b.key);

                if (baseIndexA !== -1 && baseIndexB !== -1) return baseIndexA - baseIndexB; // Sort by BASE_COLUMNS order
                if (baseIndexA !== -1) return -1; // Base columns come first
                if (baseIndexB !== -1) return 1;

                // Then sort Fields numerically
                if (aIsField && bIsField) {
                    return parseInt(a.key.split(' ')[1], 10) - parseInt(b.key.split(' ')[1], 10);
                }
                if (aIsField) return 1; // Fields come after other non-base columns
                if (bIsField) return -1;

                // Finally, sort any remaining non-base, non-field columns alphabetically (e.g., 'parseError')
                return a.key.localeCompare(b.key);
            });

            // 4. Set State ONCE
            setData(processedData);
            setCols(finalColumns);

        } catch (err) {
            // console.error("Error loading or processing Form data:", err);
            setError(err.message || "An unexpected error occurred.");
            setData([]);
            setCols(BASE_COLUMNS.map(col => ({ ...col }))); // Use copies of base columns on error
        } finally {
            setIsLoading(false);
        }
    };


    // --- Initial Load Effect ---
    useEffect(() => {
        loadAndProcessData();
        // No dependency array needed if Supabase real-time updates are handled separately or via refresh
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs only once on mount

    // --- Update Handler (Keep as is) ---
    const handleSupabaseUpdate = async (updatedItem) => {
        setError(null);
        try {
            const { id, ...updateData } = updatedItem;
            if (!id) throw new Error("Cannot update item without ID.");

            // Remove processed 'field X' columns before updating, keep original 'fields' if needed
            const originalUpdateData = { ...updateData };
            Object.keys(originalUpdateData).forEach(key => {
                if (key.startsWith('field ')) {
                    delete originalUpdateData[key];
                }
            });
            // If your 'fields' column needs to be updated based on changes,
            // you would need to reconstruct the JSON object here before saving.
            // This example assumes you only update other base columns.
            // If you allow editing 'field X' values, you need more complex logic here.

            const { error: updateError } = await supabase
                .from('Forms')
                .update(originalUpdateData) // Update with cleaned data
                .eq('id', id);

            if (updateError) throw updateError;

            // Optimistic UI update (reflects changes immediately)
            setData(prevData =>
                prevData.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
            );

        } catch (err) {
            // console.error("Error updating Form:", err);
            setError(`Failed to update Form (ID: ${updatedItem.id}). ${err.message}`);
            // Optional: force reload on update error to get consistent state
            // await loadAndProcessData();
        }
    };

    // --- Delete Handler (Keep as is) ---
    const handleSupabaseDelete = async (idToDelete) => {
        setError(null);
        const originalData = data ? [...data] : []; // Store for rollback

        // Optimistic UI update
        setData(prevData => prevData ? prevData.filter(item => item.id !== idToDelete) : []);

        try {
            const { error: deleteError } = await supabase
                .from('Forms')
                .delete()
                .eq('id', idToDelete);

            if (deleteError) throw deleteError;
            // Success - UI already updated

        } catch (err) {
            // console.error("Error deleting Form:", err);
            setError(`Failed to delete Form (ID: ${idToDelete}). ${err.message}`);
            // Rollback UI on error
            setData(originalData);
        }
    };

    // --- Refresh Handler ---
    const refresh = async () => {
        // setIsLoading(true); // loadAndProcessData handles this
        await loadAndProcessData();
        // setIsLoading(false); // loadAndProcessData handles this
    };

    // --- Render Logic (Mostly unchanged) ---
    return (
        <>
            <Head>
                <title>Received Forms</title>
            </Head>
            <div className='flex flex-col min-h-screen gap-4 bg-gray-100 dark:bg-gray-900'>
                {/* Header */}
                <div className='flex flex-col gap-2 p-6 shadow-md bg-gradient-to-br from-primary-dark to-primary-light sm:p-8'>
                    <h1 className='text-3xl font-black text-center sm:text-5xl text-secondary-light'>FORMS</h1>
                </div>

                {/* Main Content Area */}
                <div className="container flex-grow px-4 py-4 mx-auto">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md dark:text-red-400 dark:bg-red-900/30 dark:border-red-600">
                            <strong>Error:</strong> {error} <button onClick={() => setError(null)} className="float-right font-bold">X</button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && ( // Show loader only when isLoading is true
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex items-center justify-center">
                                {/* Spinner SVG */}
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            Loading Forms...
                        </div>
                    )}

                    {/* Render Table only when NOT loading and data/cols are ready */}
                    {!isLoading && cols && data ? (
                         data.length > 0 ? (
                            <SortableTable
                                refresh={refresh}
                                data={data}
                                cols={cols}
                                onUpdate={handleSupabaseUpdate}
                                onDelete={handleSupabaseDelete}
                                // Pass other necessary props to SortableTable
                            />
                        ) : (
                             // Explicit No Data Message (when not loading and data array is empty)
                             <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                                No form submissions found.
                             </div>
                        )
                    ) : null} {/* Render nothing if loading or if cols/data are still null */}

                </div>
            </div>
        </>
    );
}