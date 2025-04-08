"use client";

import { useState } from 'react';
import { motion } from "motion/react";
import { IconPencil, IconCheck, IconX } from "@tabler/icons-react";

const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, delay: 0.15, ease: "easeOut" } },
};

const departmentLabelVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
};

export default function NewMemberRequestCard({ id, name, email, motivation, selectedDepartment, availableDepartments }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [department, setDepartment] = useState(selectedDepartment);
    const [originalDepartment] = useState(selectedDepartment);

    const handleDepartmentChange = (newDepartment) => {
        setDepartment(newDepartment);
        setIsDropdownOpen(false);
    };

    const departmentTextColor = department === originalDepartment ? "text-white" : "text-primary-800";

    return (
        <motion.div
            className="relative w-96 rounded-xl shadow-xl p-6 m-8 hover:shadow-2xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ background: `linear-gradient(135deg, #fffdf0 0%, #ffe4a1 100%)` }}
        >
            <svg
                className="absolute top-0 left-0 h-full w-full pointer-events-none fill-gray-100 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
            >
                <defs>
                    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="1000" height="1000" fill="url(#dots)" />
            </svg>

            <svg
                className="absolute top-1/4 left-1/4 h-1/4 w-1/4 pointer-events-none opacity-30"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
            >
                <path d="M50 10 L 90 90 L 10 90 Z" fill="rgba(255, 193, 7, 0.4)" />
            </svg>
            
            <motion.div
                className="relative -top-12 -right-8 flex items-center justify-end space-x-2"
                variants={iconVariants}
            >
                <motion.div
                    className="z-40 bg-gradient-to-br from-red-300 to-red-500 h-16 w-16 p-4 text-white rounded-full shadow-lg cursor-pointer hover:bg-gradient-to-br hover:from-red-500 hover:to-red-800 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IconX className="h-8 w-8" />
                </motion.div>
                <motion.div
                    className="z-40 bg-gradient-to-br from-green-300 to-green-500 h-16 w-16 p-4 text-white rounded-full shadow-lg cursor-pointer hover:bg-gradient-to-br hover:from-green-500 hover:to-green-800 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IconCheck className="h-8 w-8" />
                </motion.div>
            </motion.div>
            <div className="px-4 mt-4">
                <h1 className="truncate text-xl font-extrabold text-gray-700">{name}</h1>
                <h2 className="truncate text-lg font-bold text-gray-600">{email}</h2>
            </div>
            <div className="px-4 mt-4 h-24 overflow-hidden">
                <p
                    className="text-gray-700 text-base bg-zinc-300/70 p-4 rounded-xl"
                    style={{ backdropFilter: 'blur(5px)' }}
                >{motivation}</p>
            </div>
            <div className="flex items-center justify-between p-4 mt-4">
                <motion.h2
                    className={`relative truncate select-none z-40 text-nowrap m-0 text-lg text-center bg-gradient-to-br from-emerald-400 to-emerald-500 p-4 rounded-3xl font-bold ${departmentTextColor}`}
                    variants={departmentLabelVariants}
                >
                    {department}
                </motion.h2>
                <motion.div
                    className="cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IconPencil className="h-8 w-8 text-gray-500" />
                </motion.div>
                {isDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-48 bg-white border rounded shadow-lg">
                        {availableDepartments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => handleDepartmentChange(dept)}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}