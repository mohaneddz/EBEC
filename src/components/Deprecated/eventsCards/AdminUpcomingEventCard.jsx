"use client";

import React, { useState } from 'react';
import { IconEdit, IconTrash, IconCalendar, IconMapPin } from '@tabler/icons-react';
import Image from 'next/image';

const UpcomingEventCard = ({ initialData }) => {
    const [data, setData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);

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
        // console.log("Saving data:", data); // Placeholder for backend save
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setData(initialData);
    };

    const handleDeleteClick = () => {
        setData({
            name: "Not Set",
            date: "x",
            location: "x",
            description: "",
            image: null,
        });
    };

    return (
        <div className="bg-[#03113e] rounded-xl overflow-hidden shadow-lg flex flex-col w-min relative h-[30rem] transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20 min-w-[25rem]">

            {isEditing ? (
                <div className="flex flex-col justify-end h-full">
                    <div className="p-6 Settings"> {/* Reduced padding for consistency */}
                        <label className="block mb-2 text-sm font-bold text-white" htmlFor="name">Event Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleInputChange}
                            placeholder="Event Name"
                            className="w-full p-2 mb-2 text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light "
                        />
                        <label className="block mb-2 text-sm font-bold text-white" htmlFor="description">Event Description:</label>
                        <textarea
                            name="description"
                            id="description"
                            value={data.description}
                            onChange={handleInputChange}
                            placeholder="Event Description"
                            className="w-full p-2 mb-2 text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />
                        <label className="block mb-2 text-sm font-bold text-white" htmlFor="date">Date:</label>
                        <input
                            type="text"
                            name="date"
                            id="date"
                            value={data.date}
                            onChange={handleInputChange}
                            placeholder="Date"
                            className="w-full p-2 mb-2 text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />
                        <label className="block mb-2 text-sm font-bold text-white" htmlFor="location">Location:</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={data.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className="w-full p-2 mb-2 text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />
                        <label className="block mb-2 text-sm font-bold text-white" htmlFor="image">Image URL:</label>
                        <input
                            type="text"
                            name="image"
                            id="image"
                            value={data.image}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                            className="w-full p-2 mb-2 text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />
                    </div>
                    <div className="relative flex items-center justify-between mt-auto">
                        <button onClick={handleSaveClick} className="w-1/2 px-4 py-2 font-bold text-white bg-primary-600 hover:bg-primary-800 focus:outline-none focus:shadow-outline">Save</button>
                        <button onClick={handleCancelClick} className="w-1/2 px-4 py-2 font-bold text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:shadow-outline">Cancel</button>
                    </div>
                </div>

            ) : (
                <div className="flex flex-col h-full">
                    <Image
                        height={500}
                        width={500}
                        className="object-cover w-full h-52" src={data.image} alt={data.name} />
                    <div className="p-6">
                        <div className="mb-2 text-3xl font-bold text-secondary-dark font-poppins">{data.name}</div>
                        <p className="mb-4 text-base text-white">{data.description}</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-[#f89605] font-semibold text-sm mb-2">
                            <IconCalendar size={16} className="inline-block mr-1" />
                            <span className="font-normal text-white">Date:</span> {data.date}
                        </p>
                        <p className="text-[#f89605] font-semibold text-sm">
                            <IconMapPin size={16} className="inline-block mr-1" />
                            <span className="font-normal text-white">Location:</span> {data.location}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                        <button onClick={handleEditClick} className="w-1/2 px-4 py-2 font-bold text-white bg-secondary-light hover:bg-secondary-dark focus:outline-none focus:shadow-outline">
                            <IconEdit size={16} className="inline-block mr-1" />Edit
                        </button>
                        <button onClick={handleDeleteClick} className="w-1/2 px-4 py-2 font-bold text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:shadow-outline">
                            <IconTrash size={16} className="inline-block mr-1" />Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEventCard;