"use client";

import React, { useState, useCallback, useRef } from 'react';
import { IconEdit, IconTrash, IconCalendar, IconMapPin, IconPhoto, IconUpload } from '@tabler/icons-react';
import Image from 'next/image';

// Function to generate a unique ID (alternative to UUID)
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const AdminEventCard = ({ initialData, onDelete }) => {
    const [data, setData] = useState(initialData || {
        name: "",
        subtitle: "",
        shortDescription: "",
        longDescription: "",
        date: "",
        location: "",
        images: [],  // Array of image objects { id: string, url: string, isMain: boolean }
    });
    const [isEditing, setIsEditing] = useState(false);
    const initialDataRef = useRef(initialData || {   // useRef to store the initial data

        name: "",
        subtitle: "",
        shortDescription: "",
        longDescription: "",
        date: "",
        location: "",
        images: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        console.log("Saving data:", data); // Placeholder for backend save - remember to send this to your API
        //Here's where you save the data to the initialDataRef
        initialDataRef.current = data;
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setData(initialDataRef.current);
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            onDelete(data.id); // Call the onDelete callback passed from the parent
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array

        if (!files || files.length === 0) return;

        // Function to upload and process each image
        const processImage = async (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    // Here you would normally upload to a server and get a URL
                    // For now, simulate a URL from the local file
                    const imageUrl = event.target.result;

                    const newImage = {
                        id: generateId(),  // Use the new ID generator
                        url: imageUrl,  // Set a local URL
                        isMain: data.images.length === 0, // First image becomes main
                    };
                    resolve(newImage);
                };

                reader.onerror = (error) => {
                    reject(error);
                };

                reader.readAsDataURL(file); // Read the file as a data URL
            });
        };

        try {
            const newImages = await Promise.all(files.map(processImage));

            setData(prevData => ({
                ...prevData,
                images: [...prevData.images, ...newImages],
            }));
        } catch (error) {
            console.error("Image upload error:", error);
        }
    };

    const handleSetMainImage = (imageId) => {
        setData(prevData => ({
            ...prevData,
            images: prevData.images.map(img => ({ ...img, isMain: img.id === imageId })), // Create a new array of objects
        }));
    };

    const handleDeleteImage = (imageId) => {
        setData(prevData => {
            let newImages = prevData.images.filter(img => img.id !== imageId);
            if (prevData.images.find(img => img.id === imageId && img.isMain) && newImages.length > 0) {
                newImages[0] = { ...newImages[0], isMain: true };
            }
            return { ...prevData, images: newImages };
        });
    };

    const getMainImage = useCallback(() => {
        const mainImage = data.images.find(img => img.isMain);
        return mainImage ? mainImage.url : null;
    }, [data.images]);

    const cardHeight = "h-[35rem]";

    return (
        <div className={`bg-[#03113e] w-min rounded-xl overflow-hidden shadow-lg flex flex-col relative transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20 min-w-[25rem] ${cardHeight}`}>

            {isEditing ? (
                <div className={`flex flex-col justify-start h-full ${cardHeight}`}>
                    <div className="p-6 Settings overflow-y-auto">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="name">Event Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleInputChange}
                            placeholder="Event Name"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="subtitle">Subtitle:</label>
                        <input
                            type="text"
                            name="subtitle"
                            id="subtitle"
                            value={data.subtitle}
                            onChange={handleInputChange}
                            placeholder="Subtitle"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="shortDescription">Short Description:</label>
                        <textarea
                            name="shortDescription"
                            id="shortDescription"
                            value={data.shortDescription}
                            onChange={handleInputChange}
                            placeholder="Short Description"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="longDescription">Long Description:</label>
                        <textarea
                            name="longDescription"
                            id="longDescription"
                            value={data.longDescription}
                            onChange={handleInputChange}
                            placeholder="Long Description"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="date">Date:</label>
                        <input
                            type="text"
                            name="date"
                            id="date"
                            value={data.date}
                            onChange={handleInputChange}
                            placeholder="Date"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="location">Location:</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={data.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />

                        <label className="block text-white text-sm font-bold mb-2" htmlFor="imageUpload">
                            Upload Images:
                            <IconUpload size={16} className="inline-block ml-1" />
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden" // Hide the default input
                        />
                        <label
                            htmlFor="imageUpload"
                            className="inline-flex mb-8 items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-500 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 cursor-pointer"
                        >
                            Browse Files
                        </label>

                        <div className="flex flex-wrap">
                            {data.images.map(img => (
                                <div key={img.id} className="w-32 h-32 relative m-2 overflow-hidden rounded-lg">
                                    <Image
                                        src={img.url}
                                        alt="Event Image"
                                        width={128}  // Explicit width and height for next/image
                                        height={128}
                                        className="object-cover w-full h-full rounded"
                                    />
                                    {img.isMain ? (
                                        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tl rounded-br">Main</div>
                                    ) : (
                                        <button
                                            onClick={() => handleSetMainImage(img.id)}
                                            className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-bl rounded-tr hover:bg-blue-700"
                                        >
                                            Set Main
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteImage(img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-tr rounded-bl hover:bg-red-700"
                                    >
                                        <IconTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 bg-[#03113e] sticky bottom-0">
                        <button onClick={handleSaveClick} className="bg-primary-600 hover:bg-primary-800 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-1/2">Save</button>
                        <button onClick={handleCancelClick} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-1/2">Cancel</button>
                    </div>
                </div>

            ) : (
                <div className={`relative flex flex-col h-full ${cardHeight}`}>
                    {getMainImage() && (
                        <Image
                            src={getMainImage()}
                            alt={data.name}
                            width={500}
                            height={300}
                            className="w-full h-52 object-cover overflow-hidden"
                        />
                    )}
                    <div className="p-6">
                        <div className="font-bold text-3xl mb-2 text-secondary-dark font-poppins">{data.name}</div>
                        <div className="text-xl italic mb-2 text-gray-300">{data.subtitle}</div>
                        <p className="text-white text-base mb-4">{data.shortDescription}</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-[#f89605] font-semibold text-sm mb-2">
                            <IconCalendar size={16} className="mr-1 inline-block" />
                            <span className="text-white font-normal">Date:</span> {data.date}
                        </p>
                        <p className="text-[#f89605] font-semibold text-sm">
                            <IconMapPin size={16} className="mr-1 inline-block" />
                            <span className="text-white font-normal">Location:</span> {data.location}
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                        <button onClick={handleDeleteClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline w-1/2">
                            <IconTrash size={16} className="mr-1 inline-block" />Delete
                        </button>
                        <button onClick={handleEditClick} className="bg-secondary-light hover:bg-secondary-dark text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline w-1/2">
                            <IconEdit size={16} className="mr-1 inline-block" />Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEventCard;