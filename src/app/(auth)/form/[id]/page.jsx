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
import Toast from '@/components/Global/Toast';

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
                        // console.error(`Form field at index ${index} missing valid 'name':`, field);
                        setFetchError(`Config error: Field missing 'name'. Contact admin.`); hasMissingName = true; return;
                    }
                    if (initialFormData.hasOwnProperty(field.label)) { /* ... duplicate name check ... */
                        // console.error(`Duplicate field name "${field.label}" at index ${index}.`);
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
                // console.error("Error fetching/processing form:", err); setFetchError(err.message || "Failed form load.");
                setFormDefinition([]); setFormData({}); setErrors({}); setIsFormOpen(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target; // 'name' must match field.label

        let newValue;
        if (type === 'checkbox') {
            // This case is now ONLY for SINGLE checkboxes (handled in renderField)
            newValue = checked; // Store the boolean value
        } else if (type === 'file') {
            // Store the File object itself (or null if cleared)
            newValue = files && files.length > 0 ? files[0] : null;
            // console.log(`File selected for ${name}:`, newValue); // Debug log
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
                } catch (e) { 
                    // console.error(`Invalid regex: ${constraints.pattern}`, e); 
                }
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
        if (!isFormOpen) { // Assuming isFormOpen state exists
            <Toast variant='warning' message="Form is currently closed :("></Toast>
            return;
        }
        setIsSubmitting(true); // Assuming setIsSubmitting state exists
        setFetchError(null);   // Assuming setFetchError state exists
    
        // Clear previous errors if using error state object
        // setErrors({}); // Assuming setErrors state hook exists for validation errors
    
        if (validateForm()) { // Assuming validateForm function exists and sets errors state
            // console.log("Form Data is Valid:", formData);
    
            try {
                // --- Get Current User ---
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                // console.log('Name : ', user.user_metadata?.display_name)
    
                if (userError) {
                    // console.error("Error fetching user:", userError);
                    throw new Error("Could not retrieve user information. Please ensure you are logged in.");
                }
                if (!user) {
                    throw new Error("No logged-in user found. Please log in and try again.");
                }
    
                // Get display name, fallback to email, then to a generic placeholder
                const submitterUserName = user.user_metadata?.display_name || user.email || 'Registered User (No Name)';
                const submitterUseEmail = user.email;
                // console.log("Submitter User Name:", submitterUserName);
    
                // --- Prepare the Fields object for JSONB storage ---
                const fieldsObject = {};
                formDefinition.forEach((field) => { // Assuming formDefinition exists
                    const fieldLabel = field.label; // The key used in formData state
                    const fieldValue = formData[fieldLabel]; // Get value from state
    
                    // Use the field label as the key within the JSON object,
                    // or use a generic "Field N: Value" structure if preferred.
                    // Using label here for better readability in the database JSON.
                    fieldsObject[fieldLabel] = fieldValue === undefined ? null : fieldValue;
    
                    // --- Alternative: Generic Field Keying (like original) ---
                    // const key = `Field ${index + 1}`;
                    // if (formData.hasOwnProperty(fieldLabel)) {
                    //     const value = formData[fieldLabel];
                    //     fieldsObject[key] = value === undefined ? null : value;
                    // } else {
                    //     console.warn(`Field "${fieldLabel}" defined but not found in formData.`);
                    //     fieldsObject[key] = null; // Or handle differently
                    // }
                    // --- End Alternative ---
                });
    
                // --- Create Timestamp ---
                const submissionTimestamp = new Date().toISOString();
    
                // --- Construct the payload for the 'Forms' table ---
                const submissionPayload = {
                    eventName: formTitle, // Assuming formTitle variable exists
                    userName: submitterUserName, // Use the fetched user name
                    userEmail: submitterUseEmail, // Use the fetched user email
                    fields: [fieldsObject],      // Wrap the fields object in an array for JSONB[]
                    timestamp: submissionTimestamp, // Add the timestamp
                    // Optional: Add user_id if you have a column for it
                    // user_id: user.id,
                    // Optional: Add upcoming_id if needed
                    // upcoming_id: id, // Assuming 'id' variable (from props/state) holds the upcoming event ID
                };
    
                // console.log("Submitting Payload:", submissionPayload);
    
                // --- Insert into the 'Forms' table ---
                const { data: insertedData, error: insertError } = await supabase
                    .from('Forms')
                    .insert([submissionPayload])
                    .select(); // Select to get the inserted row back (optional)
    
                if (insertError) {
                    // console.error("Supabase insertion error:", insertError);
                    // Provide more specific feedback if possible (e.g., check constraints)
                    throw new Error(`Failed to submit form: ${insertError.message}`);
                }
    
                // console.log("Submission successful:", insertedData);
                // alert('Form submitted successfully!'); // User feedback
                <Toast variant='success' message={'Form submitted successfully!'}></Toast>
    
                // Optionally reset form or navigate away
                // resetForm(); // Implement a function to reset formData and errors
                // router.push('/success-page'); // If using Next.js router
    
            } catch (submissionError) {
                // console.error("Submission Process Error:", submissionError);
                // Display a user-friendly error message using state
                setFetchError(submissionError.message || "An error occurred during submission. Please try again.");
                // Keep the alert as fallback or primary notification
                // alert(`Submission Failed: ${submissionError.message}`);
                <Toast variant='error' message={'Submission Failed, Please contact the admins'}></Toast>
            }
    
        } else {
            // console.log("Validation Failed:", errors); // Assuming errors state object exists
            setFetchError("Please fix the errors highlighted below."); // Set a general validation error message
            // Focus logic (keep as is)
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            if (firstErrorField) {
                // Ensure your form inputs have an 'id' that matches the keys in your 'errors' object
                const fieldElement = document.getElementById(firstErrorField);
                fieldElement?.focus();
                fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        setIsSubmitting(false); // Ensure this runs even if validation fails or an error occurs
    };

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
                        <legend className="block mb-2 text-sm font-medium text-slate-200">{fieldLabel}{commonProps.required && <span className="text-yellow-400">*</span>}</legend>
                        {error && <p className={`-mt-1 mb-1.5 text-xs text-red-400`}>{error}</p>}
                        <div className="flex flex-wrap justify-center pt-1 gap-x-6 gap-y-1 md:justify-start">
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
                            <legend className="block mb-2 text-sm font-medium text-slate-200">{fieldLabel}{commonProps.required && <span className="text-yellow-400">*</span>}</legend>
                            {error && <p className={`-mt-1 mb-1.5 text-xs text-red-400`}>{error}</p>}
                            <div className="flex flex-wrap justify-center pt-1 gap-x-6 gap-y-1 md:justify-start">
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
                        <div className="flex justify-center mb-1 md:justify-start"> {/* Align single checkbox */}
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
                return <p className="p-2 my-2 text-sm text-yellow-400 border border-yellow-600 rounded bg-yellow-900/30">Note: Unsupported field type &ldquo;{fieldType}&ldquo; for &ldquo;{fieldLabel}&ldquo;.</p>;
        }
    };

    // --- Main Render (No changes needed in the structure) ---
    if (isLoading) { return ( /* Loading indicator */ <div className="flex items-center justify-center min-h-screen p-4 bg-fixed bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"><IconLoader size={40} className="animate-spin text-slate-400" /></div>); }

    if (isLoading) { return ( /* Loading indicator */ <div className="flex items-center justify-center min-h-screen p-4 bg-fixed bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"><IconLoader size={40} className="animate-spin text-slate-400" /></div>); }

    if (!isFormOpen || fetchError) { return ( /* Error/Closed display */ <div className="flex items-center justify-center min-h-screen p-4 bg-fixed bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"><div className="w-screen p-6 text-center border shadow-2xl bg-slate-800/80 backdrop-blur-sm sm:p-10 rounded-xl md:max-w-xl md:w-full border-slate-700"><h1 className="mb-2 text-2xl font-semibold text-white">{formTitle}</h1>{formDescription && <p className="mb-6 text-sm text-slate-300">{formDescription}</p>}<div className="relative px-4 py-3 text-slate-600 font-bold bg-slate-400 border rounded border-slate-800" role="alert"><strong className="block font-bold sm:inline"></strong><span className="block ml-1 sm:inline"> {fetchError || "Registrations are currently closed."}</span></div></div></div>); }

    return (
        // Main form structure
        <div className="flex items-center justify-center min-h-screen font-sans bg-fixed bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 md:p-4">
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl w-screen h-screen md:h-auto md:max-h-[90vh] overflow-y-auto md:max-w-2xl md:w-full border border-slate-700">
                {/* Header */}
                <header className="pb-6 mb-8 text-center border-b border-slate-700"> <h1 className="mb-2 text-3xl font-semibold text-white">{formTitle}</h1> {formDescription && (<p className="text-sm text-slate-300">{formDescription}</p>)} {formDefinition.some(f => f.constraints?.required) && (<p className="mt-2 text-xs text-slate-400">Fields marked <span className="font-medium text-yellow-400">*</span> are required.</p>)} </header>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5"> {formDefinition.map((field) => (<div key={field.label || field.label + field.type}>{renderField(field)}</div>))} <div className="pt-4 text-center"> <Button type="submit" text={isSubmitting ? "Submitting..." : "Submit Information"} disabled={isSubmitting || !isFormOpen} /> {/* Submission error display... */} </div> </form>
                {/* Footer */}
                <footer className="pt-6 mt-10 text-center border-t border-slate-700"> <p className="text-xs text-slate-500">ENSIA&#39s Business & Entrepreneurship <br /> Glad to have you here </p> </footer>
            </div>
        </div>
    );
};