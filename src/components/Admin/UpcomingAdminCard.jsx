import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/Global/Modal'; // Assuming Modal is your component
import { supabase } from '@/config/supabaseClient'; // Adjust path if needed
import { IconSquareLetterXFilled, IconPlus, IconLoader } from '@tabler/icons-react';

// --- Configuration ---

// Define ALL possible constraints
const ALL_CONSTRAINT_OPTIONS = [
    { key: 'required', label: 'Required' },
    { key: 'minLength', label: 'Min Length' },
    { key: 'maxLength', label: 'Max Length' },
    { key: 'pattern', label: 'Pattern (Regex)' },
    // Add future constraints here (e.g., min/max for numbers/dates)
    // { key: 'min', label: 'Min Value' },
    // { key: 'max', label: 'Max Value' },
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
    return CONSTRAINT_APPLICABILITY[fieldType] || ['required']; // Default to just 'required' if type unknown
};

// --- Constraint Selector Component (No changes needed here) ---
const ConstraintSelector = ({
    fieldId,
    applicableOptions = [],
    activeConstraintKeys = [],
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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

    const handleSelect = (option) => {
        if (applicableOptions.some(opt => opt.key === option.key) && !activeConstraintKeys.includes(option.key)) {
            onChange([...activeConstraintKeys, option.key]);
        }
        setIsOpen(false);
    };

    const handleRemove = (keyToRemove) => {
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
                {activeApplicableOptions.length === 0 && !isOpen && <span className="text-gray-400 text-sm px-1">Select constraints...</span>}
                {activeApplicableOptions.map(option => (
                    <span key={option.key} className="flex items-center bg-indigo-100 text-indigo-700 text-sm font-medium px-2.5 py-0.5 rounded-full border border-indigo-300">
                        {option.label}
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(option.key); }} className="ml-1.5 text-indigo-500 hover:text-indigo-700 focus:outline-none" aria-label={`Remove ${option.label} constraint`}>×</button>
                    </span>
                ))}
            </div>
            {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <ul role="listbox" aria-label="Available constraints">
                        {availableOptionsForDropdown.length > 0 ? (
                            availableOptionsForDropdown.map(option => (
                                <li key={option.key} onClick={() => handleSelect(option)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(option); }} className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer focus:outline-none focus:bg-indigo-50" role="option" aria-selected={false} tabIndex={0}>{option.label}</li>
                            ))
                        ) : (<li className="px-3 py-2 text-sm text-gray-500 italic" role="option" aria-disabled="true">
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
    const [eventInfoEdits, setEventInfoEdits] = useState({});
    const [visibleInfo, setVisibleInfo] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [form, setForm] = useState([]);
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);
    const [isSavingInfo, setIsSavingInfo] = useState(false);
    const [isSavingForm, setIsSavingForm] = useState(false);
    const [infoError, setInfoError] = useState('');
    const [formError, setFormError] = useState('');

    // --- Default Inactive Constraint Values ---
    const DEFAULT_INACTIVE_CONSTRAINTS = {
        required: false,
        minLength: 0,
        maxLength: Infinity,
        pattern: null, // Use null for inactive pattern
        // min: null,
        // max: null,
    };

    // --- Effect to Fetch Event Data ---
    useEffect(() => {
        const fetchEvent = async () => {
            if (!number) {
                setIsLoadingEvent(false);
                console.warn("UpcomingAdminCard: 'number' prop is missing.");
                setEvent(null); setEventInfoEdits({}); setForm([]); return;
            }
            setIsLoadingEvent(true); setInfoError(''); setFormError('');
            try {
                const { data: eventData, error } = await supabase.from('Upcomings').select('*').eq('id', number).single(); // Use single() for one event
                if (error && error.code !== 'PGRST116') { // Ignore 'PGRST116' (0 rows) error, handle below
                    throw error;
                }
                if (eventData) {
                    console.log("Fetched Event Data:", eventData);
                    setEvent(eventData); setEventInfoEdits({ ...eventData }); // Clone edits

                    let loadedForm = [];
                    if (eventData.form_definition && Array.isArray(eventData.form_definition)) {
                        loadedForm = eventData.form_definition.map((field, index) => {
                            const fieldType = field.type || 'text';
                            const applicableKeys = getApplicableConstraintKeys(fieldType);
                            const loadedConstraints = field.constraints || {};

                            // Build initial constraints, respecting applicability and using defaults
                            const initialConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS };
                            applicableKeys.forEach(key => {
                                if (key in loadedConstraints) {
                                    // Use loaded value if applicable
                                    if (key === 'pattern' && typeof loadedConstraints[key] !== 'string') {
                                        // Handle potential non-string loaded patterns (e.g., if null was stored before)
                                        initialConstraints[key] = null;
                                    } else {
                                        initialConstraints[key] = loadedConstraints[key];
                                    }
                                }
                                // else: it keeps the DEFAULT_INACTIVE_CONSTRAINTS value
                            });
                            // Ensure pattern is null if it wasn't explicitly loaded as a string
                            if (typeof initialConstraints.pattern !== 'string') initialConstraints.pattern = null;


                            return {
                                id: `loaded_${index}_${Date.now()}`,
                                label: field.label || '',
                                type: fieldType,
                                constraints: initialConstraints,
                                options: Array.isArray(field.options) ? field.options.map((opt, optIndex) => ({
                                    id: `opt_${index}_${optIndex}_${Date.now()}`,
                                    label: typeof opt === 'string' ? opt : opt.label || '',
                                    value: typeof opt === 'string' ? opt : opt.value || ''
                                })) : [],
                                constraintError: '', // Initialize error field
                            };
                        });
                    }
                    setForm(loadedForm);
                } else {
                    console.log(`No event found with id: ${number}`);
                    setEvent(null); setEventInfoEdits({}); setForm([]);
                    setInfoError(`Event ID ${number} not found.`); // Set error if not found
                }
            } catch (err) {
                console.error("Error fetching event:", err.message);
                setInfoError(`Failed to load event data: ${err.message}`);
                setEvent(null); setEventInfoEdits({}); setForm([]);
            } finally {
                setIsLoadingEvent(false);
            }
        };
        fetchEvent();
    }, [number]);

    // --- Modal Controls ---
    const openInfoModal = () => { if (event) { setEventInfoEdits({ ...event }); setInfoError(''); setVisibleInfo(true); }};
    const openFormModal = () => { if (event) { setFormError(''); setVisibleForm(true); } };
    const closeModal = () => { setVisibleInfo(false); setVisibleForm(false); };

    // --- Form Builder Field Management ---
    const addField = () => {
        const defaultType = 'text';
        const applicableKeys = getApplicableConstraintKeys(defaultType);
        const initialConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS };
        // Only set applicable constraints initially (though defaults cover this)
        applicableKeys.forEach(key => {
             // No specific initialization needed here if defaults are correct
        });

        setForm(prevForm => [...prevForm, {
            id: `new_${Date.now()}_${Math.random()}`,
            label: '',
            type: defaultType,
            constraints: initialConstraints,
            options: [],
            constraintError: '',
        }]);
    };
    const removeItem = (index) => () => setForm((prevForm) => prevForm.filter((_, i) => i !== index));

    // --- Field Input Handlers (Label, Type) ---
    const handleFieldInputChange = (index, fieldName) => (e) => {
        const { value } = e.target;
        setForm(prevForm => {
            const newForm = [...prevForm];
            const oldField = newForm[index];
            const updatedField = { ...oldField, [fieldName]: value };

            // --- Logic for Type Change ---
            if (fieldName === 'type') {
                const newType = value;
                const applicableKeys = getApplicableConstraintKeys(newType);
                const currentConstraints = oldField.constraints;
                const newConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS }; // Start with all inactive defaults

                // Keep constraint values ONLY if they are applicable to the NEW type
                applicableKeys.forEach(key => {
                    if (key in currentConstraints) {
                        // If applicable and existed before, keep its value
                        newConstraints[key] = currentConstraints[key];
                    }
                    // else: it keeps the inactive default from newConstraints initialization
                });

                updatedField.constraints = newConstraints;

                // Reset options if type is no longer select/radio
                if (!['select', 'radio'].includes(newType)) {
                    updatedField.options = [];
                }
                // Clear constraint error on type change
                updatedField.constraintError = '';
            }
            // --- End Logic for Type Change ---

            newForm[index] = updatedField;
            return newForm;
        });
    };

    // --- Option Management Handlers ---
    const addOption = (fieldIndex) => () => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            const newOptions = [...(newForm[fieldIndex].options || []), { id: `opt_new_${Date.now()}`, label: '', value: '' }];
            newForm[fieldIndex] = { ...newForm[fieldIndex], options: newOptions };
            return newForm;
        });
    };
    const removeOption = (fieldIndex, optionIndex) => () => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            const filteredOptions = newForm[fieldIndex].options.filter((_, i) => i !== optionIndex);
            newForm[fieldIndex] = { ...newForm[fieldIndex], options: filteredOptions };
            return newForm;
        });
    };
    const handleOptionChange = (fieldIndex, optionIndex, property) => (e) => {
        const { value } = e.target;
        setForm(prevForm => {
            const newForm = [...prevForm];
            const newOptions = [...newForm[fieldIndex].options];
            newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };
            newForm[fieldIndex] = { ...newForm[fieldIndex], options: newOptions };
            return newForm;
        });
    };

    // --- Constraint Input/Selection Handlers ---
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
                return prevForm; // Ignore change if constraint isn't applicable
            }

            // Process Input Value
            if (constraintKey === 'minLength') {
                processedValue = value === '' ? 0 : parseInt(value, 10); // Default to 0 if empty
                if (isNaN(processedValue) || processedValue < 0) processedValue = 0;
            } else if (constraintKey === 'maxLength') {
                processedValue = value === '' ? Infinity : parseInt(value, 10); // Default to Infinity if empty
                if (isNaN(processedValue) || processedValue < 0) processedValue = Infinity; // Allow 0 for max length? Maybe min=1 if max=0? Let's allow 0.
            } else if (constraintKey === 'pattern') {
                processedValue = value; // Keep as string, even if empty
            }
            // 'required' is handled by the selector

            // Update the specific constraint value
            currentConstraints[constraintKey] = processedValue;

            // Validate & Update Error State
            // Check min/max relationship only if both are actively set
            const minIsActive = currentConstraints.minLength > 0;
            const maxIsActive = currentConstraints.maxLength !== Infinity;
            if (minIsActive && maxIsActive && currentConstraints.minLength > currentConstraints.maxLength) {
                errorMsg = 'Min Length cannot exceed Max Length.';
            } else {
                errorMsg = ''; // Clear error if condition is met or constraints aren't conflicting
            }

            currentField.constraints = currentConstraints;
            currentField.constraintError = errorMsg; // Update error message on the field
            newForm[index] = currentField;

            return newForm;
        });
    };

    // Handle changes from the ConstraintSelector (adding/removing constraint tags)
    const handleFieldConstraintChange = (index) => (newActiveKeys) => {
        setForm(prevForm => {
            const newForm = [...prevForm];
            const currentField = { ...newForm[index] }; // Clone field
            const oldConstraints = currentField.constraints;
            const applicableKeys = getApplicableConstraintKeys(currentField.type);

            // Filter newActiveKeys to only include those applicable to the current type
            const newActiveApplicableKeys = newActiveKeys.filter(key => applicableKeys.includes(key));

            const newConstraints = { ...DEFAULT_INACTIVE_CONSTRAINTS }; // Start with inactive defaults
            let currentError = '';

            // Build new constraints state based on active & applicable keys
            applicableKeys.forEach(key => {
                if (newActiveApplicableKeys.includes(key)) {
                    // Constraint is active and applicable
                    if (key === 'required') {
                        newConstraints.required = true;
                    } else {
                        // Restore old value if it exists and wasn't the default 'inactive' value,
                        // otherwise set a sensible 'active' default.
                        const oldVal = oldConstraints[key];
                        const inactiveVal = DEFAULT_INACTIVE_CONSTRAINTS[key];
                        const wasPreviouslyActive = oldVal !== inactiveVal;

                        if (wasPreviouslyActive) {
                            newConstraints[key] = oldVal; // Keep existing value
                        } else {
                            // Set a sensible default when activating for the first time
                            if (key === 'minLength') newConstraints.minLength = 1; // e.g., min 1
                            else if (key === 'maxLength') newConstraints.maxLength = 100; // e.g., max 100
                            else if (key === 'pattern') newConstraints.pattern = ''; // Start with empty pattern string
                            // else: handle other constraint defaults if needed
                        }
                    }
                }
                // else: Constraint is inactive or not applicable - it keeps the inactive default
            });

            // Re-validate min/max length after keys change
            const minIsActive = newConstraints.minLength > 0;
            const maxIsActive = newConstraints.maxLength !== Infinity;
            if (minIsActive && maxIsActive && newConstraints.minLength > newConstraints.maxLength) {
                currentError = 'Min Length cannot exceed Max Length.';
            }

            currentField.constraints = newConstraints;
            currentField.constraintError = currentError;
            newForm[index] = currentField;
            return newForm;
        });
    };


    // Helper to get active keys *from the state values* for a specific field
    const getActiveConstraintKeysFromState = (constraints) => {
        const keys = [];
        if (!constraints) return keys;

        if (constraints.required === true) keys.push('required');
        if (constraints.minLength > 0) keys.push('minLength');
        if (constraints.maxLength !== Infinity) keys.push('maxLength');
        if (constraints.pattern !== null) keys.push('pattern'); // Active if not null
        // Add checks for other constraints if implemented (e.g., constraints.min !== null)
        return keys;
    };


    // --- Save Handlers ---
    const saveFormDefinition = async () => {
        if (!event || !event.id) { setFormError("Cannot save form: Event ID missing."); return; }

        // --- Pre-Save Validation ---
        let firstError = null;
        for (let i = 0; i < form.length; i++) {
            const f = form[i];
            if (!f.label) {
                 firstError = `Field ${i + 1} needs a label.`; break;
            }
            if (f.constraintError) {
                 firstError = `Fix error in field "${f.label || `Field ${i+1}` }": ${f.constraintError}`; break;
            }
            if (['select', 'radio'].includes(f.type)) {
                if (!f.options || f.options.length === 0) {
                     firstError = `Field "${f.label || `Field ${i+1}` }" (${f.type}) must have at least one option.`; break;
                }
                if (f.options.some(opt => !opt.label || !opt.value)) {
                     firstError = `All options in field "${f.label || `Field ${i+1}` }" must have both a Label and a Value.`; break;
                }
            }
        }
        if (firstError) { setFormError(firstError); return; }
        // --- End Validation ---


        setIsSavingForm(true); setFormError('');

        // Prepare payload: remove temporary IDs, errors, and convert pattern null -> ''
        const formToSave = form.map(({ id, constraintError, options, constraints, ...rest }) => {
            const finalConstraints = { ...constraints };
            // Convert pattern: null to '' for saving, keep actual strings
            if (finalConstraints.pattern === null) {
                finalConstraints.pattern = '';
            }
            // Optionally: remove constraints that are in their default 'inactive' state?
            // For simplicity, we save them all. Backend/frontend rendering logic should handle inactive values.

            return {
                ...rest,
                constraints: finalConstraints,
                options: options?.map(({ id: optId, ...optRest }) => optRest) ?? []
            };
        });

        console.log("Saving Form Payload:", JSON.stringify(formToSave, null, 2));
        try {
            const { error } = await supabase.from('Upcomings').update({ form_definition: formToSave }).eq('id', event.id);
            if (error) throw error;
            // Update local event state *after* successful save
            setEvent(prev => prev ? { ...prev, form_definition: formToSave } : null);
            setVisibleForm(false);
        } catch (err) {
            console.error("Error saving form definition:", err.message); setFormError(`Save failed: ${err.message}`);
        } finally { setIsSavingForm(false); }
    };

    const handleInfoInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        // Derive key more robustly, assuming id is like 'event-some_key-input'
        const key = id.replace(/^event-|-input$/g, '');
        if (key) { // Ensure a key was derived
             setEventInfoEdits(prev => ({ ...prev, [key]: type === 'checkbox' ? checked : value }));
        }
    };

    const saveEventInfo = async (e) => {
        e.preventDefault();
        if (!event || !event.id) { setInfoError("Cannot save: Event ID missing."); return; }
        setIsSavingInfo(true); setInfoError('');

        // Exclude fields managed elsewhere or automatically
        const { id, created_at, form_definition, ...updates } = eventInfoEdits;
        // Basic validation (e.g., ensure name is present)
        if (!updates.name?.trim()) {
             setInfoError("Event Name cannot be empty.");
             setIsSavingInfo(false);
             return;
        }

        console.log("Saving Info Payload:", updates);
        try {
            // Add file upload logic here if needed, saving the URL in 'updates'
            const { data: updatedEvent, error } = await supabase.from('Upcomings').update(updates).eq('id', event.id).select().single();
            if (error) throw error;
            setEvent(updatedEvent); // Update main event state
            setVisibleInfo(false);
        } catch (err) {
            console.error("Error saving event info:", err.message); setInfoError(`Save failed: ${err.message}`);
        } finally { setIsSavingInfo(false); }
    };

    // --- Render Logic ---
    if (isLoadingEvent) {
        return <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center min-h-[150px]"><IconLoader size={30} className="animate-spin text-gray-400" /></div>;
    }
    // Show error if loading finished and event is null (either not found or fetch failed)
    if (!event && !isLoadingEvent) {
        return <div className="bg-white rounded-lg shadow-md p-4 border border-red-200"><h2 className="text-xl font-bold text-red-700">Error</h2><p className="text-gray-600 my-2">{infoError || `Event data could not be loaded.`}</p></div>;
    }
    // If event is null even after loading (shouldn't happen if error is caught, but safe check)
    if (!event) {
         return <div className="bg-white rounded-lg shadow-md p-4"><p className="text-gray-500 text-center">Event data not available.</p></div>;
    }


    return (
        <>
            {/* --- Info Modal --- */}
            <Modal isOpen={visibleInfo} onClose={closeModal} title="Edit Event Info">
                {/* Added overflow-y-auto and padding for scroll */}
                <form onSubmit={saveEventInfo} className="flex flex-col gap-4 mt-4 max-h-[80vh] overflow-y-auto px-4 pb-20"> {/* Add padding-bottom */}
                    {infoError && <p className="text-red-600 text-sm w-full text-center mb-2">{infoError}</p>}

                    <div className='w-full'>
                        <label htmlFor="event-name-input" className="text-sm font-medium text-gray-700 w-full text-left block mb-1">Name</label>
                        <input id="event-name-input" type="text" className="border border-gray-300 rounded p-2 w-full" placeholder="Event Name" value={eventInfoEdits.name || ''} onChange={handleInfoInputChange} required />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="event-brief-input" className="text-sm font-medium text-gray-700 w-full text-left block mb-1">Brief</label>
                        <textarea id="event-brief-input" className="border border-gray-300 rounded p-2 w-full min-h-[80px]" placeholder="Brief Description" value={eventInfoEdits.brief || ''} onChange={handleInfoInputChange} />
                    </div>
                     <div className='w-full'>
                        <label htmlFor="event-date-input" className="text-sm font-medium text-gray-700 w-full text-left block mb-1">Date</label>
                        <input id="event-date-input" type="date" className="border border-gray-300 rounded p-2 w-full" value={eventInfoEdits.date || ''} onChange={handleInfoInputChange} />
                     </div>
                     <div className='w-full'>
                        <label htmlFor="event-location-input" className="text-sm font-medium text-gray-700 w-full text-left block mb-1">Location</label>
                        <input id="event-location-input" type="text" className="border border-gray-300 rounded p-2 w-full" placeholder="Location" value={eventInfoEdits.location || ''} onChange={handleInfoInputChange} />
                     </div>
                     <div className='w-full'>
                        <label htmlFor="event-image_url-input" className="text-sm font-medium text-gray-700 w-full text-left block mb-1">Image URL</label>
                        <input id="event-image_url-input" type="url" className="border border-gray-300 rounded p-2 w-full" placeholder="https://..." value={eventInfoEdits.image_url || ''} onChange={handleInfoInputChange} />
                    </div>
                    {/* Add other fields as needed */}

                    {/* Sticky Footer for Buttons - Adjusted parent padding */}
                    <div className="absolute bottom-0 left-0 right-0 w-full px-4 py-3 border-t bg-white z-10">
                        {/* **FIXED FLEXBOX**: Using flex-col and gap */}
                        <div className="flex flex-col gap-2">
                            <button type="submit" disabled={isSavingInfo} className="bg-gradient-to-br from-secondary-light to-secondary-dark text-white py-2 px-4 rounded w-full hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{isSavingInfo ? <><IconLoader size={18} className="animate-spin" /> Saving...</> : 'Save Info'}</button>
                            <button type="button" onClick={closeModal} disabled={isSavingInfo} className="bg-gray-200 text-gray-700 py-2 px-4 rounded w-full hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* --- Form Builder Modal --- */}
            <Modal isOpen={visibleForm} onClose={closeModal} title="Event Form Builder">
                {/* Use flex column for layout, defining header, scrollable content, and footer */}
                <div className="flex flex-col gap-0 mt-2 min-w-[50vw] md:min-w-[40vw] max-h-[85vh]">
                    {/* Header: Add Field Button */}
                    <div className="w-full px-4 pt-2 flex-shrink-0">
                        <button onClick={addField} className="w-full bg-gradient-to-br from-primary-light to-primary-dark text-white py-2 px-4 rounded mb-1 hover:opacity-90 flex items-center justify-center gap-2"><IconPlus size={18} /> Add New Field</button>
                    </div>

                    {/* Scrollable Form Fields Area */}
                    <div className="flex-grow overflow-y-auto w-full px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                        {form.length === 0 && <p className="text-gray-500 text-center my-6 italic">Click "Add New Field" to start building.</p>}

                        {form.map((field, index) => {
                            const applicableConstraintKeys = getApplicableConstraintKeys(field.type);
                            const applicableOptions = ALL_CONSTRAINT_OPTIONS.filter(opt => applicableConstraintKeys.includes(opt.key));
                            // Determine currently active keys from state *values* for THIS field
                            const currentActiveKeys = getActiveConstraintKeysFromState(field.constraints);
                            const fieldId = field.id;

                            // Check if specific constraint inputs should be visible (based on active keys)
                            const showMinLength = currentActiveKeys.includes('minLength');
                            const showMaxLength = currentActiveKeys.includes('maxLength');
                            const showPattern = currentActiveKeys.includes('pattern'); // This now works correctly

                            return (
                                <div key={fieldId} className="flex flex-col gap-3 border border-gray-200 p-4 rounded-md w-full shadow-sm bg-white relative">
                                    {/* Header: Label + Remove */}
                                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                                        <label className="text-gray-700 font-semibold">Field {index + 1} Config</label>
                                        <button onClick={removeItem(index)} aria-label={`Remove Field ${index + 1}`} className="text-red-500 hover:text-red-700"><IconSquareLetterXFilled size={24} /></button>
                                    </div>
                                    {/* Field Label */}
                                    <div>
                                        <label htmlFor={`${fieldId}-label-input`} className="text-xs font-medium text-gray-600 block mb-1">Field Label <span className='text-red-500'>*</span></label>
                                        <input id={`${fieldId}-label-input`} type="text" className="border border-gray-300 rounded p-2 w-full text-sm" placeholder="e.g., Full Name" value={field.label} onChange={handleFieldInputChange(index, 'label')} required />
                                    </div>
                                    {/* Field Type */}
                                    <div>
                                        <label htmlFor={`${fieldId}-type-select`} className="text-xs font-medium text-gray-600 block mb-1">Field Type</label>
                                        <select id={`${fieldId}-type-select`} className="border border-gray-300 rounded p-2 w-full bg-white text-sm" value={field.type} onChange={handleFieldInputChange(index, 'type')}>
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
                                            <option value="file">File Upload</option>
                                        </select>
                                    </div>

                                    {/* --- Options Section (Conditional) --- */}
                                    {(field.type === 'select' || field.type === 'radio') && (
                                        <div className="mt-2 border-t pt-3">
                                            <h4 className="text-xs font-medium text-gray-600 mb-2">Options for {field.type === 'select' ? 'Dropdown' : 'Radio Buttons'} <span className='text-red-500'>*</span></h4>
                                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                                                {(field.options || []).map((option, optIndex) => (
                                                    <div key={option.id || optIndex} className="flex items-center gap-2">
                                                        <input type="text" placeholder="Visible Label *" value={option.label} onChange={handleOptionChange(index, optIndex, 'label')} className="flex-grow border border-gray-300 rounded p-1.5 text-sm" required />
                                                        <input type="text" placeholder="Internal Value *" value={option.value} onChange={handleOptionChange(index, optIndex, 'value')} className="flex-grow border border-gray-300 rounded p-1.5 text-sm" required />
                                                        <button onClick={removeOption(index, optIndex)} aria-label="Remove Option" className="text-red-400 hover:text-red-600 flex-shrink-0"><IconSquareLetterXFilled size={18} /></button>
                                                    </div>
                                                ))}
                                                {(!field.options || field.options.length === 0) && <p className='text-xs text-gray-400 italic'>No options added yet. Add at least one.</p>}
                                            </div>
                                            <button onClick={addOption(index)} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><IconPlus size={16} /> Add Option</button>
                                        </div>
                                    )}

                                    {/* --- Constraints Section (Only if applicable constraints exist) --- */}
                                    {applicableOptions.length > 0 && (
                                        <div className="mt-2 border-t pt-3">
                                            <label id={`${fieldId}-constraints-label`} className="text-xs font-medium text-gray-600 mb-1 block">Validation Constraints</label>
                                            {field.constraintError && <p className="text-red-600 text-xs mb-2">{field.constraintError}</p>}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 items-start">
                                                <div className="sm:col-span-2">
                                                    <ConstraintSelector
                                                        fieldId={fieldId}
                                                        applicableOptions={applicableOptions}
                                                        activeConstraintKeys={currentActiveKeys} // Pass keys derived from state
                                                        onChange={handleFieldConstraintChange(index)}
                                                    />
                                                </div>

                                                {/* Conditionally render value inputs based on *active* keys */}
                                                {showMinLength && (<div className="mt-1"><label htmlFor={`${fieldId}-minLength`} className="block text-xs font-medium text-gray-500 mb-0.5">Min Length</label><input type="number" id={`${fieldId}-minLength`} value={field.constraints.minLength <= 0 ? '' : field.constraints.minLength} onChange={handleConstraintValueChange(index, 'minLength')} min="1" placeholder="e.g., 5" className="w-full p-2 border border-gray-300 rounded-md text-sm" /></div>)}
                                                {showMaxLength && (<div className="mt-1"><label htmlFor={`${fieldId}-maxLength`} className="block text-xs font-medium text-gray-500 mb-0.5">Max Length</label><input type="number" id={`${fieldId}-maxLength`} value={field.constraints.maxLength === Infinity ? '' : field.constraints.maxLength} onChange={handleConstraintValueChange(index, 'maxLength')} min="0" placeholder="e.g., 100" className="w-full p-2 border border-gray-300 rounded-md text-sm" /></div>)}
                                                {/* **FIXED PATTERN**: Input now renders when tag selected. Uses ?? '' to handle null */}
                                                {showPattern && (<div className="mt-1 sm:col-span-2"><label htmlFor={`${fieldId}-pattern`} className="block text-xs font-medium text-gray-500 mb-0.5">Pattern (Regex)</label><input type="text" id={`${fieldId}-pattern`} value={field.constraints.pattern ?? ''} onChange={handleConstraintValueChange(index, 'pattern')} placeholder="e.g., ^\\d{5}$ (5 digits)" className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm" /><p className="text-xs text-gray-500 mt-0.5">JS regex pattern (no slashes `/`).</p></div>)}
                                            </div>
                                        </div>
                                    )}

                                </div> // End field container
                            );
                        })} {/* End form.map */}
                    </div> {/* End Scrollable Area */}

                    {/* Footer Buttons Area */}
                    <div className="w-full px-4 py-3 border-t bg-white z-10 flex-shrink-0">
                        {formError && <p className="text-red-600 text-sm text-center mb-2">{formError}</p>}
                         {/* **FIXED FLEXBOX**: Using flex-col and gap */}
                        <div className="flex flex-col gap-2">
                            <button onClick={saveFormDefinition} disabled={isSavingForm} className="w-full bg-gradient-to-br from-secondary-light to-secondary-dark text-white py-2 px-4 rounded hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{isSavingForm ? <><IconLoader size={18} className="animate-spin" /> Saving...</> : 'Save Form'}</button>
                            <button type="button" onClick={closeModal} disabled={isSavingForm} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* --- The Actual Card Display --- */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow min-h-[250px]"> {/* Added min-height */}
                <div> {/* Wrap content to allow button spacing */}
                    <h2 className="text-lg font-bold pb-2 border-b mb-3">{event.name || `Event ID: ${number}`}</h2>
                    <p className="text-gray-600 text-sm mb-1 line-clamp-3">{event.brief || 'No description.'}</p>
                    {event.date && <p className="text-gray-500 text-xs mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>}
                    {event.location && <p className="text-gray-500 text-xs mb-4">Location: {event.location}</p>}
                    {event.image_url && <img src={event.image_url} alt={event.name || 'Event image'} className="w-full h-24 object-cover rounded mb-3" />}
                </div>
                <div className="mt-auto flex flex-col gap-2 pt-3 border-t"> {/* mt-auto pushes to bottom */}
                    <button onClick={openInfoModal} className="w-full bg-gradient-to-br from-secondary-light to-secondary-dark truncate text-white py-1.5 px-3 rounded text-sm hover:opacity-90">Edit Info</button>
                    <button onClick={openFormModal} className="w-full bg-gradient-to-br from-primary-light to-primary-dark truncate text-white py-1.5 px-3 rounded text-sm hover:opacity-90">Edit Form ({form?.length || 0})</button>
                </div>
            </div>
        </>
    );
}