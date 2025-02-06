"use client";

import React, { useState } from 'react';
import { IconEdit, IconTrash, IconCalendar, IconMapPin } from '@tabler/icons-react';

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
        console.log("Saving data:", data); // Placeholder for backend save
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
        <div className="bg-[#03113e] rounded-xl overflow-hidden shadow-lg flex flex-col w-full my-16 mx-8 relative h-[30rem] transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20 min-w-[25rem]">

            {isEditing ? (
                <div className="flex flex-col justify-end h-full">
                    <div className="p-6 Settings"> {/* Reduced padding for consistency */}
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="name">Event Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleInputChange}
                            placeholder="Event Name"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light "
                        />
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="description">Event Description:</label>
                        <textarea
                            name="description"
                            id="description"
                            value={data.description}
                            onChange={handleInputChange}
                            placeholder="Event Description"
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
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="image">Image URL:</label>
                        <input
                            type="text"
                            name="image"
                            id="image"
                            value={data.image}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                            className="w-full p-2 mb-2 bg-gray-700 text-white placeholder-gray-400 rounded border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-secondary-light"
                        />
                    </div>
                    <div className="relative flex justify-between items-center mt-auto">
                        <button onClick={handleSaveClick} className="bg-primary-600 hover:bg-primary-800 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-1/2">Save</button>
                        <button onClick={handleCancelClick} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-1/2">Cancel</button>
                    </div>
                </div>

            ) : (
                <div className="flex flex-col h-full">
                    <img className="w-full h-52 object-cover" src={data.image} alt={data.name} />
                    <div className="p-6">
                        <div className="font-bold text-3xl mb-2 text-secondary-dark font-poppins">{data.name}</div>
                        <p className="text-white text-base mb-4">{data.description}</p>
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
                        <button onClick={handleEditClick} className="bg-secondary-light hover:bg-secondary-dark text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline w-1/2">
                            <IconEdit size={16} className="mr-1 inline-block" />Edit
                        </button>
                        <button onClick={handleDeleteClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline w-1/2">
                            <IconTrash size={16} className="mr-1 inline-block" />Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEventCard;