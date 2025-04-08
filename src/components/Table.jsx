import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconChevronUp,
    IconChevronDown,
    IconTrash,
    IconEdit,
    IconCheck,
    IconFilter,
    IconFilterOff,
    IconEye,
    IconUserCircle,
    IconUpload,
    IconX,
    IconTableOff
} from '@tabler/icons-react';
import Modal from './Global/Modal'; // Make sure this path is correct

const LIMIT = 20;
const MAX_IMAGE_WIDTH = 300;
const MAX_IMAGE_HEIGHT = 200;

export default function SortableTable({ data = null, cols = null, onDelete, onUpdate }) {
    const [info, setInfo] = useState([]); // Initialize as an empty array
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editModalState, setEditModalState] = useState({ open: false, item: null });
    const [editForm, setEditForm] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [cellPopup, setCellPopup] = useState({ open: false, content: '', title: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [hoveredImageIndex, setHoveredImageIndex] = useState({});
    const fileInputRefs = useRef({});

    // Default columns definition moved inside the component or passed reliably via props
    const defaultTableColumns = React.useMemo(() => (cols ? cols : [
        // Default structure if 'cols' prop isn't provided
        // Ensure 'id' column is not explicitly defined here unless you *want* it visible by default
        { key: 'mainPicture', label: 'Main Picture', type: 'image', width: 150, maxImages: 1 },
        { key: 'pictures', label: 'Pictures', type: 'image', width: 150, maxImages: 5 },
        { key: 'name', label: 'Name', filterable: true, expandable: true },
        { key: 'date', label: 'Date', filterable: true },
        { key: 'email', label: 'Email', filterable: true },
        { key: 'department', label: 'Department', filterable: true },
        { key: 'role', label: 'Role' },
        { key: 'joinDate', label: 'Join Date' },
        { key: 'status', label: 'Status' },
        { key: 'description', label: 'Description', expandable: true },
        { key: 'brief', label: 'Brief', expandable: true },
        { key: 'location', label: 'Location', filterable: true },
        { key: 'attendees', label: 'Attendees', filterable: true },
        { key: 'type', label: 'Type', filterable: true }
    ]), [cols]); // Depend on the cols prop

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, columnFilters]);

    useEffect(() => {
        if (data) {
            // Normalize the data: ensure image fields are ALWAYS arrays internally
            // Also ensure each item has an 'id' - crucial for keys and operations
            const normalizedData = data.map((item, index) => {
                // Attempt to find an existing ID, otherwise generate one (less ideal for updates/deletes)
                const id = item.id || item._id || `gen_${index}`; // Prefer existing id or _id
                if (!item.id && !item._id) {
                    console.warn(`Data item at index ${index} missing 'id' or '_id'. Using generated ID: ${id}. Consider providing stable IDs.`);
                }
                const newItem = { ...item, id: id }; // Ensure 'id' key exists
                defaultTableColumns.forEach(col => { // Use the resolved columns
                    if (col.type === 'image') {
                        const currentVal = newItem[col.key];
                        // Always store as an array internally for consistency
                        newItem[col.key] = currentVal == null ? [] : (Array.isArray(currentVal) ? currentVal : [currentVal]);
                    }
                });
                return newItem;
            });
            setInfo(normalizedData);
        } else {
            setInfo([]); // Ensure info is empty if data is null/empty
        }
    }, [data, defaultTableColumns]); // Depend on resolved columns

    const isMobile = windowWidth < 768;

    const requestSort = (key) => {
        // Prevent sorting by 'id' column if it were somehow clickable (it shouldn't be rendered)
        if (key === 'id') return;
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedinfo = React.useMemo(() => {
        if (!info || !Array.isArray(info)) return [];
        let sortedData = [...info]; // Create a copy

        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const keyA = a[sortConfig.key];
                const keyB = b[sortConfig.key];

                // Handle sorting for different types, including potential arrays for images (sort by length?)
                // Basic comparison:
                if (keyA == null && keyB == null) return 0;
                if (keyA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (keyB == null) return sortConfig.direction === 'ascending' ? 1 : -1;

                // Add specific comparison logic if needed, e.g., for dates or numbers
                // For now, basic comparison:
                if (keyA < keyB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (keyA > keyB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedData;
    }, [info, sortConfig]);

    // --- MODIFIED SEARCH FILTER LOGIC ---
    const filteredinfo = sortedinfo.filter(item => {
        // Global search term check (ignores image and id columns)
        const matchesSearch = defaultTableColumns.some(col => { // Iterate through defined columns
            // Skip image and ID columns for global search
            if (col.type === 'image' || col.key === 'id') {
                return false;
            }
            const value = item[col.key];
            return value != null && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Column-specific filters check
        const matchesFilters = Object.entries(columnFilters).every(([key, filterVal]) => {
            // Find the column definition to check its type if needed
            const colDef = defaultTableColumns.find(c => c.key === key);
            // Skip image columns for column filters as well (unless specifically designed)
            // Also skip ID column if a filter was somehow applied to it
            if (!filterVal || key === 'id' || (colDef && colDef.type === 'image')) {
                return true; // Ignore empty filters, id column, or image columns
            }
            const itemValue = item[key];
            return itemValue != null && itemValue.toString().toLowerCase().includes(filterVal.toLowerCase());
        });

        return matchesSearch && matchesFilters;
    });
    // --- END OF MODIFIED SEARCH FILTER LOGIC ---


    const totalPages = Math.ceil(filteredinfo.length / LIMIT);
    const paginatedinfo = filteredinfo.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

    // Calculate visible columns count for colspan (excluding 'id')
    // +1 for the Actions column
    const visibleColumnCount = defaultTableColumns.filter(col => col.key !== 'id').length + 1;


    const handleDelete = (id) => {
        onDelete(id);
        setDeleteModal({ open: false, id: null });
    };

    const handleImageChange = (event, itemId, columnKey, maxImages = 1) => { // Default maxImages to 1
        const files = Array.from(event.target.files);
        setImageUploadError(''); // Clear previous errors

        // Check if adding new files exceeds the limit for this specific column
        const currentImageCount = editForm[columnKey] ? editForm[columnKey].length : 0;
        if (currentImageCount + files.length > maxImages) {
            setImageUploadError(`You can upload a maximum of ${maxImages} image${maxImages > 1 ? 's' : ''} for ${defaultTableColumns.find(c => c.key === columnKey)?.label || columnKey}.`);
            // Clear the file input value to allow re-selection if needed
            if (fileInputRefs.current[columnKey]?.current) {
                fileInputRefs.current[columnKey].current.value = '';
            }
            return;
        }

        const newImagePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result); // Base64 string
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImagePromises)
            .then(base64Images => {
                setEditForm(prevForm => {
                    const existingImages = prevForm[columnKey] || [];
                    return {
                        ...prevForm,
                        // Always store as an array in editForm state
                        [columnKey]: [...existingImages, ...base64Images],
                    };
                });
            })
            .catch(error => {
                console.error("Error reading image files:", error);
                setImageUploadError('Failed to process one or more images.');
            });

        // Clear the file input value after processing
        if (fileInputRefs.current[columnKey]?.current) {
            fileInputRefs.current[columnKey].current.value = '';
        }
    };

    const handleClearImages = (columnKey) => {
        setEditForm(prevForm => ({
            ...prevForm,
            [columnKey]: [], // Clear the array
        }));
        setImageUploadError(''); // Clear any upload errors
        // Clear the file input value
        if (fileInputRefs.current[columnKey]?.current) {
            fileInputRefs.current[columnKey].current.value = '';
        }
    };

    // --- MODIFIED EDIT HANDLER ---
    const handleEdit = () => {
        // Create a copy of the form data to potentially modify for submission
        const dataToSend = { ...editForm };

        // Adjust image fields based on maxImages before sending
        defaultTableColumns.forEach(col => {
            // Skip ID column processing here too, it should just pass through
            if (col.key === 'id') return;

            if (col.type === 'image') {
                const currentVal = dataToSend[col.key]; // This is always an array internally
                if (col.maxImages === 1) {
                    // If maxImages is 1, send only the first element or null
                    dataToSend[col.key] = (currentVal && currentVal.length > 0) ? currentVal[0] : null;
                } else {
                    // For multiple images, ensure it's an array (it should be) or send empty array
                    dataToSend[col.key] = Array.isArray(currentVal) ? currentVal : [];
                }
            }
        });

        // Make sure the 'id' from the original item is included
        if (editModalState.item && editModalState.item.id) {
            dataToSend.id = editModalState.item.id;
        } else {
            console.error("Cannot update item: Original item ID not found.");
            // Optionally show an error to the user
            return; // Prevent update if ID is missing
        }


        onUpdate(dataToSend); // Send the potentially modified data
        setEditModalState({ open: false, item: null });
        setEditForm({});
        setImageUploadError('');
    };
    // --- END OF MODIFIED EDIT HANDLER ---


    const handleEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const getSortDirectionIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <IconChevronUp className="inline w-4 h-4 ml-1" /> : <IconChevronDown className="inline w-4 h-4 ml-1" />;
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        const strText = String(text); // Ensure it's a string
        if (strText.length <= maxLength) return strText;
        return strText.substring(0, maxLength) + '...';
    };

    const handleImageClick = (images, title = 'Images') => { // Added title parameter
        if (images && images.length > 0) {
            const imageContent = images.map((image, index) => (
                <img
                    key={index}
                    src={image} // Assuming image is a Base64 string or URL
                    alt={`${title} ${index + 1}`}
                    className="block h-auto max-w-full mb-2" // Ensure images stack vertically
                    style={{ maxWidth: MAX_IMAGE_WIDTH, maxHeight: MAX_IMAGE_HEIGHT }}
                />
            ));

            setCellPopup({
                open: true,
                // Wrap content for better layout if multiple images
                content: <div className="flex flex-col items-center space-y-2">{imageContent}</div>,
                title: title, // Use the provided title
            });
        }
    };

    const handleRemoveImage = (columnKey, indexToRemove) => {
        setEditForm(prevForm => ({
            ...prevForm,
            // Filter out the image at the specified index
            [columnKey]: prevForm[columnKey].filter((_, index) => index !== indexToRemove),
        }));
        setImageUploadError(''); // Clear error if user is managing images
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        // Add basic pagination controls (Prev/Next) for many pages
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const visiblePages = pages.slice(startPage - 1, endPage);

        return (
            <div className="flex items-center justify-center mt-6 space-x-1">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded-md transition-colors duration-150 text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                    Prev
                </button>
                {startPage > 1 && (
                    <>
                        <button onClick={() => setCurrentPage(1)} className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">1</button>
                        {startPage > 2 && <span className="px-2 py-1 text-gray-500">...</span>}
                    </>
                )}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md transition-colors duration-150 text-sm ${currentPage === page
                            ? 'bg-primary-light text-white border-primary-light hover:bg-primary-dark hover:border-primary-dark'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 py-1 text-gray-500">...</span>}
                        <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">{totalPages}</button>
                    </>
                )}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded-md transition-colors duration-150 text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                    Next
                </button>
            </div>
        );
    };

    // --- RENDER LOGIC ---

    if (!info) { // Check if info is null (still loading perhaps)
        return <div className="p-6 text-center">Loading data...</div>; // Or some loading indicator
    }

    if (info.length === 0 && !searchTerm && Object.keys(columnFilters).length === 0) { // Only show "No data" if there's truly no data initially
        return (
            <div className="flex flex-col items-center justify-center p-4 text-center h-96">
                <IconTableOff size={60} className="mb-4 text-gray-400" />
                <p className="text-xl text-gray-500">No data available</p>
                <p className="mt-2 text-sm text-gray-400">There is currently no data to display in this table.</p>
            </div>
        );
    }

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <div className="w-full px-2 sm:px-4">
                {/* Mobile Search Bar */}
                <div className="sticky top-0 z-10 px-2 py-2 mb-4 -mx-2 overflow-x-hidden bg-gray-100 dark:bg-gray-800 sm:px-0 sm:mx-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Mobile Cards */}
                {paginatedinfo.length > 0 ? (
                    <div className="mt-4 space-y-4">
                        <AnimatePresence>
                            {paginatedinfo.map((item) => (
                                <motion.div
                                    key={item.id} // Use the guaranteed item.id
                                    layout // Animate layout changes
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                    className="p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        {/* Try to find a primary display column (e.g., 'name' or the first non-image, non-id column) */}
                                        {(() => {
                                            const primaryCol = defaultTableColumns.find(col => col.key === 'name') || defaultTableColumns.find(col => col.type !== 'image' && col.key !== 'id');
                                            return primaryCol ? (
                                                <h3 className="mr-2 text-lg font-bold text-gray-800 break-words dark:text-gray-100">
                                                    {item[primaryCol.key]}
                                                </h3>
                                            ) : (
                                                // Fallback if no suitable header column found (e.g., show ID?)
                                                // Or render nothing
                                                <div className="h-6"></div> // Placeholder to maintain layout
                                            );
                                        })()}
                                        <div className="flex flex-shrink-0 space-x-1">
                                            <button
                                                onClick={() => {
                                                    // Ensure image fields are arrays when setting editForm
                                                    const itemToEdit = { ...item };
                                                    defaultTableColumns.forEach(col => {
                                                        if (col.key === 'id') return; // Skip id
                                                        if (col.type === 'image') {
                                                            const currentVal = itemToEdit[col.key];
                                                            itemToEdit[col.key] = currentVal == null ? [] : (Array.isArray(currentVal) ? currentVal : [currentVal]);
                                                        }
                                                    });
                                                    setEditForm(itemToEdit);
                                                    setEditModalState({ open: true, item: itemToEdit });
                                                }}
                                                className="p-1 transition-colors duration-150 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400"
                                                aria-label="Edit item"
                                            >
                                                <IconEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, id: item.id })}
                                                className="p-1 text-red-600 transition-colors duration-150 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-500"
                                                aria-label="Delete item"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Body - Key-Value Pairs */}
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        {defaultTableColumns.map((column) => {
                                            // --- HIDE ID COLUMN ---
                                            if (column.key === 'id') {
                                                return null;
                                            }
                                            // --- END HIDE ID COLUMN ---

                                            // Optionally skip the primary display column shown in the header
                                            // const primaryColKey = (defaultTableColumns.find(col => col.key === 'name') || defaultTableColumns.find(col => col.type !== 'image' && col.key !== 'id'))?.key;
                                            // if (column.key === primaryColKey) {
                                            //     return null;
                                            // }

                                            const value = item[column.key];

                                            if (column.type === 'image') {
                                                // Internal value is always an array here due to normalization
                                                const images = value || [];
                                                return (
                                                    <div key={column.key} className="flex items-center pt-1">
                                                        <span className="flex-shrink-0 block w-24 text-xs font-medium text-gray-500 dark:text-gray-400">{column.label}:</span>
                                                        <div className="flex flex-wrap items-center pl-2">
                                                            {images.length > 0 ? (
                                                                images.slice(0, 4).map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image}
                                                                        alt={`${column.label} ${index + 1}`}
                                                                        className="object-cover w-8 h-8 mb-1 mr-1 border border-gray-300 rounded-full dark:border-gray-600"
                                                                        onClick={(e) => { e.stopPropagation(); handleImageClick(images, column.label); }} // Allow clicking thumbnails
                                                                        loading="lazy"
                                                                    />
                                                                ))
                                                            ) : (
                                                                <IconUserCircle size={24} className="text-gray-400 dark:text-gray-500" /> // Placeholder
                                                            )}
                                                            {images.length > 4 && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleImageClick(images, column.label); }}
                                                                    className="ml-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                                                >
                                                                    +{images.length - 4} more
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Render regular fields
                                            return (
                                                <div key={column.key} className="flex items-start pt-1 ">
                                                    <div className="relative">
                                                        <span className="relative flex-shrink-0 block w-24 text-xs font-medium text-gray-500 dark:text-gray-400">{column.label}:</span>
                                                        {(column.expandable || column.type === 'image' || String(value).length >= 35) && <IconEye size={14} className="absolute right-0 z-30 ml-1 text-gray-400 top-1" />}
                                                    </div>
                                                    <span
                                                        className={`overflow-visible pl-2 relative text-gray-800 dark:text-gray-200 truncate break-words ${(column.expandable || String(value).length > 35) ? 'cursor-pointer hover:text-primary-600' : ''}`}
                                                        onClick={column.expandable ? () => setCellPopup({ open: true, content: <div className="p-2 break-words whitespace-pre-wrap">{String(value)}</div>, title: column.label }) : undefined}
                                                        title={column.expandable ? `Click to view full ${column.label}` : String(value)}
                                                    >
                                                        {truncateText(value, column.expandable ? 35 : 100)} {/* Show more if expandable */}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    // Display when filtered results are empty
                    <div className="px-4 py-10 text-center">
                        <IconFilterOff size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-600 dark:text-gray-300">No results found matching your search or filter criteria.</p>
                    </div>
                )}
                {renderPagination()}

                {/* Common Modals (Delete, Edit, Cell Popup) - Render outside the loop */}
                {/* Edit Modal remains the same structure but uses 'defaultTableColumns' */}
                <Modal isOpen={editModalState.open} onClose={() => setEditModalState({ open: false, item: null })} title="Edit Item">
                    {/* Form and buttons - Ensure it uses defaultTableColumns */}
                    <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
                        {imageUploadError && (
                            <div className="p-2 mb-2 text-sm text-red-500 bg-red-100 rounded dark:text-red-400 dark:bg-red-900/30">
                                {imageUploadError}
                            </div>
                        )}
                        {defaultTableColumns.map((column) => {
                            // --- HIDE ID FIELD IN EDIT FORM ---
                            if (column.key === 'id') return null;
                            // --- END HIDE ID FIELD ---

                            if (column.type === "image") {
                                if (!fileInputRefs.current[column.key]) {
                                    fileInputRefs.current[column.key] = React.createRef();
                                }
                                const currentImages = editForm[column.key] || []; // Should be an array
                                const canUploadMore = currentImages.length < (column.maxImages || 1);

                                return (
                                    <div key={column.key} className="flex flex-col pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {column.label} ({currentImages.length}/{column.maxImages || 1})
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            {canUploadMore && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRefs.current[column.key].current?.click()}
                                                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-150 flex items-center text-sm"
                                                >
                                                    <IconUpload size={16} className="mr-1" /> Upload
                                                </button>
                                            )}
                                            {currentImages.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleClearImages(column.key)}
                                                    className="p-1.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors duration-150 flex items-center"
                                                    title={`Clear ${column.label}`}
                                                >
                                                    <IconX size={16} />
                                                </button>
                                            )}
                                            <input
                                                type="file"
                                                multiple={(column.maxImages || 1) > 1} // Allow multiple only if maxImages > 1
                                                onChange={(e) => handleImageChange(e, editForm.id, column.key, column.maxImages || 1)}
                                                className="hidden"
                                                ref={fileInputRefs.current[column.key]}
                                                accept="image/*"
                                            />
                                        </div>
                                        {/* Image Previews */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentImages.map((fileOrUrl, index) => {
                                                const src = fileOrUrl; // Already base64 or URL
                                                const imageKey = `${column.key}-${index}-${editForm.id || 'new'}`; // More unique key
                                                return (
                                                    <div
                                                        key={imageKey}
                                                        className="relative w-16 h-16 overflow-hidden border border-gray-300 rounded-md group dark:border-gray-600"
                                                        onMouseEnter={() => setHoveredImageIndex(prev => ({ ...prev, [imageKey]: true }))}
                                                        onMouseLeave={() => setHoveredImageIndex(prev => ({ ...prev, [imageKey]: false }))}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`Preview ${index + 1}`}
                                                            className="object-cover w-full h-full transition-opacity duration-200"
                                                            loading="lazy"
                                                        />
                                                        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${hoveredImageIndex[imageKey] ? 'opacity-100' : 'opacity-0'}`}>
                                                            <button
                                                                type="button" // Prevent form submission
                                                                onClick={() => handleRemoveImage(column.key, index)}
                                                                className="p-1 text-white bg-black rounded-full bg-opacity-40 hover:bg-opacity-70"
                                                                title={`Remove Image ${index + 1}`}
                                                            >
                                                                <IconX size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            // Render standard input fields
                            return (
                                <div key={column.key} className="pt-2">
                                    <label htmlFor={`edit-${column.key}`} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{column.label}</label>
                                    {/* Basic text input, consider other types (date, number, select) based on column info if needed */}
                                    {/* Consider using textarea for 'expandable' fields */}
                                    {column.expandable ? (
                                          <textarea
                                            id={`edit-${column.key}`}
                                            name={column.key}
                                            value={editForm[column.key] || ''}
                                            onChange={handleEditFormChange}
                                            rows={3}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    ) : (
                                        <input
                                            type="text" // Could be 'date', 'number' etc. based on column type if available
                                            id={`edit-${column.key}`}
                                            name={column.key}
                                            value={editForm[column.key] || ''}
                                            onChange={handleEditFormChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {/* Modal Buttons */}
                        <div className="flex justify-end pt-5 space-x-3 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" onClick={() => setEditModalState({ open: false, item: null })} className='px-4 py-2 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-md dark:border-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
                            <button type="submit" className="flex items-center px-4 py-2 text-white transition-colors duration-150 rounded-md bg-primary-600 hover:bg-primary-700">
                                <IconCheck size={16} className="mr-1" /> Save Changes
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={deleteModal.open}
                    onClose={() => setDeleteModal({ open: false, id: null })}
                    title="Confirm Deletion"
                    buttons={[
                        { label: "Cancel", onClick: () => setDeleteModal({ open: false, id: null }), className: "dark:bg-gray-600 dark:hover:bg-gray-500" },
                        { label: "Delete", onClick: () => handleDelete(deleteModal.id), className: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600" }
                    ]}
                >
                    <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to delete this item? This action cannot be undone.</p>
                </Modal>

                {/* Cell Popup Modal */}
                <Modal
                    isOpen={cellPopup.open}
                    onClose={() => setCellPopup({ open: false, content: '', title: '' })}
                    title={cellPopup.title}
                >
                    {/* Ensure content area allows scrolling if needed */}
                    <div className="max-h-[70vh] overflow-y-auto p-1 text-gray-700 dark:text-gray-200">
                        {cellPopup.content}
                    </div>
                </Modal>
            </div>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <div className="w-full px-4">
            {/* Search and Filter UI */}
            <div className="flex flex-col items-center justify-between gap-3 mb-4 sm:flex-row">
                <input
                    type="text"
                    placeholder="Search all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:w-auto dark:bg-gray-700 dark:text-white"
                    aria-label="Search table"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors duration-150 rounded-md bg-primary-light hover:bg-primary-dark sm:w-auto"
                    aria-expanded={showFilters}
                >
                    {showFilters ? <IconFilterOff size={20} className="mr-2" /> : <IconFilter size={20} className="mr-2" />}
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Table Header */}
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {/* Actions Column Header */}
                            <th scope="col" className="sticky left-0 z-10 w-20 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gradient-to-b from-primary-light to-primary-dark dark:bg-gray-700 dark:text-gray-300">
                                Actions
                            </th>
                            {/* Data Column Headers */}
                            {defaultTableColumns.map((column) => {
                                // --- HIDE ID COLUMN HEADER ---
                                if (column.key === 'id') return null;
                                // --- END HIDE ID COLUMN HEADER ---
                                return (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer bg-gradient-to-b from-primary-light to-primary-dark dark:text-gray-300 group whitespace-nowrap"
                                        onClick={() => requestSort(column.key)}
                                        style={{ minWidth: column.width ? `${column.width}px` : '150px' }}
                                        aria-sort={sortConfig.key === column.key ? (sortConfig.direction === 'ascending' ? 'ascending' : 'descending') : 'none'}
                                    >
                                        <div className="flex items-center">
                                            <span>{column.label}</span>
                                            <span className="ml-1 transition-opacity opacity-0 group-hover:opacity-100">
                                                {getSortDirectionIcon(column.key) || <IconChevronUp className="w-4 h-4 text-gray-400" />}
                                            </span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                        {/* Filter Row */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.tr
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-gray-100 dark:bg-gray-700"
                                >
                                    <th className="sticky left-0 z-10 px-4 py-2 bg-gray-100 dark:bg-gray-700"></th> {/* Spacer for actions */}
                                    {defaultTableColumns.map((column) => {
                                        // --- HIDE ID COLUMN FILTER ---
                                        if (column.key === 'id') return null;
                                        // --- END HIDE ID COLUMN FILTER ---
                                        return (
                                            <th key={`${column.key}-filter`} className="px-4 py-2 font-normal">
                                                {column.filterable && (
                                                    <input
                                                        type="text"
                                                        value={columnFilters[column.key] || ''}
                                                        onChange={(e) =>
                                                            setColumnFilters({
                                                                ...columnFilters,
                                                                [column.key]: e.target.value,
                                                            })
                                                        }
                                                        placeholder={`Filter ${column.label}`}
                                                        aria-label={`Filter by ${column.label}`}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                                        onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking filter
                                                    />
                                                )}
                                            </th>
                                        );
                                    })}
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedinfo.length === 0 && (
                            <tr>
                                {/* --- ADJUSTED COLSPAN FOR NO RESULTS --- */}
                                <td colSpan={visibleColumnCount} className="px-4 py-10 text-center">
                                {/* --- END ADJUSTED COLSPAN --- */}
                                    <IconFilterOff size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                                    <p className="text-gray-600 dark:text-gray-300">No results found matching your search or filter criteria.</p>
                                </td>
                            </tr>
                        )}
                        <AnimatePresence>
                            {paginatedinfo.map((item, rowIndex) => ( // Added rowIndex for potential debugging, not used in key
                                <motion.tr
                                    key={item.id} // Use the guaranteed item.id
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50 group" // Added group class here for hover effects on cells
                                >
                                    {/* Sticky Actions Cell */}
                                    {/* Use group-hover to control background consistency with row */}
                                    <td className="sticky left-0 z-10 px-4 py-3 transition-colors duration-150 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    // Ensure image fields are arrays when setting editForm
                                                    const itemToEdit = { ...item };
                                                    defaultTableColumns.forEach(col => {
                                                        if (col.key === 'id') return; // Skip id
                                                        if (col.type === 'image') {
                                                            const currentVal = itemToEdit[col.key];
                                                            itemToEdit[col.key] = currentVal == null ? [] : (Array.isArray(currentVal) ? currentVal : [currentVal]);
                                                        }
                                                    });
                                                    setEditForm(itemToEdit);
                                                    setEditModalState({ open: true, item: itemToEdit });
                                                }}
                                                className="p-1 transition-colors duration-150 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-primary-600 dark:text-primary-400"
                                                title="Edit"
                                            >
                                                <IconEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, id: item.id })}
                                                className="p-1 text-red-600 transition-colors duration-150 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500"
                                                title="Delete"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    {/* Data Cells */}
                                    {defaultTableColumns.map((column) => {
                                        // --- HIDE ID COLUMN CELL ---
                                        if (column.key === 'id') return null;
                                        // --- END HIDE ID COLUMN CELL ---

                                        const value = item[column.key];

                                        if (column.type === 'image') {
                                            // Value is guaranteed to be an array here
                                            const images = value || [];
                                            return (
                                                <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center space-x-1">
                                                        {images.length > 0 ? (
                                                            <>
                                                                {/* Show first few images as thumbnails */}
                                                                {images.slice(0, 3).map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image}
                                                                        alt={`${column.label} ${index + 1}`}
                                                                        className="object-cover w-8 h-8 border border-gray-200 rounded-full cursor-pointer dark:border-gray-600"
                                                                        onClick={(e) => { e.stopPropagation(); handleImageClick(images, column.label); }}
                                                                        loading="lazy"
                                                                    />
                                                                ))}
                                                                {/* Show "+X more" button if applicable */}
                                                                {images.length > 3 && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleImageClick(images, column.label); }}
                                                                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline focus:outline-none bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded-full"
                                                                        aria-label={`View all ${images.length} images for ${column.label}`}
                                                                    >
                                                                        +{images.length - 3}
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            // Placeholder for no images
                                                            <IconUserCircle size={32} className="text-gray-300 dark:text-gray-500" />
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // Render standard text/data cells
                                        return (
                                            <td key={column.key} className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200`}>
                                                {/* Apply max width for truncation - group needed on parent tr */}
                                                <div
                                                    className="relative flex items-center group/cell"
                                                    style={{ maxWidth: column.width ? `${column.width}px` : '200px' }}
                                                >
                                                    <span
                                                        className={`truncate ${column.expandable ? 'cursor-pointer group-hover/cell:underline' : ''}`}
                                                        title={String(value)} // Tooltip shows full text
                                                        onClick={column.expandable ? () => setCellPopup({ open: true, content: <div className="p-2 break-words whitespace-pre-wrap">{String(value)}</div>, title: column.label }) : undefined}
                                                    >
                                                        {/* Use truncateText helper */}
                                                        {truncateText(value, column.expandable ? 30 : 50)}
                                                    </span>
                                                    {/* Show eye icon only if expandable AND text longer than threshold */}
                                                    {column.expandable && String(value).length > 30 && (
                                                        <button
                                                            onClick={() => setCellPopup({ open: true, content: <div className="p-2 break-words whitespace-pre-wrap">{String(value)}</div>, title: column.label })}
                                                            // Use group-hover/cell to show eye on cell hover, inherit background
                                                            className="absolute right-0 px-1 ml-1 transition-opacity -translate-y-1/2 rounded opacity-0 text-primary-600 dark:text-primary-400 group-hover/cell:opacity-100 focus:opacity-100 top-1/2 bg-inherit"
                                                            title={`View full ${column.label}`}
                                                            aria-label={`View full ${column.label}`}
                                                        >
                                                            <IconEye size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {renderPagination()}

            {/* Modals (Delete, Edit, Cell Popup) - Same as mobile */}
            {/* Edit Modal remains the same structure but uses 'defaultTableColumns' */}
            <Modal isOpen={editModalState.open} onClose={() => setEditModalState({ open: false, item: null })} title="Edit Item">
                {/* Form and buttons - Ensure it uses defaultTableColumns */}
                <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
                    {imageUploadError && (
                        <div className="p-2 mb-2 text-sm text-red-500 bg-red-100 rounded dark:text-red-400 dark:bg-red-900/30">
                            {imageUploadError}
                        </div>
                    )}
                    {defaultTableColumns.map((column) => {
                        // --- HIDE ID FIELD IN EDIT FORM ---
                        if (column.key === 'id') return null;
                        // --- END HIDE ID FIELD ---

                        if (column.type === "image") {
                            if (!fileInputRefs.current[column.key]) {
                                fileInputRefs.current[column.key] = React.createRef();
                            }
                            const currentImages = editForm[column.key] || []; // Should be an array
                            const canUploadMore = currentImages.length < (column.maxImages || 1);

                            return (
                                <div key={column.key} className="flex flex-col pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {column.label} ({currentImages.length}/{column.maxImages || 1})
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {canUploadMore && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRefs.current[column.key].current?.click()}
                                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-150 flex items-center text-sm"
                                            >
                                                <IconUpload size={16} className="mr-1" /> Upload
                                            </button>
                                        )}
                                        {currentImages.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleClearImages(column.key)}
                                                className="p-1.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors duration-150 flex items-center"
                                                title={`Clear ${column.label}`}
                                            >
                                                <IconX size={16} />
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            multiple={(column.maxImages || 1) > 1} // Allow multiple only if maxImages > 1
                                            onChange={(e) => handleImageChange(e, editForm.id, column.key, column.maxImages || 1)}
                                            className="hidden"
                                            ref={fileInputRefs.current[column.key]}
                                            accept="image/*"
                                        />
                                    </div>
                                    {/* Image Previews */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {currentImages.map((fileOrUrl, index) => {
                                            const src = fileOrUrl; // Already base64 or URL
                                            const imageKey = `${column.key}-${index}-${editForm.id || 'new'}`; // More unique key
                                            return (
                                                <div
                                                    key={imageKey}
                                                    className="relative w-16 h-16 overflow-hidden border border-gray-300 rounded-md group dark:border-gray-600"
                                                    onMouseEnter={() => setHoveredImageIndex(prev => ({ ...prev, [imageKey]: true }))}
                                                    onMouseLeave={() => setHoveredImageIndex(prev => ({ ...prev, [imageKey]: false }))}
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`Preview ${index + 1}`}
                                                        className="object-cover w-full h-full transition-opacity duration-200"
                                                        loading="lazy"
                                                    />
                                                    <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${hoveredImageIndex[imageKey] ? 'opacity-100' : 'opacity-0'}`}>
                                                        <button
                                                            type="button" // Prevent form submission
                                                            onClick={() => handleRemoveImage(column.key, index)}
                                                            className="p-1 text-white bg-black rounded-full bg-opacity-40 hover:bg-opacity-70"
                                                            title={`Remove Image ${index + 1}`}
                                                        >
                                                            <IconX size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        // Render standard input fields
                         return (
                                <div key={column.key} className="pt-2">
                                    <label htmlFor={`edit-${column.key}`} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{column.label}</label>
                                    {/* Use textarea for expandable fields, otherwise input */}
                                    {column.expandable ? (
                                        <textarea
                                            id={`edit-${column.key}`}
                                            name={column.key}
                                            value={editForm[column.key] || ''}
                                            onChange={handleEditFormChange}
                                            rows={3} // Or adjust as needed
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    ) : (
                                        <input
                                            // Consider input type based on data (e.g., 'date', 'number', 'email')
                                            type={column.key.toLowerCase().includes('email') ? 'email' : column.key.toLowerCase().includes('date') ? 'date' : 'text'}
                                            id={`edit-${column.key}`}
                                            name={column.key}
                                            value={editForm[column.key] || ''}
                                            onChange={handleEditFormChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    )}
                                </div>
                            );
                    })}
                    {/* Modal Buttons */}
                    <div className="flex justify-end pt-5 space-x-3 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={() => setEditModalState({ open: false, item: null })} className='px-4 py-2 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-md dark:border-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
                        <button type="submit" className="flex items-center px-4 py-2 text-white transition-colors duration-150 rounded-md bg-primary-600 hover:bg-primary-700">
                            <IconCheck size={16} className="mr-1" /> Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                title="Confirm Deletion"
                buttons={[
                    { label: "Cancel", onClick: () => setDeleteModal({ open: false, id: null }), className: "dark:bg-gray-600 dark:hover:bg-gray-500" },
                    { label: "Delete", onClick: () => handleDelete(deleteModal.id), className: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600" }
                ]}
            >
                <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to delete this item? This action cannot be undone.</p>
            </Modal>

            {/* Cell Popup Modal */}
            <Modal
                isOpen={cellPopup.open}
                onClose={() => setCellPopup({ open: false, content: '', title: '' })}
                title={cellPopup.title}
            >
                {/* Ensure content area allows scrolling if needed */}
                <div className="max-h-[70vh] overflow-y-auto p-1 text-gray-700 dark:text-gray-200">
                    {cellPopup.content}
                </div>
            </Modal>
        </div>
    );
};