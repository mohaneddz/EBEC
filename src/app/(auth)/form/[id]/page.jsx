"use client";

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/config/supabaseClient'; // Adjust path
import { IconLoader } from '@tabler/icons-react'; // For loading state
import {
    SimpleInput,
    Dropdown,
    Checkbox,       // Keep this for single/group checkboxes
    RadioButton,
    Button
} from '@/components/Global/FormElements'; // Adjust path

export default function Page({ params }) {
    const [formDefinition, setFormDefinition] = useState([]);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [formTitle, setFormTitle] = useState('Form');
    const [formDescription, setFormDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    const unwrappedParams = use(params);
    const id = unwrappedParams?.id;

    // --- Fetch Form Definition ---
    useEffect(() => {
        if (!id) { /* ... no change ... */
            setFetchError("No Form ID found in the URL.");
            setIsLoading(false);
            setIsFormOpen(false);
            return;
        }

        const fetchForm = async () => {
            /* ... no change in fetching logic itself ... */
            setIsLoading(true);
            setFetchError(null);
            setFormDefinition([]);
            setFormData({});
            setErrors({});
            setIsFormOpen(true);

            try {
                const { data: formRowData, error } = await supabase
                    .from('Upcomings')
                    .select('*')
                    .eq('id', id)
                    .single();
                // ... (error handling, open check remain the same) ...
                if (error) {
                    if (error.code === 'PGRST116') throw new Error(`Form with ID "${id}" not found.`);
                    else throw error;
                }
                if (!formRowData) throw new Error(`Form data unexpectedly missing for ID "${id}".`);
                if (formRowData.open === false) {
                    setFetchError("Registrations are currently closed for this form.");
                    setIsLoading(false); setIsFormOpen(false);
                    setFormTitle(formRowData.name || `Form ${id}`);
                    setFormDescription(formRowData.description || '');
                    return;
                }

                const formDefinitionArray = formRowData.form;
                if (!formDefinitionArray || !Array.isArray(formDefinitionArray)) {
                    throw new Error(`Form definition ('form' column) is missing, empty, or not an array for ID "${id}".`);
                }

                // --- Initialize State ---
                const initialFormData = {};
                const initialErrors = {};
                let hasMissingName = false;

                formDefinitionArray.forEach((field, index) => {
                    if (!field.label || typeof field.label !== 'string' || !field.label.trim()) { /* ... name validation ... */
                        console.error(`Form field at index ${index} missing valid 'name':`, field);
                        setFetchError(`Config error: Field missing 'name'. Contact admin.`); hasMissingName = true; return;
                    }
                    if (initialFormData.hasOwnProperty(field.label)) { /* ... duplicate name check ... */
                        console.error(`Duplicate field name "${field.label}" at index ${index}.`);
                        setFetchError(`Config error: Duplicate name "${field.label}". Contact admin.`); hasMissingName = true; return;
                    }

                    // *** MODIFIED INITIALIZATION ***
                    if (field.type === 'checkbox') {
                        // If it's a group (has options), initialize as array
                        if (Array.isArray(field.options) && field.options.length > 0) {
                            initialFormData[field.label] = [];
                        } else {
                            // If it's a single checkbox (no options), initialize as boolean false
                            initialFormData[field.label] = false;
                        }
                    } else if (field.type === 'file') {
                        initialFormData[field.label] = null; // Initialize file inputs as null
                    }
                    else {
                        initialFormData[field.label] = ''; // Default empty string for others
                    }
                    initialErrors[field.label] = ''; // Initialize empty error
                });
                // ... (rest of useEffect remains the same) ...
                if (hasMissingName) { setIsLoading(false); setFormDefinition([]); return; }
                setFormDefinition(formDefinitionArray); setFormData(initialFormData); setErrors(initialErrors);
                setFormTitle(formRowData.name || `Form ${id}`); setFormDescription(formRowData.brief || '');
            } catch (err) { /* ... error handling ... */
                console.error("Error fetching/processing form:", err); setFetchError(err.message || "Failed form load.");
                setFormDefinition([]); setFormData({}); setErrors({}); setIsFormOpen(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchForm();
    }, [id]);


    // --- Input Handlers ---

    // Modified Generic handler
    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target; // 'name' must match field.label

        let newValue;
        if (type === 'checkbox') {
            // This case is now ONLY for SINGLE checkboxes (handled in renderField)
            newValue = checked; // Store the boolean value
        } else if (type === 'file') {
            // Store the File object itself (or null if cleared)
            newValue = files && files.length > 0 ? files[0] : null;
            console.log(`File selected for ${name}:`, newValue); // Debug log
        }
        else {
            newValue = value; // Standard value for text, select, radio, etc.
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Specific handler ONLY for checkbox GROUPS
    const handleCheckboxGroupChange = (e) => {
        const { name, value, checked } = e.target; // 'name' is group, 'value' is option value
        setFormData(prev => {
            const currentValues = prev[name] || [];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter(item => item !== value);
            return { ...prev, [name]: newValues };
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // --- Dynamic Validation ---
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        formDefinition.forEach(field => {
            const fieldName = field.label;
            if (!fieldName) return;

            const value = formData[fieldName];
            const constraints = field.constraints || {};
            let errorMsg = '';

            // 1. Required Check (Modified)
            if (constraints.required) {
                let isEmpty = false;
                const isGroupCheckbox = field.type === 'checkbox' && Array.isArray(field.options) && field.options.length > 0;
                const isSingleCheckbox = field.type === 'checkbox' && (!field.options || field.options.length === 0);

                if (isGroupCheckbox) {
                    isEmpty = !value || value.length === 0; // Group needs at least one selection
                } else if (isSingleCheckbox) {
                    isEmpty = value !== true; // Single required checkbox must be checked (true)
                } else if (field.type === 'file') {
                    isEmpty = !value; // File input needs a file object
                } else if (typeof value === 'string') {
                    isEmpty = !value.trim();
                } else {
                    isEmpty = value === undefined || value === null || value === ''; // General check
                }

                if (isEmpty) {
                    errorMsg = `${field.label || 'This field'} is required.`;
                    // Add more specific message for single checkbox if needed
                    if (isSingleCheckbox) errorMsg = `You must accept ${field.label || 'the terms'}.`;
                }
            }

            // 2. MinLength (Only for string types)
            if (!errorMsg && constraints.minLength > 0 && (field.type === 'text' || field.type === 'textarea' || field.type === 'url' || field.type === 'tel' || field.type === 'email') && typeof value === 'string' && value.length < constraints.minLength) {
                errorMsg = `${field.label || 'This field'} must be at least ${constraints.minLength} characters long.`;
            }

            // 3. MaxLength (Only for string types)
            if (!errorMsg && constraints.maxLength > 0 && (field.type === 'text' || field.type === 'textarea' || field.type === 'url' || field.type === 'tel' || field.type === 'email') && typeof value === 'string' && value.length > constraints.maxLength) {
                errorMsg = `${field.label || 'This field'} cannot exceed ${constraints.maxLength} characters.`;
            }

            // 4. Pattern Check (Only for string types)
            if (!errorMsg && constraints.pattern && (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url') && typeof value === 'string' && value) {
                try {
                    if (!new RegExp(constraints.pattern).test(value)) {
                        errorMsg = field.patternErrorMessage || `${field.label || 'This field'} format is invalid.`;
                    }
                } catch (e) { console.error(`Invalid regex: ${constraints.pattern}`, e); }
            }

            // Assign error
            if (errorMsg) { newErrors[fieldName] = errorMsg; isValid = false; }
            else { newErrors[fieldName] = ''; }
        });
        setErrors(newErrors);
        return isValid;
    };

    // --- Form Submission (TODO needs actual logic) ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFormOpen) {
            alert("Registrations are currently closed.");
            return;
        }
        setIsSubmitting(true);
        setFetchError(null); // Clear previous submission errors

        if (validateForm()) {
            console.log("Form Data is Valid:", formData);

            try {
                // 1. Prepare the Fields object for JSONB storage
                const fieldsObject = {};
                formDefinition.forEach(field => {
                    const key = field.label; // Use the defined label as the key
                    if (formData.hasOwnProperty(key)) { // Ensure the key exists in formData
                         const value = formData[key];
                         // Store value directly (JSONB handles arrays, strings, numbers, booleans, null)
                         // Convert undefined to null for cleaner JSON storage
                        fieldsObject[key] = value === undefined ? null : value;
                    } else {
                        // Handle case where field was defined but missing in data (shouldn't happen with proper init)
                        console.warn(`Field "${key}" defined but not found in formData.`);
                        fieldsObject[key] = null;
                    }
                });

                 // 2. Get user name (MAKE SURE 'Name' matches your actual form field label)
                 const submitterName = formData['Name'] || 'Unknown User'; // Adjust 'Name' if needed
                 if (!formData['Name']) {
                    console.warn("Submitter 'Name' field not found in form data. Using 'Unknown User'.");
                 }

                 // 3. Construct the payload for the 'Forms' table
                 const submissionPayload = {
                    eventName: formTitle,       // The title fetched from Upcomings table
                    userName: submitterName,    // The user's name from the form
                    Fields: fieldsObject,       // The JSONB object containing all fields
                    // Add 'upcoming_id: id,' here if you add that column to your Forms table
                 };

                console.log("Submitting Payload:", submissionPayload);

                // 4. Insert into the 'Forms' table
                const { data, error } = await supabase
                    .from('Forms') // Target the new table
                    .insert([submissionPayload])
                    .select(); // Optionally select the inserted data back

                if (error) {
                    console.error("Supabase insertion error:", error);
                    throw new Error(`Failed to submit form: ${error.message}`); // Throw specific error
                }

                console.log("Submission successful:", data);
                alert('Form submitted successfully!');
                // Optionally reset form:
                // setFormData({}); // Reset based on initial values if needed
                // Or navigate away, show success message, etc.

            } catch (submissionError) {
                console.error("Submission Process Error:", submissionError);
                // Display a user-friendly error message
                setFetchError(submissionError.message || "An error occurred during submission. Please try again.");
                alert(`Submission Failed: ${submissionError.message}`); // Also alert
            }

        } else {
            console.log("Validation Failed:", errors);
             // Focus on the first field with an error (optional usability improvement)
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            if (firstErrorField) {
                 const fieldElement = document.getElementById(firstErrorField); // Assumes input ID matches label
                 fieldElement?.focus();
                 fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        setIsSubmitting(false);
    };


    // --- Render Helper (MODIFIED) ---
    const renderField = (field) => {
        const fieldName = field.label;
        const fieldLabel = field.label;
        const fieldType = field.type;
        const constraints = field.constraints || {};
        const placeholder = field.placeholder || '';
        const error = errors[fieldName];
        const value = formData[fieldName]; // This is now boolean for single checkbox, File for file, array for group checkbox
        const commonProps = {
            id: fieldName, name: fieldName, label: fieldLabel, error: error,
            required: constraints.required || false,
            // maxLength applies mainly to text inputs
            maxLength: (fieldType === 'text' || fieldType === 'textarea') && constraints.maxLength && constraints.maxLength !== Infinity ? constraints.maxLength : undefined,
            disabled: isSubmitting, // Disable all fields during submission
        };

        switch (fieldType) {
            // Standard text-based inputs
            case 'text': case 'email': case 'tel': case 'url': case 'number': case 'date':
                return <SimpleInput {...commonProps} type={fieldType} placeholder={placeholder} value={value || ''} onChange={handleInputChange} minLength={constraints.minLength > 0 ? constraints.minLength : undefined} />;
            // Textarea
            case 'textarea':
                return <SimpleInput {...commonProps} type="textarea" placeholder={placeholder} value={value || ''} onChange={handleInputChange} minLength={constraints.minLength > 0 ? constraints.minLength : undefined} />;
            // Select Dropdown
            case 'select':
                return <Dropdown {...commonProps} options={field.options || []} value={value || ''} onChange={handleInputChange} placeholder={placeholder || '-- Select --'} />;
            // Radio Button Group
            case 'radio':
                return (
                    <fieldset className="mb-1">
                        <legend className="block text-sm font-medium mb-2 text-slate-200">{fieldLabel}{commonProps.required && <span className="text-yellow-400">*</span>}</legend>
                        {error && <p className={`-mt-1 mb-1.5 text-xs text-red-400`}>{error}</p>}
                        <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 justify-center md:justify-start">
                            {(field.options || []).map(option => (
                                <RadioButton key={option.value} id={`${fieldName}-${option.value}`} name={fieldName} label={option.label} value={option.value} checked={value === option.value} onChange={handleInputChange} disabled={isSubmitting} />
                            ))}
                        </div>
                    </fieldset>
                );
            // *** MODIFIED CHECKBOX LOGIC ***
            case 'checkbox':
                // Check if it's a group (has options) or a single checkbox
                if (Array.isArray(field.options) && field.options.length > 0) {
                    // --- Render Checkbox Group ---
                    return (
                        <fieldset className="mb-1">
                            <legend className="block text-sm font-medium mb-2 text-slate-200">{fieldLabel}{commonProps.required && <span className="text-yellow-400">*</span>}</legend>
                            {error && <p className={`-mt-1 mb-1.5 text-xs text-red-400`}>{error}</p>}
                            <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 justify-center md:justify-start">
                                {field.options.map(option => (
                                    <Checkbox
                                        key={option.value}
                                        id={`${fieldName}-${option.value}`}
                                        name={fieldName} // Group name
                                        label={option.label}
                                        value={option.value} // Option value
                                        // 'value' here is the formData array for the group
                                        checked={(value || []).includes(option.value)}
                                        onChange={handleCheckboxGroupChange} // Use GROUP handler
                                        disabled={isSubmitting}
                                    />
                                ))}
                            </div>
                        </fieldset>
                    );
                } else {
                    // --- Render Single Checkbox ---
                    return (
                        <div className="mb-1 flex justify-center md:justify-start"> {/* Align single checkbox */}
                            <Checkbox
                                {...commonProps}
                                // 'value' for a single checkbox is typically not needed, 'checked' is the state
                                checked={!!value} // Ensure value is treated as boolean
                                onChange={handleInputChange} // Use standard handler (it checks e.target.checked)
                                disabled={isSubmitting}
                            />
                            {/* Error shown by the Checkbox component itself via commonProps */}
                        </div>
                    );
                }
            // *** ADDED FILE INPUT CASE ***
            case 'file':
                return (
                    // Using SimpleInput but ensuring type="file"
                    // Note: 'value' prop doesn't work for file inputs for security reasons
                    // We manage the selected file in formData state via handleInputChange
                    <SimpleInput
                        {...commonProps}
                        label={`${fieldLabel}${commonProps.required ? '*' : ''}`} // Ensure label shows required
                        type="file"
                        // Pass accept constraint if provided in JSON (e.g., constraints: { accept: 'image/*,.pdf' })
                        accept={constraints.accept || undefined}
                        onChange={handleInputChange}
                    // Don't pass 'value' prop to file input
                    // Error message will be displayed below by SimpleInput
                    />
                );
            // Fallback for unsupported types
            default:
                return <p className="text-yellow-400 text-sm my-2 p-2 bg-yellow-900/30 rounded border border-yellow-600">Note: Unsupported field type "{fieldType}" for "{fieldLabel}".</p>;
        }
    };

    // --- Main Render (No changes needed in the structure) ---

    if (isLoading) { return ( /* Loading indicator */ <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 bg-fixed flex items-center justify-center p-4"><IconLoader size={40} className="animate-spin text-slate-400" /></div>); }

    if (!isFormOpen || fetchError) { return ( /* Error/Closed display */ <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 bg-fixed flex items-center justify-center p-4"><div className="bg-slate-800/80 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl w-screen md:max-w-xl md:w-full border border-slate-700 text-center"><h1 className="text-2xl font-semibold text-white mb-2">{formTitle}</h1>{formDescription && <p className="text-slate-300 text-sm mb-6">{formDescription}</p>}<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold block sm:inline">Notice:</strong><span className="block sm:inline ml-1"> {fetchError || "Registrations are currently closed."}</span></div></div></div>); }

    return (
        // Main form structure
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 bg-fixed flex items-center justify-center md:p-4 font-sans">
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl w-screen h-screen md:h-auto md:max-h-[90vh] overflow-y-auto md:max-w-2xl md:w-full border border-slate-700">
                {/* Header */}
                <header className="text-center mb-8 border-b border-slate-700 pb-6"> <h1 className="text-3xl font-semibold text-white mb-2">{formTitle}</h1> {formDescription && (<p className="text-slate-300 text-sm">{formDescription}</p>)} {formDefinition.some(f => f.constraints?.required) && (<p className="text-slate-400 text-xs mt-2">Fields marked <span className="text-yellow-400 font-medium">*</span> are required.</p>)} </header>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5"> {formDefinition.map((field) => (<div key={field.label || field.label + field.type}>{renderField(field)}</div>))} <div className="pt-4 text-center"> <Button type="submit" text={isSubmitting ? "Submitting..." : "Submit Information"} disabled={isSubmitting || !isFormOpen} /> {/* Submission error display... */} </div> </form>
                {/* Footer */}
                <footer className="text-center mt-10 pt-6 border-t border-slate-700"> <p className="text-xs text-slate-500">ENSIA's Business & Entrepreneurship <br /> Glad to have you here </p> </footer>
            </div>
        </div>
    );
};