import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Optional: For setting page title
import SortableTable from '@/components/Admin/Table'; // Adjust path if needed
import { supabase } from '@/config/supabaseClient'; // Adjust path if needed

// Define default columns for reference and explicit settings
const defaultColumns = [
    { key: 'eventName', label: 'Event Name', filterable: true },
    { key: 'userName', label: 'User Name', filterable: true },
    { key: 'timestamp', label: 'Timestamp', filterable: true, type: 'date' },
];

// Helper to generate labels from keys
const generateLabel = (key) => {
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
};

export default function FormsPage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cols, setCols] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        setCols(null);
        setData(null);

        try {
            const { data: FormsData, error: fetchError } = await supabase
                .from('Forms') // Your table name
                .select('*')
                .order('timestamp', { ascending: false }); // Adjust column name if needed
            if (fetchError) throw fetchError;

            setData(FormsData || []);
            // console.log("FormsData:", FormsData);

            // --- Dynamic Column Definition ---
            if (FormsData && FormsData.length > 0) {
                const sampleItem = FormsData[0];
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
                        let expandable = false;
                        let filterable = true;
                        let type = undefined;
                        const lowerKey = key.toLowerCase();

                        // Infer expandable
                        if (lowerKey.includes('field')) {
                            expandable = true;
                            filterable = false; // Don't filter long text
                        }

                        // Basic date hint
                        if (lowerKey === 'date' || lowerKey.includes('time') || lowerKey.includes('received')) {
                            type = 'date';
                        }

                        return {
                            key: key,
                            label: generateLabel(key),
                            filterable: filterable,
                            expandable,
                            type
                            // Forms usually don't have images, so no image detection needed here
                        };
                    });
                spreadFields();
            } else {
                setCols(defaultColumns); // Fallback
            }

        } catch (err) {
            console.error("Error loading Form data:", err);
            setError(err.message || "An unexpected error occurred while loading Forms.");
            setData([]);
            setCols(defaultColumns); // Use defaults on error
        } finally {
            setIsLoading(false);
            // console.log('Data:', data);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const spreadFields = () => {
        if (!data || data.length === 0) return;

        // Create properly sized array for results
        let formattedData = [];

        // Process each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row.fields || row.fields.length === 0) continue;

            try {
                // Parse the stringified JSON from the array
                const fieldsObj = JSON.parse(row.fields[0]);

                // Create a new object with the original row data
                const newRow = { ...row };

                // Add each field with generic field names (field 1, field 2, etc.)
                let fieldCounter = 1;
                for (const [key, value] of Object.entries(fieldsObj)) {
                    // Use "field X" naming convention
                    const fieldName = `field ${fieldCounter}`;

                    // Store both the original field name and value
                    newRow[fieldName] = value;

                    fieldCounter++;
                }

                // Store the total number of fields
                newRow.totalFields = fieldCounter - 1;

                formattedData.push(newRow);
            } catch (err) {
                console.error("Error parsing fields for row:", row.id, err);
                // Add the row without parsed fields
                formattedData.push(row);
            }
        }

        console.log("Formatted Data:", formattedData);

        // create an array of 'field x' for max fields
        const fieldNames = Object.keys(formattedData[0] || {}).filter(key => key.startsWith('field '));
        const maxFields = Math.max(...fieldNames.map(name => parseInt(name.split(' ')[1], 10)));
        const fieldColumns = Array.from({ length: maxFields }, (_, i) => `field ${i + 1}`);

        // combine with existing columns

        let allKeys = Array.from(new Set([
            ...Object.keys(formattedData[0] || {}), // Original keys
            ...fieldColumns // New field columns
        ]));

        setCols(allKeys.filter(key => key !== 'fields'));
        setData(formattedData.filter(row => row.fields && row.fields.length > 0)); 

        return formattedData;
    };

    // Helper function to update columns based on the processed data
    const updateColumnsForFields = (formattedData) => {
        if (!formattedData || formattedData.length === 0) return;

        // Find maximum number of fields across all rows
        const maxFields = Math.max(...formattedData.map(row => row.totalFields || 0));

        // Get existing columns without field columns
        const existingCols = cols?.filter(col => !col.key.startsWith('field ')) || [];

        // Create new field columns
        const fieldColumns = [];
        for (let i = 1; i <= maxFields; i++) {
            fieldColumns.push({
                key: `field ${i}`,
                label: `Field ${i}`,
                filterable: true,
                expandable: true
            });
        }

        // Combine existing columns with field columns
        setCols([...existingCols, ...fieldColumns]);
    };

    // --- Update Handler ---
    const handleSupabaseUpdate = async (updatedItem) => {
        setError(null);
        try {
            const { id, ...updateData } = updatedItem;
            if (!id) throw new Error("Cannot update item without ID.");

            // Add updated_at timestamp if your table has it
            // updateData.updated_at = new Date().toISOString();

            const { error: updateError } = await supabase
                .from('Forms')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            // Optimistic updates
            setData(prevData =>
                prevData.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
            );

        } catch (err) {
            console.error("Error updating Form:", err);
            setError(`Failed to update Form (ID: ${updatedItem.id}). ${err.message}`);
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
                .from('Forms')
                .delete()
                .eq('id', idToDelete);

            if (deleteError) throw deleteError;
            // Success

        } catch (err) {
            console.error("Error deleting Form:", err);
            setError(`Failed to delete Form (ID: ${idToDelete}). ${err.message}`);
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
                <title>Received Forms</title>
            </Head>
            {/* Use same layout structure */}
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
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                            <div role="status" className="flex items-center justify-center">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Spinner SVG Paths */}
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            Loading Forms...
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
                        ) : null
                    )}
                    {/* Explicit No Data Message */}
                    {!isLoading && cols && data && data.length === 0 && (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}