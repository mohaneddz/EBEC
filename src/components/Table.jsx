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
import Modal from './Modal';

const LIMIT = 20;
const MAX_IMAGE_WIDTH = 300;
const MAX_IMAGE_HEIGHT = 200;

const SortableTable = ({ data = null, cols = null }) => {
    const [info, setInfo] = useState(data);
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
    const [imageUploadError, setImageUploadError] = useState('');  // General image upload error
    const [hoveredImageIndex, setHoveredImageIndex] = useState({}); // Track hover for each image field separately
    const fileInputRefs = useRef({}); // Object to hold refs for multiple file inputs


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
        // Add a unique ID to each data item if it doesn't exist
        if (data) {
            const dataWithIds = data.map((item, index) => ({
                ...item,
                id: item.id || index.toString()  // Use existing ID or create one
            }));
            setInfo(dataWithIds);
        }
    }, [data]);


    const isMobile = windowWidth < 768;

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedinfo = React.useMemo(() => {
        if (!info || !Array.isArray(info)) return [];
        if (!sortConfig.key) return [...info];
        return [...info].sort((a, b) => {
            const keyA = a[sortConfig.key];
            const keyB = b[sortConfig.key];
            if (keyA == null && keyB == null) return 0;
            if (keyA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (keyB == null) return sortConfig.direction === 'ascending' ? 1 : -1;
            if (keyA < keyB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (keyA > keyB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [info, sortConfig]);

    const filteredinfo = sortedinfo.filter(item => {
        const matchesSearch = Object.keys(item).some(key =>
            key !== 'id' &&
            item[key] != null &&
            item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilters = Object.entries(columnFilters).every(([key, filterVal]) => {
            return !filterVal || (item[key] != null && item[key].toString().toLowerCase().includes(filterVal.toLowerCase()));
        });
        return matchesSearch && matchesFilters;
    });

    const totalPages = Math.ceil(filteredinfo.length / LIMIT);
    const paginatedinfo = filteredinfo.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

    const columns = (cols ? cols : [
        { key: 'images', label: 'Images', type: 'image', width: 150, maxImages: 5 }, // Add maxImages attribute
        { key: 'name', label: 'Name', filterable: true, expandable: true },
        { key: 'email', label: 'Email', filterable: true },
        { key: 'department', label: 'Department', filterable: true },
        { key: 'role', label: 'Role' },
        { key: 'joinDate', label: 'Join Date' },
        { key: 'status', label: 'Status' },
        { key: 'longText', label: 'Long Text', expandable: true },
    ]);

    const handleDelete = (id) => {

        setInfo(prevInfo => prevInfo.filter(item => item.id !== id));
        setDeleteModal({ open: false, id: null });
    };


    const handleImageChange = (event, itemId, columnKey, maxImages) => {
        const files = Array.from(event.target.files);

        // Check if adding new files exceeds the limit for this specific column
        const currentImageCount = editForm[columnKey] ? editForm[columnKey].length : 0;
        if (currentImageCount + files.length > maxImages) {
            setImageUploadError(`You can upload a maximum of ${maxImages} images for ${columnKey}.`); // Specific error
            return;
        } else {
            setImageUploadError(''); // Clear any previous general error
        }

        // Update the edit form, appending new files to the correct image array
        setEditForm(prevForm => ({
            ...prevForm,
            [columnKey]: prevForm[columnKey] ? [...prevForm[columnKey], ...files] : files,
        }));
    };

    const handleClearImages = (columnKey) => {
        setEditForm(prevForm => ({
            ...prevForm,
            [columnKey]: [], // Clear only the images for the specified column
        }));
        setImageUploadError(''); // Clear any general error messages
    };


    const handleEdit = () => {
        const updatedEditForm = { ...editForm };

        const imagePromises = [];

        // Iterate through all columns to handle multiple image fields
        columns.forEach(column => {
            if (column.type === 'image' && updatedEditForm[column.key] && Array.isArray(updatedEditForm[column.key])) {
                const columnImagePromises = updatedEditForm[column.key].map(file => {
                    return new Promise((resolve, reject) => {
                        if (file instanceof File) {
                            const reader = new FileReader();
                            reader.onload = (e) => resolve(e.target.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        } else {
                            resolve(file);
                        }
                    });
                });
                imagePromises.push(...columnImagePromises);
                // Replace the file array with a placeholder, so we don't process it again
                updatedEditForm[column.key] = columnImagePromises;
            }
        });

        Promise.all(imagePromises)
            .then(base64Images => {
                // Reconstruct the form data with resolved Base64 strings
                let base64Index = 0;
                const finalEditForm = { ...updatedEditForm };
                columns.forEach(column => {
                    if (column.type === 'image' && finalEditForm[column.key]) {
                        const numImages = finalEditForm[column.key].length;
                        finalEditForm[column.key] = base64Images.slice(base64Index, base64Index + numImages);
                        base64Index += numImages;
                    }
                });


                setInfo(prevInfo =>
                    prevInfo.map(item => (item.id === finalEditForm.id ? { ...item, ...finalEditForm } : item))
                );
                setEditModalState({ open: false, item: null });
                setEditForm({});
                setImageUploadError('');
            })
            .catch(error => {
                console.error("Error reading image files:", error);
                setImageUploadError('Failed to process images.');
            });
    };




    const handleEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const getSortDirectionIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <IconChevronUp className="inline w-4 h-4" /> : <IconChevronDown className="inline w-4 h-4" />;
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleImageClick = (images) => {
        if (images && images.length > 0) {
            const imageContent = images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="mb-2 max-w-full h-auto"
                    style={{ maxWidth: MAX_IMAGE_WIDTH, maxHeight: MAX_IMAGE_HEIGHT }}
                />
            ));

            setCellPopup({
                open: true,
                content: <div className="flex flex-col items-center">{imageContent}</div>,
                title: 'Images',
            });
        }
    };


    const handleRemoveImage = (columnKey, indexToRemove) => {
        setEditForm(prevForm => ({
            ...prevForm,
            [columnKey]: prevForm[columnKey].filter((_, index) => index !== indexToRemove),
        }));
    };


    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="mt-4 flex justify-center space-x-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md transition-colors duration-150 ${currentPage === page
                            ? 'bg-primary-light text-white border-primary-light hover:bg-primary-dark hover:border-primary-dark'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };


    if (!info || info.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <IconTableOff size={60} className="text-gray-400 mb-4" />
                <p className="text-gray-500 text-xl">No data found</p>
            </div>
        );
    }


    if (isMobile) {
        return (
            <div className="w-full px-4">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div className="space-y-4 mt-4">
                    {paginatedinfo.map((item) => (
                        <div key={item.id} className="bg-white shadow rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditForm({ ...item });
                                            setEditModalState({ open: true, item });
                                        }}
                                        className="p-1 rounded hover:bg-gray-100 text-primary-600 transition-colors duration-150"
                                    >
                                        <IconEdit size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, id: item.id })}
                                        className="p-1 rounded hover:bg-gray-100 text-red-600 transition-colors duration-150"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                {columns.map((column) => {
                                    if (column.type === 'image') {
                                        return (
                                            <div key={column.key} className="flex items-center">
                                                <label className="block text-sm font-medium text-gray-700 w-32">{column.label}:</label>
                                                <div className="flex flex-wrap pl-4">
                                                    {item[column.key] && item[column.key].length > 0 ? (
                                                        item[column.key].map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Image ${index + 1}`}
                                                                className="w-10 h-10 rounded-full mr-2 mb-2 object-cover" // Added object-cover
                                                            />
                                                        ))
                                                    ) : (
                                                        <IconUserCircle size={40} className="text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={column.key} className="flex items-center">
                                            <label className="block text-sm font-medium text-gray-700 w-32 relative">
                                                {column.label}:
                                                {column.expandable && (
                                                    <span
                                                        className="cursor-pointer absolute inset-y-0 left-24 flex items-center pl-1"
                                                        onClick={() => setCellPopup({ open: true, content: item[column.key], title: column.label })}
                                                    >
                                                        <IconEye size={16} className="text-primary-600" />
                                                    </span>
                                                )}

                                            </label>
                                            {column.expandable ? (
                                                <>
                                                    <span
                                                        className="cursor-pointer hover:underline truncate pl-6 text-primary-800 font-bold"
                                                        style={{ maxWidth: column.width || '200px' }} //Added inline styling
                                                        title={item[column.key]}
                                                        onClick={() => setCellPopup({ open: true, content: item[column.key], title: column.label })}
                                                    >
                                                        {truncateText(item[column.key], 20)}
                                                    </span>


                                                </>
                                            ) : (
                                                <span className="truncate pl-6" style={{ maxWidth: column.width || '200px' }}>
                                                    {item[column.key]}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {renderPagination()}
                {/* Cell Popup Modal for mobile */}
                <Modal
                    isOpen={cellPopup.open}
                    onClose={() => setCellPopup({ open: false, content: '', title: '' })}
                    title={cellPopup.title}
                >
                    <div className="flex flex-col items-center">{cellPopup.content}</div>
                </Modal>

                <Modal
                    isOpen={deleteModal.open}
                    onClose={() => setDeleteModal({ open: false, id: null })}
                    title="Confirm Delete"
                    buttons={[
                        { label: "Cancel", onClick: () => setDeleteModal({ open: false, id: null }) },
                        { label: "Delete", onClick: () => handleDelete(deleteModal.id), className: "bg-red-600 text-white hover:bg-red-700" }
                    ]}
                >
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
                </Modal>

                <Modal
                    isOpen={editModalState.open}
                    onClose={() => setEditModalState({ open: false, item: null })}
                    title="Edit Item"
                >

                    <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
                        {imageUploadError && (
                            <div className="text-red-500 text-sm mb-2">
                                {imageUploadError}
                            </div>
                        )}
                        {columns.map((column) => {
                            if (column.type === "image") {
                                // Initialize ref if it doesn't exist
                                if (!fileInputRefs.current[column.key]) {
                                    fileInputRefs.current[column.key] = React.createRef();
                                }
                                return (
                                    <div key={column.key} className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {column.label}
                                        </label>
                                        {/* File Input */}
                                        <div className="flex items-center">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => handleImageChange(e, editForm.id, column.key, column.maxImages)}
                                                className="hidden"
                                                ref={fileInputRefs.current[column.key]} // Use dynamic ref
                                                accept="image/*"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRefs.current[column.key].current && fileInputRefs.current[column.key].current.click()}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-150 flex items-center"
                                            >
                                                <IconUpload size={16} className="mr-2" />
                                                Upload Images
                                            </button>
                                            {editForm[column.key] && editForm[column.key].length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleClearImages(column.key)}
                                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-150 flex items-center"
                                                    title={`Clear ${column.label}`}
                                                >
                                                    <IconX size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Display uploaded images (previews) */}
                                        <div className="flex flex-wrap mt-2">
                                            {editForm[column.key] && editForm[column.key].length > 0 && editForm[column.key].map((fileOrUrl, index) => {
                                                const src = fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
                                                return (
                                                    <div
                                                        key={`${column.key}-${index}`}
                                                        className="relative w-16 h-16 rounded-md mr-2 mb-2"
                                                        onMouseEnter={() => setHoveredImageIndex(prev => ({ ...prev, [column.key + index]: true }))}
                                                        onMouseLeave={() => setHoveredImageIndex(prev => ({ ...prev, [column.key + index]: false }))}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`Preview ${index}`}
                                                            className={`w-full h-full object-cover rounded-md ${hoveredImageIndex[column.key + index] ? 'opacity-50' : ''}`}
                                                        />
                                                        {hoveredImageIndex[column.key + index] && (
                                                            <button
                                                                onClick={() => handleRemoveImage(column.key, index)}
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                                                title={`Remove ${column.label}`}
                                                            >
                                                                <IconX size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                );
                            }
                            return (
                                <div key={column.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{column.label}</label>
                                    <input
                                        type="text"
                                        name={column.key}
                                        value={editForm[column.key] || ''}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    />
                                </div>
                            );
                        })}
                    </form>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setEditModalState({ open: false, item: null })}
                            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => { e.preventDefault(); handleEdit(); }}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
                        >
                            <IconCheck size={16} className="mr-1" /> Save Changes
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <div className="mb-4 flex items-center max-w-full justify-between">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors duration-150 flex items-center"
                >
                    {showFilters ? <IconFilterOff size={20} className="mr-2" /> : <IconFilter size={20} className="mr-2" />}
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-primary-light to-primary-dark text-white">
                        <tr>
                            <th className="w-20 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            </th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span className="truncate text-lg py-2 text-slate-400 select-none">{column.label}</span>
                                        {getSortDirectionIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        <AnimatePresence>
                            {showFilters && (
                                <motion.tr
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <th className="px-6 py-2"></th>
                                    {columns.map((column) => (
                                        <th key={column.key} className="px-6 py-2">
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
                                                    className="text-primary-400 w-full px-2 py-1 border border-gray-300/5 rounded-sm text-sm font-medium focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-6"
                                                />
                                            )}
                                        </th>
                                    ))}
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedinfo.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                // Prefill editForm with the current item, including images
                                                setEditForm({ ...item });
                                                setEditModalState({ open: true, item });
                                            }}
                                            className="p-1 rounded hover:bg-gray-100 text-primary-600 transition-colors duration-150"
                                            title="Edit"
                                        >
                                            <IconEdit size={16} />
                                        </button>

                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: item.id })}
                                            className="p-1 rounded hover:bg-gray-100 text-red-600 transition-colors duration-150"
                                            title="Delete"
                                        >
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                </td>
                                {columns.map((column) => {
                                    if (column.type === 'image') {
                                        return (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap">
                                                    {item[column.key] && item[column.key].length > 0 ? (
                                                        <>
                                                            {item[column.key].slice(0, 3).map((image, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={image}
                                                                    alt={`Image ${index + 1}`}
                                                                    className="w-10 h-10 rounded-full mr-2 mb-2 object-cover"
                                                                />
                                                            ))}
                                                            {item[column.key].length > 3 && (
                                                                <button
                                                                    onClick={() => handleImageClick(item[column.key])}
                                                                    className="text-primary-600 hover:underline focus:outline-none"
                                                                >
                                                                    +{item[column.key].length - 3} more
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <IconUserCircle size={40} className="text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    }
                                    return (
                                        <td
                                            key={column.key}
                                            className={`px-6 py-4 text-center whitespace-nowrap text-sm ${column.key === 'status'
                                                ? item.status === 'Active'
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                                : 'text-gray-800'
                                                }`}
                                        >
                                            {column.expandable ? (
                                                <div className="flex items-center group relative">  {/* Added group for hover state */}
                                                    <span
                                                        className="cursor-pointer truncate group-hover:underline"
                                                        style={{ maxWidth: column.width || '200px' }}
                                                        title={item[column.key]}
                                                        onClick={() => setCellPopup({ open: true, content: item[column.key], title: column.label })}
                                                    >
                                                        {truncateText(item[column.key], 20)}
                                                    </span>
                                                    <button
                                                        onClick={() => setCellPopup({ open: true, content: item[column.key], title: column.label })}
                                                        className="ml-1 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" // Show on group hover
                                                        title={`View ${column.label}`}
                                                    >
                                                        <IconEye size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="truncate" style={{ maxWidth: column.width || '200px' }}>
                                                    {item[column.key]}
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {renderPagination()}

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                title="Confirm Delete"
                buttons={[
                    { label: "Cancel", onClick: () => setDeleteModal({ open: false, id: null }) },
                    { label: "Delete", onClick: () => handleDelete(deleteModal.id), className: "bg-red-600 text-white hover:bg-red-700" }
                ]}
            >
                <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            </Modal>

            <Modal
                isOpen={editModalState.open}
                onClose={() => setEditModalState({ open: false, item: null })}
                title="Edit Item"
            >

                <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
                    {imageUploadError && (
                        <div className="text-red-500 text-sm mb-2">
                            {imageUploadError}
                        </div>
                    )}
                    {columns.map((column) => {
                        if (column.type === "image") {
                            // Initialize ref if it doesn't exist
                            if (!fileInputRefs.current[column.key]) {
                                fileInputRefs.current[column.key] = React.createRef();
                            }
                            return (
                                <div key={column.key} className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {column.label}
                                    </label>
                                    {/* File Input */}
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleImageChange(e, editForm.id, column.key, column.maxImages)}
                                            className="hidden"
                                            ref={fileInputRefs.current[column.key]} // Use dynamic ref
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRefs.current[column.key].current && fileInputRefs.current[column.key].current.click()}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-150 flex items-center"
                                        >
                                            <IconUpload size={16} className="mr-2" />
                                            Upload Images
                                        </button>
                                        {editForm[column.key] && editForm[column.key].length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleClearImages(column.key)}
                                                className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-150 flex items-center"
                                                title={`Clear ${column.label}`}
                                                >
                                                    <IconX size={16} />
                                                </button>
                                            )}
                                        </div>
    
                                        {/* Display uploaded images (previews) */}
                                        <div className="flex flex-wrap mt-2">
                                            {editForm[column.key] && editForm[column.key].length > 0 && editForm[column.key].map((fileOrUrl, index) => {
                                                const src = fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
                                                return (
                                                    <div
                                                        key={`${column.key}-${index}`}  // Use a unique key
                                                        className="relative w-16 h-16 rounded-md mr-2 mb-2"
                                                        onMouseEnter={() => setHoveredImageIndex(prev => ({ ...prev, [column.key + index]: true }))}
                                                        onMouseLeave={() => setHoveredImageIndex(prev => ({ ...prev, [column.key + index]: false }))}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`Preview ${index}`}
                                                            className={`w-full h-full object-cover rounded-md ${hoveredImageIndex[column.key + index] ? 'opacity-50' : ''}`}
                                                        />
                                                        {hoveredImageIndex[column.key + index] && (
                                                            <button
                                                                onClick={() => handleRemoveImage(column.key, index)}
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                                                title={`Remove ${column.label}`}
                                                            >
                                                                <IconX size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={column.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{column.label}</label>
                                    <input
                                        type="text"
                                        name={column.key}
                                        value={editForm[column.key] || ''}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    />
                                </div>
                            );
                        })}
                    </form>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setEditModalState({ open: false, item: null })}
                            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => { e.preventDefault(); handleEdit(); }}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
                        >
                            <IconCheck size={16} className="mr-1" /> Save Changes
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={cellPopup.open}
                    onClose={() => setCellPopup({ open: false, content: '', title: '' })}
                    title={cellPopup.title}
                >
                    <div className="flex flex-col items-center">{cellPopup.content}</div>
                </Modal>
            </div>
        );
    };
    
    export default SortableTable;