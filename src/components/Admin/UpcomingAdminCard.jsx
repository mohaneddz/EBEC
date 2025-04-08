// ./components/Cards/UpcomingAdminCard.jsx (or your path)
"use client"; // Assuming Next.js App Router

import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/Global/Modal'; // Adjust path
import { supabase } from '@/config/supabaseClient'; // Adjust path
import { IconSquareLetterXFilled, IconPlus, IconLoader } from '@tabler/icons-react';

// --- Configuration ---

// Define ALL possible constraints
const ALL_CONSTRAINT_OPTIONS = [
    { key: 'required', label: 'Required' },
    { key: 'minLength', label: 'Min Length' },
    { key: 'maxLength', label: 'Max Length' },
    { key: 'pattern', label: 'Pattern (Regex)' },
    // Add future constraints here (e.g., min/max for numbers/dates)
];

// Define which constraints are applicable to which field types
const CONSTRAINT_APPLICABILITY = {
    text: ['required', 'minLength', 'maxLength', 'pattern'],
    textarea: ['required', 'minLength', 'maxLength'],
    email: ['required', 'pattern'], // Standard email pattern often implied, but allow custom
    tel: ['required', 'pattern'], // E.g., pattern for specific phone format
    url: ['required', 'pattern'], // Allow custom URL pattern
    number: ['required'], // Could add 'min', 'max' here if implemented
    date: ['required'], // Could add 'min', 'max' date constraints here if implemented
    file: ['required'], // Could add 'accept', 'maxSize' later
    checkbox: ['required'], // 'required' means must be checked
    select: ['required'], // 'required' means a selection must be made
    radio: ['required'], // 'required' means a selection must be made
};

// Helper to get applicable constraint keys for a given type
const getApplicableConstraintKeys = (fieldType) => {
    return CONSTRAINT_APPLICABILITY[fieldType] || ['required']; // Default to just 'required'
};

// Default Inactive Constraint Values
const DEFAULT_INACTIVE_CONSTRAINTS = {
    required: false,
    minLength: 0,
    maxLength: Infinity,
    pattern: "",
    // min: "",
    // max: "",
};

// --- Constraint Selector Component (No changes assumed needed based on description) ---
const ConstraintSelector = ({
    fieldId,
    applicableOptions = [],
    activeConstraintKeys = [], // Keys derived from parent state *values*
    onChange, // This function updates the parent state (values), not just keys
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Filter display options based on props
    const activeApplicableOptions = applicableOptions.filter(opt =>
        activeConstraintKeys.includes(opt.key)
    );
    const availableOptionsForDropdown = applicableOptions.filter(
        opt => !activeConstraintKeys.includes(opt.key)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handler when selecting a *new* constraint from the dropdown
    const handleSelect = (option) => {
        // Check applicability again (belt-and-suspenders)
        if (applicableOptions.some(opt => opt.key === option.key) && !activeConstraintKeys.includes(option.key)) {
            // Call the parent's onChange handler, passing the *new set of active keys*
            // The parent handler is responsible for updating the actual constraint *values*
            onChange([...activeConstraintKeys, option.key]);
        }
        setIsOpen(false);
    };

    // Handler when removing an *existing* constraint tag
    const handleRemove = (keyToRemove) => {
        // Call parent's onChange, passing the reduced set of active keys
        onChange(activeConstraintKeys.filter(key => key !== keyToRemove));
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm min-h-[42px] flex flex-wrap items-center gap-1 cursor-text"
                onClick={toggleDropdown} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleDropdown(); }}
                aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={`${fieldId}-constraints-label`}
            >
                {activeApplicableOptions.length === 0 && !isOpen && <span className="w-full px-1 text-sm text-gray-400 truncate text-ellipsis">Select constraints...</span>}
                {activeApplicableOptions.map(option => (
                    <span key={option.key} className="flex items-center bg-primary-100 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full border border-primary-300">
                        {option.label}
                        <button
                            type="button"
                            // Stop propagation to prevent dropdown toggle
                            onClick={(e) => { e.stopPropagation(); handleRemove(option.key); }}
                            className="ml-1.5 text-primary-500 hover:text-primary-700 focus:outline-none"
                            aria-label={`Remove ${option.label} constraint`}
                        >
                            × {/* Use times symbol */}
                        </button>
                    </span>
                ))}
            </div>
            {isOpen && (
                <div className="absolute z-20 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                    <ul role="listbox" aria-label="Available constraints">
                        {availableOptionsForDropdown.length > 0 ? (
                            availableOptionsForDropdown.map(option => (
                                <li
                                    key={option.key}
                                    onClick={() => handleSelect(option)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(option); }}
                                    className="w-full px-3 py-2 text-sm text-gray-700 truncate cursor-pointer text-ellipsis hover:bg-primary-50 hover:text-primary-900 focus:outline-none focus:bg-primary-50" role="option" aria-selected={false} tabIndex={0}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (<li className="w-full px-3 py-2 text-sm italic text-gray-500 truncate text-ellipsis" role="option" aria-disabled="true">
                            {applicableOptions.length > 0 ? 'All applicable constraints selected' : 'No constraints applicable'}
                        </li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};


// --- Main Admin Card Component ---
export default function UpcomingAdminCard({ number }) {

    const [event, setEvent] = useState(null);
    const [visibleInfo, setVisibleInfo] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [form, setForm] = useState([]); // State for form builder structure
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);
    const [isSavingInfo, setIsSavingInfo] = useState(false);
    const [isSavingForm, setIsSavingForm] = useState(false);
    const [infoError, setInfoError] = useState(''); // Error specific to info modal
    const [formError, setFormError] = useState(''); // Error specific to form modal
    const [eventInfoEdits, setEventInfoEdits] = useState({});
    const [selectedImageFile, setSelectedImageFile] = useState(null); // <-- New state for the file object
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // --- Effect to Fetch Event Data ---
    useEffect(() => {

        const fetchForm = async () => {
            if (!number) {
                setIsLoadingEvent(false);
                console.warn("UpcomingAdminCard: 'event' prop is missing.");
                setEvent(null); setEventInfoEdits({}); setForm([]);
                setInfoError("Event ID is missing."); // Set error state
                return;
            }
            setIsLoadingEvent(true);
            setInfoError('');
            setFormError(''); // Clear errors on new fetch
            try {
                const { data: formData, error } = await supabase
                    .from('Upcomings')
                    .select('*')
                    .eq('id', number)
                    .single(); // Use single() for one event

                if (error && error.code !== 'PGRST116') { // Ignore 'PGRST116' (0 rows) error
                    throw error;
                }
                if (formData) {
                    // console.log("Form Data:", formData); // Debug log
                    // Make sure eventInfoEdits gets the 'picture' field if present
                    setEventInfoEdits({ ...formData }); // Should copy 'picture' if it exists
                    setImagePreviewUrl(null); // Reset local preview on load
                    setSelectedImageFile(null); // Reset file selection on load
                    setForm(formData.form || []); // Set form state to the fetched data or empty array

                }
                else {
                    console.log(`No form found with id: ${number}`);
                    setEventInfoEdits({}); // Reset edits if no form found
                    setImagePreviewUrl(null); // Reset local preview on load
                    setSelectedImageFile(null); // Reset file selection on load
                }
            } catch (err) {
                console.error("Error fetching form:", err); // Log the full error
                // setInfoError(`Failed to load form data: ${err.message}`);
                setEventInfoEdits({}); // Reset edits if error occurs
                setImagePreviewUrl(null); // Reset local preview on load
                setSelectedImageFile(null); // Reset file selection on load
            } finally {
                setIsLoadingEvent(false);
            }
        };


        const fetchEvent = async () => {
            if (!number) {
                setIsLoadingEvent(false);
                console.warn("UpcomingAdminCard: 'number' prop is missing.");
                setEvent(null); setEventInfoEdits({}); setForm([]);
                setInfoError("Event ID is missing."); // Set error state
                return;
            }
            setIsLoadingEvent(true);
            setInfoError('');
            setFormError(''); // Clear errors on new fetch
            try {
                const { data: eventData, error } = await supabase
                    .from('Upcomings')
                    .select('*')
                    .eq('id', number)
                    .single(); // Use single() for one event

                if (error && error.code !== 'PGRST116') { // Ignore 'PGRST116' (0 rows) error
                    throw error;
                }

                if (eventData) {
                    setEvent(eventData);
                    // Make sure eventInfoEdits gets the 'picture' field if present
                    setEventInfoEdits({ ...eventData }); // Should copy 'picture' if it exists
                    setImagePreviewUrl(null); // Reset local preview on load
                    setSelectedImageFile(null); // Reset file selection on load
                } else {
                    console.log(`No event found with id: ${number}`);
                    setEvent(null); setEventInfoEdits({}); setForm([]);
                    setInfoError(`Event ID ${number} not found.`); // Set specific error
                }
            } catch (err) {
                console.error("Error fetching event:", err); // Log the full error
                setInfoError(`Failed to load event data: ${err.message}`);
                setEvent(null); setEventInfoEdits({}); setForm([]);
            } finally {
                setIsLoadingEvent(false);
            }
        };
        fetchForm();
        fetchEvent();
    }, [number]); // Dependency array includes only 'number'

    useEffect(() => {
        // If a new file is selected, create a preview URL
        if (selectedImageFile) {
            const objectUrl = URL.createObjectURL(selectedImageFile);
            setImagePreviewUrl(objectUrl);

            // Cleanup function to revoke the object URL when the component unmounts
            // or when the selectedImageFile changes again
            return () => URL.revokeObjectURL(objectUrl);
        }
        // If no file is selected (e.g., cleared), clear the preview
        setImagePreviewUrl(null);
    }, [selectedImageFile]);

    // --- Modal Controls ---
    const openInfoModal = () => { if (event) { setEventInfoEdits({ ...event }); setInfoError(''); setVisibleInfo(true); } };
    const openFormModal = () => { if (event) { setFormError(''); setVisibleForm(true); } };
    const closeModal = () => { setVisibleInfo(false); setVisibleForm(false); };

    // --- Form Builder Field Management ---
    const addField = () => {
        const defaultType = 'text';
        // Get constraints applicable to the default type
        const applicableKeys = getApplicableConstraintKeys(defaultType);
        // Start with all inactive defaults
        const initialConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS };
        // No need to explicitly set based on applicableKeys here, defaults cover it.

        setForm(prevForm => [...prevForm, {
            id: `new_${Date.now()}_${Math.random().toString(16).slice(2)}`, // More unique ID
            label: '',
            type: defaultType,
            constraints: initialConstraints, // Use the inactive defaults
            options: [],
            constraintError: '', // Initialize error field
        }]);
    };
    const removeItem = (index) => () => setForm((prevForm) => prevForm.filter((_, i) => i !== index));

    // --- Field Input Handlers (Label, Type) ---
    const handleFieldInputChange = (index, fieldName) => (e) => {
        const { value } = e.target;
        setForm(prevForm => {
            const newForm = [...prevForm];
            const oldField = newForm[index];
            // Create a shallow copy of the field to modify
            const updatedField = { ...oldField };
            updatedField[fieldName] = value;

            // --- Logic for Type Change ---
            if (fieldName === 'type') {
                const newType = value;
                const applicableKeys = getApplicableConstraintKeys(newType);
                const currentConstraints = oldField.constraints;
                // Start with fresh inactive defaults for the new type
                const newConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS };

                // Iterate applicable keys for the *new* type
                applicableKeys.forEach(key => {
                    // If this key *was* present in the old constraints, try to keep its value
                    if (key in currentConstraints) {
                        // Only keep the old value if it wasn't the inactive default
                        if (currentConstraints[key] !== DEFAULT_INACTIVE_CONSTRAINTS[key]) {
                            newConstraints[key] = currentConstraints[key];
                        }
                        // else: it stays as the inactive default in newConstraints
                    }
                    // else: the key wasn't in old constraints, it stays inactive default
                });

                updatedField.constraints = newConstraints; // Apply the processed constraints

                // Reset options if type is no longer select/radio
                if (!['select', 'radio'].includes(newType)) {
                    updatedField.options = [];
                }
                // Clear constraint error on type change
                updatedField.constraintError = '';
            }
            // --- End Logic for Type Change ---

            newForm[index] = updatedField; // Place the updated field back into the array
            return newForm; // Return the new array
        });
    };

    // --- Option Management Handlers ---
    const addOption = (fieldIndex) => () => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            // Ensure options array exists before spreading
            const currentOptions = newForm[fieldIndex].options || [];
            const newOptions = [...currentOptions, {
                id: `opt_new_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                label: '',
                value: ''
            }];
            // Clone field before updating options
            newForm[fieldIndex] = { ...newForm[fieldIndex], options: newOptions };
            return newForm;
        });
    };

    const removeOption = (fieldIndex, optionIndex) => () => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            const fieldToUpdate = { ...newForm[fieldIndex] }; // Clone field
            // Filter options immutably
            const filteredOptions = (fieldToUpdate.options || []).filter((_, i) => i !== optionIndex);
            fieldToUpdate.options = filteredOptions;
            newForm[fieldIndex] = fieldToUpdate;
            return newForm;
        });
    };

    const handleOptionChange = (fieldIndex, optionIndex, property) => (e) => {
        const { value } = e.target;
        setForm(prevForm => {
            const newForm = [...prevForm];
            const fieldToUpdate = { ...newForm[fieldIndex] }; // Clone field
            const newOptions = [...(fieldToUpdate.options || [])]; // Clone options array
            // Clone the specific option being changed
            newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };
            fieldToUpdate.options = newOptions;
            newForm[fieldIndex] = fieldToUpdate;
            return newForm;
        });
    };

    // --- Constraint Input/Selection Handlers ---
    // Handles direct value changes in constraint inputs (like minLength, maxLength, pattern)
    const handleConstraintValueChange = (index, constraintKey) => (e) => {
        const { value } = e.target;
        let processedValue = value;
        let errorMsg = ''; // Field-specific error

        setForm(prevForm => {
            const newForm = [...prevForm];
            const currentField = { ...newForm[index] }; // Clone field
            const currentConstraints = { ...currentField.constraints }; // Clone constraints

            // Ensure constraint change is only processed if applicable to current type
            const applicableKeys = getApplicableConstraintKeys(currentField.type);
            if (!applicableKeys.includes(constraintKey)) {
                console.warn(`Attempted to change inapplicable constraint '${constraintKey}' for type '${currentField.type}'`);
                return prevForm; // Ignore change
            }

            // --- Process Input Value ---
            if (constraintKey === 'minLength') {
                processedValue = value === '' ? 0 : parseInt(value, 10);
                if (isNaN(processedValue) || processedValue < 0) processedValue = 0;
            } else if (constraintKey === 'maxLength') {
                processedValue = value === '' ? Infinity : parseInt(value, 10);
                // Allow 0 as a max length, treat NaN/negative as Infinity
                if (isNaN(processedValue) || processedValue < 0) processedValue = Infinity;
            } else if (constraintKey === 'pattern') {
                processedValue = value; // Keep as string, allow empty string
                // Basic regex validation (optional, can be complex)
                try {
                    if (value) new RegExp(value); // Test if it compiles
                } catch (regexError) {
                    errorMsg = `Invalid Regex: ${regexError.message}`;
                    // Keep the invalid value in the input for user to fix
                }
            }
            // 'required' is not handled here, it's managed by handleFieldConstraintChange

            // Update the specific constraint value
            currentConstraints[constraintKey] = processedValue;

            // --- Validate & Update Error State ---
            // Check min/max relationship only if *both* are actively set (not default/inactive)
            const minIsActive = currentConstraints.minLength > DEFAULT_INACTIVE_CONSTRAINTS.minLength;
            const maxIsActive = currentConstraints.maxLength !== DEFAULT_INACTIVE_CONSTRAINTS.maxLength;
            if (!errorMsg && minIsActive && maxIsActive && currentConstraints.minLength > currentConstraints.maxLength) {
                // Only set this error if there wasn't already a regex error
                errorMsg = 'Min Length cannot exceed Max Length.';
            }
            // else: keep existing errorMsg (from regex) or clear if valid

            currentField.constraints = currentConstraints;
            currentField.constraintError = errorMsg; // Update error message on the field
            newForm[index] = currentField;

            return newForm;
        });
    };

    // Handles changes from the ConstraintSelector (when tags are added/removed)
    // `newActiveKeys` is the array of keys ('required', 'minLength', etc.) that should now be active
    const handleFieldConstraintChange = (index) => (newActiveKeys) => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            const currentField = { ...newForm[index] }; // Clone field
            const oldConstraints = currentField.constraints;
            const fieldType = currentField.type;
            const applicableKeys = getApplicableConstraintKeys(fieldType);

            // Filter the incoming keys to ensure they are actually applicable to the current field type
            const newActiveApplicableKeys = newActiveKeys.filter(key => applicableKeys.includes(key));

            const newConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS }; // Start with all inactive defaults
            let currentError = '';

            // Build the new state of constraint *values* based on which keys are now active and applicable
            applicableKeys.forEach(key => {
                if (newActiveApplicableKeys.includes(key)) {
                    // --- Constraint is now ACTIVE ---
                    if (key === 'required') {
                        newConstraints.required = true; // Simple boolean toggle
                    } else {
                        // For value-based constraints (minLength, maxLength, pattern):
                        // Check if it had a *non-default* value previously.
                        const oldVal = oldConstraints[key];
                        const inactiveDefaultVal = DEFAULT_INACTIVE_CONSTRAINTS[key];
                        const wasPreviouslyActiveWithValue = oldVal !== inactiveDefaultVal;

                        if (wasPreviouslyActiveWithValue) {
                            // Restore the existing value if it was active before
                            newConstraints[key] = oldVal;
                        } else {
                            // It's being activated for the first time (or from an inactive default state)
                            // Set a sensible *active* default value.
                            if (key === 'minLength') newConstraints.minLength = 1; // Default active minLength to 1
                            else if (key === 'maxLength') newConstraints.maxLength = 255; // Default active maxLength
                            else if (key === 'pattern') newConstraints.pattern = ''; // Default active pattern to empty string
                            // Add defaults for other constraints (min, max) if implemented
                        }
                    }
                }
                // else: Constraint is *inactive* or *not applicable* - it keeps the inactive default value from newConstraints initialization
            });

            // --- Re-validate constraints after changes ---
            const minIsActive = newConstraints.minLength !== DEFAULT_INACTIVE_CONSTRAINTS.minLength;
            const maxIsActive = newConstraints.maxLength !== DEFAULT_INACTIVE_CONSTRAINTS.maxLength;
            if (minIsActive && maxIsActive && newConstraints.minLength > newConstraints.maxLength) {
                currentError = 'Min Length cannot exceed Max Length.';
            }
            // Re-check pattern validity if it's active
            if (newConstraints.pattern) {
                try { new RegExp(newConstraints.pattern); }
                catch (e) { currentError = `Invalid Regex: ${e.message}`; }
            }


            currentField.constraints = newConstraints; // Assign the newly built constraints object
            currentField.constraintError = currentError; // Update error state
            newForm[index] = currentField; // Put updated field back
            return newForm;
        });
    };

    // Helper to get active keys *from the current state values* for ConstraintSelector display
    const getActiveConstraintKeysFromState = (constraints) => {
        if (!constraints) return [];
        const keys = [];
        // Check if the current value is different from the inactive default
        if (constraints.required === true) keys.push('required');
        if (constraints.minLength !== DEFAULT_INACTIVE_CONSTRAINTS.minLength) keys.push('minLength');
        if (constraints.maxLength !== DEFAULT_INACTIVE_CONSTRAINTS.maxLength) keys.push('maxLength');
        if (constraints.pattern !== DEFAULT_INACTIVE_CONSTRAINTS.pattern) keys.push('pattern');
        // Add checks for other constraints if implemented
        return keys;
    };

    // --- Save Handlers ---
    const saveFormDefinition = async () => {
        if (!event || !event.id) { setFormError("Cannot save form: Event ID missing."); return; }

        // --- Pre-Save Validation ---
        let firstErrorField = null;
        for (let i = 0; i < form.length; i++) {
            const f = form[i];
            if (!f.label?.trim()) { // Check for empty/whitespace label
                firstErrorField = `Field ${i + 1} requires a non-empty label.`; break;
            }
            if (f.constraintError) { // Check for existing validation errors on constraints
                firstErrorField = `Fix error in field "${f.label}" (${f.type}): ${f.constraintError}`; break;
            }
            // Validation for fields requiring options
            if (['select', 'radio'].includes(f.type)) {
                if (!f.options || f.options.length === 0) {
                    firstErrorField = `Field "${f.label}" (${f.type}) must have at least one option.`; break;
                }
                // Check if any option has empty label or value
                if (f.options.some(opt => !opt.label?.trim() || !opt.value?.trim())) {
                    firstErrorField = `All options in field "${f.label}" (${f.type}) must have a non-empty Label and Value.`; break;
                }
                // Check for duplicate option *values* within the same field
                const values = f.options.map(opt => opt.value);
                if (new Set(values).size !== values.length) {
                    firstErrorField = `Duplicate option values found in field "${f.label}" (${f.type}). Values must be unique.`; break;
                }
            }
        }
        if (firstErrorField) {
            setFormError(firstErrorField); // Display the first validation error found
            return; // Stop saving process
        }
        // --- End Validation ---


        setIsSavingForm(true);
        setFormError('');

        // Prepare payload: remove temporary IDs, errors, and ensure pattern consistency
        const formToSave = form.map(({ id, constraintError, options, constraints, ...rest }) => {
            // Process constraints before saving
            const finalConstraints = { ...constraints };

            // Convert pattern: null or undefined to '' before saving
            if (finalConstraints.pattern === null || finalConstraints.pattern === undefined) {
                finalConstraints.pattern = '';
            }
            // Ensure numbers are saved as numbers (or handle Infinity if needed)
            // Note: JSON cannot serialize Infinity directly. Consider saving as null or a large number marker if Infinity is needed.
            // For simplicity here, we assume standard number constraints are saved.
            if (finalConstraints.maxLength === Infinity) {
                // Option 1: Save null (requires handling on load)
                // finalConstraints.maxLength = null;
                // Option 2: Save a very large number (might be lossy)
                // finalConstraints.maxLength = 999999999;
                // Option 3: Just don't include the key if it's Infinity (cleanest if backend/load handles missing key as Infinity)
                delete finalConstraints.maxLength; // Example: remove if Infinity
            }


            // Remove temporary frontend IDs from options
            const finalOptions = options?.map(({ id: optId, ...optRest }) => optRest) ?? [];

            return {
                ...rest, // Includes label, type
                constraints: finalConstraints, // Use the processed constraints
                options: finalOptions // Use cleaned options
            };
        });

        console.log("Saving Form Payload:", JSON.stringify(formToSave, null, 2));

        try {
            const { data: updatedData, error } = await supabase
                .from('Upcomings')
                .update({ form: formToSave })
                .eq('id', event.id)
                .select() // Select the updated row
                .single(); // Expect a single row back

            if (error) throw error;

            // Update local event state with the *actual* data saved (including any backend processing)
            console.log("uploaded Data :", updatedData); // Debug log
            // setEvent(updatedData);
            // Refresh form state based on the newly saved data to ensure consistency
            // This re-runs the loading logic essentially
            if (updatedData.form && Array.isArray(updatedData.form)) {
                // (Re-run the same processing logic as in useEffect)
                const refreshedForm = updatedData.form.map((field, index) => {
                    const fieldType = field.type || 'text';
                    const applicableKeys = getApplicableConstraintKeys(fieldType);
                    const loadedConstraints = field.constraints || {};
                    const initialConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS };
                    applicableKeys.forEach(key => { /* ... same loading logic as useEffect ... */
                        if (key in loadedConstraints) {
                            if (key === 'pattern' && typeof loadedConstraints[key] !== 'string') initialConstraints.pattern = null;
                            else if (key === 'minLength' || key === 'maxLength') {
                                const numVal = parseInt(loadedConstraints[key], 10); if (!isNaN(numVal)) initialConstraints[key] = numVal;
                                if (key === 'maxLength' && (loadedConstraints[key] === null || loadedConstraints[key] > 999999 || loadedConstraints[key] === undefined)) { initialConstraints[key] = Infinity; } // Handle loading null/undefined as Infinity
                            }
                            else initialConstraints[key] = loadedConstraints[key];
                        }
                    });
                    if (typeof initialConstraints.pattern !== 'string') initialConstraints.pattern = null;
                    if (initialConstraints.maxLength === null) initialConstraints.maxLength = Infinity; // Handle potential null from save

                    return {
                        id: `loaded_${index}_${Date.now()}`, label: field.label || '', type: fieldType,
                        constraints: initialConstraints,
                        options: Array.isArray(field.options) ? field.options.map((opt, optIndex) => ({
                            id: `opt_loaded_${index}_${optIndex}_${Date.now()}`,
                            label: String(opt.label || ''), value: String(opt.value || '')
                        })) : [],
                        constraintError: '',
                    };
                });
                console.log("Refreshed Form Definition:", refreshedForm); // Debug log
                setForm(refreshedForm);
            } else {
                setForm([]);
                console.log("Form definition is empty or not an array after save.");
            }

            setVisibleForm(false); // Close modal on success
        } catch (err) {
            console.error("Error saving form definition:", err);
            setFormError(`Save failed: ${err.message}`);
        } finally {
            setIsSavingForm(false);
            console.log("Form : ", form);
            console.log(typeof form);
            console.log("form isArray?", Array.isArray(form));
        }
    };

    // --- Event Info Save Handler ---
    const handleInfoInputChange = (e) => {
        const { id, value, type, checked, files } = e.target;

        // --- Handle File Input ---
        if (type === 'file' && id === 'event-image') {
            if (files && files.length > 0) {
                setSelectedImageFile(files[0]);
                // Clear the existing Base64 'picture' from edits state
                // This prevents saving the old Base64 if conversion/upload fails later
                setEventInfoEdits(prev => {
                    const newState = { ...prev };
                    delete newState.picture; // Remove existing base64
                    return newState;
                });
            } else {
                setSelectedImageFile(null);
            }
            return; // Stop processing here for file inputs
        }

        // --- End Handle File Input ---

        // --- Handle Other Inputs (existing logic) ---
        // Derive key from id (e.g., "event-name" -> "name") - ensure your ID format matches this logic
        const key = id.startsWith('event-') ? id.split('-')[1] : id; // Basic key derivation
        if (key) {
            setEventInfoEdits(prev => ({ ...prev, [key]: type === 'checkbox' ? checked : value }));
        } else {
            console.warn("Could not derive key from input ID:", id);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null); // Resolve with null if no file provided
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file); // Reads the file content as a data URL (Base64)
            reader.onload = () => resolve(reader.result); // Resolve promise with the result
            reader.onerror = (error) => reject(error); // Reject promise on error
        });
    };

    // --- Modified Save Event Info Function ---
    const saveEventInfo = async (e) => {
        e.preventDefault();
        if (!event || !event.id) {
            setInfoError("Cannot save: Event ID missing.");
            return;
        }
        setIsSavingInfo(true);
        setInfoError('');

        let base64ImageStringToSave = null; // Initialize variable to hold the result

        // --- Convert Selected File to Base64 if it exists ---
        if (selectedImageFile) {
            console.log("New image file selected, converting to Base64..."); // Debug log
            try {
                base64ImageStringToSave = await convertFileToBase64(selectedImageFile); // Await conversion
                if (!base64ImageStringToSave) {
                    // Should not happen if selectedImageFile exists, but good check
                    throw new Error("File conversion resulted in null.");
                }
                console.log("Base64 conversion successful (string length):", base64ImageStringToSave.length); // Log length for sanity check
            } catch (error) {
                console.error("Base64 Conversion Failed:", error);
                setInfoError(`Image processing failed: ${error.message}`);
                setIsSavingInfo(false); // Stop saving process
                return;
            }
        }
        // --- End Conversion Logic ---

        // Prepare the final updates object for the database row
        // Exclude fields managed elsewhere or automatically
        const { id, created_at, form_definition, picture: existingPicture, ...baseUpdates } = eventInfoEdits; // Also exclude 'picture' from baseUpdates initially

        // Construct the final payload
        const finalUpdates = { ...baseUpdates };

        // Only add the 'picture' field to the update payload IF a new file was selected and converted
        if (base64ImageStringToSave !== null) {
            finalUpdates.picture = base64ImageStringToSave;
            console.log("Adding new Base64 picture to payload.");
        }
        // NOTE: If you want to allow *removing* the picture, you'd need extra logic.
        // For now, this only *adds/replaces* the picture if a new file is selected.
        // If no new file is selected, the 'picture' field is NOT sent in the update,
        // preserving the existing value in the database.

        // Basic validation (you might add more)
        if (!finalUpdates.name?.trim()) {
            setInfoError("Event Name cannot be empty.");
            setIsSavingInfo(false);
            return;
        }

        console.log("Attempting DB Update with Payload:", {
            ...finalUpdates,
            // Log a truncated version of picture if it exists, otherwise 'No Change' or 'Removed'
            picture: finalUpdates.picture ? `Base64 String (length: ${finalUpdates.picture.length})` : '(No Change)'
        });

        try {
            const { data: updatedEvent, error } = await supabase
                .from('Upcomings')
                .update(finalUpdates) // Send the updates object containing base64 string if applicable
                .eq('id', event.id)
                .select() // Select the updated row data
                .single();

            if (error) {
                // Provide more context if possible (e.g., size limit exceeded?)
                console.error("Supabase Update Error Raw:", error);
                let userFriendlyError = `Save failed: ${error.message}`;
                if (error.message.includes("payload size")) { // Check for common size error
                    userFriendlyError = "Save failed: The image might be too large to store directly. Please choose a smaller file.";
                } else if (error.code) { // Include error code if available
                    userFriendlyError += ` (Code: ${error.code})`;
                }
                throw new Error(userFriendlyError);
            }

            console.log("DB Update Successful:", updatedEvent); // Debug log
            setEvent(updatedEvent); // Update main event state with the data returned from DB
            setEventInfoEdits(prev => ({ ...prev, ...updatedEvent })); // Also update the edit state to match saved data
            setSelectedImageFile(null); // Clear the selected file state after successful save
            // imagePreviewUrl will clear automatically via useEffect based on selectedImageFile
            setVisibleInfo(false);
        } catch (err) {
            console.error("Error saving event info (DB update):", err);
            // Display the potentially more user-friendly error message from the catch block above
            setInfoError(err.message || "An unknown error occurred during save.");
        } finally {
            setIsSavingInfo(false);
        }
    };

    // --- Render Logic ---
    if (isLoadingEvent || !event) {
        return <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center min-h-[150px]"><IconLoader size={30} className="w-full text-gray-400 truncate animate-spin text-ellipsis" /></div>;
    }


    // --- Main Card Render (Event exists) ---
    return (
        <>
            {/* --- Info Modal --- */}
            <Modal isOpen={visibleInfo} onClose={closeModal} title={`Edit Info: ${event?.name || ''}`}>
                <form onSubmit={saveEventInfo} className="flex flex-col gap-0 mt-0 max-h-[85vh]"> {/* Remove gap, let content handle it */}
                    {/* Scrollable Content Area */}
                    <div className='flex-grow px-4 pt-4 pb-2 space-y-4 overflow-y-auto'> {/* Added space-y */}
                        {infoError && <p className="w-full p-2 mb-2 text-sm text-center text-red-600 border border-red-200 rounded bg-red-50">{infoError}</p>}

                        {/* Form Fields */}
                        <div className='w-full'>
                            <label htmlFor="event-name" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Name <span className="text-red-500">*</span></label>
                            <input id="event-name" type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Event Name" value={eventInfoEdits.name || ''} onChange={handleInfoInputChange} required />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="event-brief" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Brief</label>
                            <textarea id="event-brief" className="border border-gray-300 rounded p-2 w-full min-h-[80px]" placeholder="Brief Description" value={eventInfoEdits.brief || ''} onChange={handleInfoInputChange} />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="event-date" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Date</label>
                            <input id="event-date" type="date" className="w-full p-2 border border-gray-300 rounded" value={eventInfoEdits.date || ''} onChange={handleInfoInputChange} />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="event-location" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Location</label>
                            <input id="event-location" type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Location" value={eventInfoEdits.location || ''} onChange={handleInfoInputChange} />
                        </div>
                            <div className='w-full'>
                                <label htmlFor="event-link" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Google Sheet URL <span className="text-red-500">*</span></label>
                                <input id="event-link" type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Event Link" value={eventInfoEdits.link || ''} onChange={handleInfoInputChange} required />
                            </div>

                        <div className='w-full'>
                            <div className='w-full'>
                                <label htmlFor="event-image" className="block w-full mb-1 text-sm font-medium text-left text-gray-700 truncate text-ellipsis">Image</label>
                                <input
                                    id="event-image"
                                    name="event_image_file"
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-2 border border-gray-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-dark file:text-white hover:file:bg-primary-light hover:file:text-gray-200"
                                    onChange={handleInfoInputChange}
                                />

                                {/* Image Preview Logic: Show local preview OR existing Base64 from edits */}
                                {(imagePreviewUrl || eventInfoEdits.picture) && ( // Check if local preview or existing Base64 exists
                                    <div className='mt-3'>
                                        <p className="w-full mb-1 text-xs text-gray-500 truncate text-ellipsis">Preview:</p>
                                        <img
                                            // Prioritize local file preview, fallback to Base64 data URL from state
                                            src={imagePreviewUrl || eventInfoEdits.picture} // Both createObjectURL and data URLs work in src
                                            alt="Preview"
                                            height={96}
                                            width={96}

                                            className="object-contain w-auto h-24 border border-gray-200 rounded"
                                            // Add basic error handling for potentially invalid base64/url
                                            onError={(e) => { e.target.style.display = 'none'; console.error("Failed to load image preview."); }}
                                        />
                                    </div>
                                )}
                                {/* Option to clear selection */}
                                {selectedImageFile && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImageFile(null)}
                                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                                    >
                                        Clear selection
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Add other editable fields here */}

                    </div> {/* End Scrollable Area */}

                    {/* Sticky Footer for Buttons */}
                    <div className="z-10 flex-shrink-0 w-full px-4 py-3 border-t bg-gray-50">
                        <div className="flex flex-col gap-2">
                            <button type="submit" disabled={isSavingInfo} className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white rounded bg-gradient-to-br from-secondary-light to-secondary-dark hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">{isSavingInfo ? <><IconLoader size={18} className="animate-spin" /> Saving...</> : 'Save Info'}</button>
                            <button type="button" onClick={closeModal} disabled={isSavingInfo} className="w-full px-4 py-2 text-gray-700 truncate bg-gray-200 rounded text-ellipsis hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* --- Form Builder Modal --- */}
            <Modal isOpen={visibleForm} onClose={closeModal} title={`Edit Form: ${event?.name || ''}`}>
                {/* Use flex column for layout */}
                <div className="flex flex-col gap-0 mt-2 max-h-[85vh]"> {/* Increased min-width */}
                    {/* Header: Add Field Button */}
                    <div className="flex-shrink-0 w-full px-4 pt-2">
                        <button onClick={addField} className="flex items-center justify-center w-full gap-2 px-4 py-2 mb-1 text-white rounded bg-gradient-to-br from-primary-light to-primary-dark hover:opacity-90"><IconPlus size={18} /> Add New Field</button>
                    </div>

                    {/* Scrollable Form Fields Area */}
                    <div key={`form-fields-${number}`} className="flex-grow w-full px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">

                        {form && form.length === 0 && <p className="w-full my-6 italic text-center text-gray-500 truncate text-ellipsis">Click "Add New Field" to start building.</p>}

                        {form && form.map((field, index) => {
                            const applicableConstraintKeys = getApplicableConstraintKeys(field.type);
                            const applicableOptions = ALL_CONSTRAINT_OPTIONS.filter(opt => applicableConstraintKeys.includes(opt.key));
                            // Determine currently active keys from state *values* for THIS field
                            const currentActiveKeys = getActiveConstraintKeysFromState(field.constraints);
                            const fieldId = field.id; // Use the temporary frontend ID

                            // Check if specific constraint inputs should be visible
                            const showMinLength = currentActiveKeys.includes('minLength');
                            const showMaxLength = currentActiveKeys.includes('maxLength');
                            const showPattern = currentActiveKeys.includes('pattern');

                            return (
                                <div key={`${number}-${fieldId}`} className="relative flex flex-col w-full gap-3 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                                    {/* Header: Label + Remove */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b">
                                        <label className="w-full font-semibold text-gray-700 truncate text-ellipsis">Field {index + 1} Config</label>
                                        <button onClick={removeItem(index)} aria-label={`Remove Field ${index + 1}`} className="text-red-500 hover:text-red-700"><IconSquareLetterXFilled size={24} /></button>
                                    </div>
                                    {/* Field Label */}
                                    <div>
                                        <label htmlFor={`${fieldId}-label-input`} className="block w-full mb-1 text-xs font-medium text-gray-600 truncate text-ellipsis">Field Label <span className='text-red-500'>*</span></label>
                                        <input id={`${fieldId}-label-input`} type="text" className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="e.g., Full Name" value={field.label} onChange={handleFieldInputChange(index, 'label')} required />
                                    </div>
                                    {/* Field Type */}
                                    <div>
                                        <label htmlFor={`${fieldId}-type-select`} className="block w-full mb-1 text-xs font-medium text-gray-600 truncate text-ellipsis">Field Type</label>
                                        <select id={`${fieldId}-type-select`} className="w-full p-2 text-sm bg-white border border-gray-300 rounded" value={field.type} onChange={handleFieldInputChange(index, 'type')}>
                                            <option value="text">Text</option>
                                            <option value="textarea">Text Area</option>
                                            <option value="email">Email</option>
                                            <option value="tel">Phone</option>
                                            <option value="url">URL</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="checkbox">Checkbox</option>
                                            <option value="select">Dropdown</option>
                                            <option value="radio">Radio Buttons</option>
                                            {/* <option value="file">File Upload</option> */}
                                            {/* DISABLED FILE UPLOADS AS DEMANDED */}
                                        </select>
                                    </div>

                                    {/* --- Options Section (Conditional) --- */}
                                    {(field.type === 'select' || field.type === 'radio') && (
                                        <div className="pt-3 mt-2 border-t">
                                            <h4 className="w-full mb-2 text-xs font-medium text-gray-600 truncate text-ellipsis">Options for {field.type === 'select' ? 'Dropdown' : 'Radio Buttons'} <span className='text-red-500'>*</span></h4>
                                            <div className="pr-1 space-y-2 overflow-y-auto max-h-40 scrollbar-thin">
                                                {(field.options || []).map((option, optIndex) => (
                                                    <div key={option.id || optIndex} className="flex items-center gap-2">
                                                        <input type="text" placeholder="Visible Label *" value={option.label} onChange={handleOptionChange(index, optIndex, 'label')} className="flex-grow border border-gray-300 rounded p-1.5 text-sm" required />
                                                        <input type="text" placeholder="Internal Value *" value={option.value} onChange={handleOptionChange(index, optIndex, 'value')} className="flex-grow border border-gray-300 rounded p-1.5 text-sm" required />
                                                        <button onClick={removeOption(index, optIndex)} aria-label="Remove Option" className="flex-shrink-0 text-red-400 hover:text-red-600"><IconSquareLetterXFilled size={18} /></button>
                                                    </div>
                                                ))}
                                                {(!field.options || field.options.length === 0) && <p className='w-full text-xs italic text-gray-400 truncate text-ellipsis'>No options added yet. Add at least one.</p>}
                                            </div>
                                            <button onClick={addOption(index)} className="flex items-center gap-1 mt-2 text-sm text-primary-600 hover:text-primary-800"><IconPlus size={16} /> Add Option</button>
                                        </div>
                                    )}

                                    {/* --- Constraints Section --- */}
                                    {applicableOptions.length > 0 && (
                                        <div className="pt-3 mt-2 border-t">
                                            <label id={`${fieldId}-constraints-label`} className="block w-full mb-1 text-xs font-medium text-gray-600 truncate text-ellipsis">Validation Constraints</label>
                                            {field.constraintError && <p className="text-red-600 text-xs mb-2 p-1.5 bg-red-50 border border-red-200 rounded">{field.constraintError}</p>}
                                            <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                {/* Constraint Selector takes full width */}
                                                <div className="sm:col-span-2">
                                                    <ConstraintSelector
                                                        fieldId={fieldId}
                                                        applicableOptions={applicableOptions}
                                                        activeConstraintKeys={currentActiveKeys} // Pass keys derived from state
                                                        onChange={handleFieldConstraintChange(index)}
                                                    />
                                                </div>

                                                {/* Constraint Value Inputs (Conditionally Rendered) */}
                                                {showMinLength && (<div className="mt-1"><label htmlFor={`${fieldId}-minLength`} className="block text-xs font-medium text-gray-500 truncate text-ellipsis w-full mb-0.5">Min Length</label><input type="number" id={`${fieldId}-minLength`} value={field.constraints.minLength <= 0 ? '' : field.constraints.minLength} onChange={handleConstraintValueChange(index, 'minLength')} min="1" placeholder="e.g., 5" className="w-full p-2 text-sm border border-gray-300 rounded-md" /></div>)}
                                                {showMaxLength && (<div className="mt-1"><label htmlFor={`${fieldId}-maxLength`} className="block text-xs font-medium text-gray-500 truncate text-ellipsis w-full mb-0.5">Max Length</label><input type="number" id={`${fieldId}-maxLength`} value={field.constraints.maxLength === Infinity ? '' : field.constraints.maxLength} onChange={handleConstraintValueChange(index, 'maxLength')} min="0" placeholder="e.g., 100" className="w-full p-2 text-sm border border-gray-300 rounded-md" /></div>)}
                                                {/* Pattern input (Handles null/empty string state correctly) */}
                                                {showPattern && (<div className="mt-1 sm:col-span-2"><label htmlFor={`${fieldId}-pattern`} className="block text-xs font-medium text-gray-500 truncate text-ellipsis w-full mb-0.5">Pattern (Regex)</label><input type="text" id={`${fieldId}-pattern`} value={field.constraints.pattern ?? ''} onChange={handleConstraintValueChange(index, 'pattern')} placeholder="e.g., ^\\d{5}$ (5 digits)" className="w-full p-2 font-mono text-sm border border-gray-300 rounded-md" /><p className="text-xs text-gray-500 truncate text-ellipsis w-full mt-0.5">JS regex pattern (no slashes `/`). Leave blank if not needed.</p></div>)}
                                            </div>
                                        </div>
                                    )}
                                </div> // End field container
                            );
                        })} {/* End form.map */}
                    </div> {/* End Scrollable Area */}

                    {/* Footer Buttons Area */}
                    <div className="z-10 flex-shrink-0 w-full px-4 py-3 border-t bg-gray-50">
                        {formError && <p className="p-2 mb-2 text-sm text-center text-red-600 border border-red-200 rounded bg-red-50">{formError}</p>}
                        <div className="flex flex-col gap-2">
                            <button onClick={saveFormDefinition} disabled={isSavingForm} className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white rounded bg-gradient-to-br from-secondary-light to-secondary-dark hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">{isSavingForm ? <><IconLoader size={18} className="animate-spin" /> Saving...</> : 'Save Form'}</button>
                            <button type="button" onClick={closeModal} disabled={isSavingForm} className="w-full px-4 py-2 text-gray-700 truncate bg-gray-200 rounded text-ellipsis hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>


            {/* --- The Actual Card Display --- */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow min-h-[250px] h-full w-full">
                <div> {/* Content Wrapper */}
                    <h2 className="pb-2 mb-3 text-lg font-bold truncate border-b text-ellipsis">{event.name}</h2>
                    <p className="mb-1 text-sm text-gray-600 truncate text-ellipsis max-w-80 line-clamp-3">{event.brief || <span className="italic text-gray-400">No brief description.</span>}</p>
                    {event.date && <p className="mb-1 text-xs text-gray-500">Date: {new Date(event.date + 'T00:00:00').toLocaleDateString() || 'N/A'}</p>} {/* Add time to avoid TZ issues */}
                    {event.location && <p className="w-full mb-4 text-xs text-gray-500 truncate text-ellipsis">Location: {event.location}</p>}
                    {event.image_url && (
                        <div className="mb-3">
                            {event.image_url ? (
                                <img
                                    src={event.image_url}
                                    alt={event.name || 'Event image'}
                                    className="object-cover w-full h-24 border border-gray-200 rounded"
                                    loading="lazy"
                                    // Add width and height corresponding to your CSS (h-24 is typically 96px)
                                    width="150" // Example: Provide an estimated width if possible, otherwise focus on height
                                    height="96"  // Crucial: Matches h-24 (assuming 1rem=16px)
                                    // Add async decoding hint
                                    decoding="async"
                                    onError={(e) => { e.target.style.display = 'none'; /* Hide broken img */ }}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-24 bg-gray-100 border border-gray-200 rounded">
                                    <span className="text-sm text-gray-400">No image available</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Buttons pushed to bottom */}
                <div className="grid items-center justify-center w-full grid-rows-2 gap-2 pt-3 mt-auto border-t border-gray-200">
                    <button onClick={openInfoModal} className="w-full px-16 py-2 text-sm font-bold text-white truncate rounded bg-gradient-to-br from-secondary-light to-secondary-dark w- hover:opacity-90">Edit Info</button>
                    <button onClick={openFormModal} className="w-full px-16 py-2 text-sm font-bold text-white truncate rounded bg-gradient-to-br from-primary-light to-primary-dark w- hover:opacity-90">Edit Form</button>
                </div>
            </div>
        </>
    );
}