"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IconX, IconCheck } from "@tabler/icons-react";

const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, delay: 0.15, ease: "easeOut" } },
};

export default function FormRegistrationCard({
    id,
    name,
    role,
    eventName,
    acceptedCount,
    userPfp,
}) {
    return (
        <motion.div
            className="relative w-96 rounded-xl shadow-xl p-6 m-8 hover:shadow-2xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ background: `linear-gradient(135deg, #dbeffe 0%, #e0e8f5 100%)` }}
        >
            {/* Top Left Lines */}
            <svg
                className="absolute top-0 left-0 h-1/4 w-1/4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
            >
                <path d="M10 20 C 30 30, 40 10, 60 40" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 30 C 25 40, 35 20, 55 50" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
                <path d="M0 40 C 20 50, 30 30, 50 60" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />

            </svg>

            <svg
                className="absolute top-0 left-0  h-full w-full pointer-events-none fill-gray-100 opacity-50"
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


            {/* Bottom Right Lines */}
            <svg
                className="absolute bottom-0 right-0 h-1/4 w-1/4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
            >
                <path d="M30 60 C 50 70, 60 50, 80 80" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
                <path d="M40 50 C 60 60, 70 40, 90 70" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 40 C 70 50, 80 30, 100 60" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
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

            <div className="top-4 absolute flex items-center gap-4">
                <Image
                    src={userPfp}
                    width={100}
                    height={100}
                    alt="User Profile Picture"
                    className="w-20 h-20 z-40 rounded-full border-4 border-secondary-600 object-cover"
                />
                <div className="p-4">
                    <h1 className="truncate text-xl font-extrabold text-gray-700">{name}</h1>
                    <h2 className="truncate text-lg font-bold text-gray-600">{role}</h2>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 mt-6">
                <motion.h2 className="z-10 truncate text-xl font-bold text-slate-100 bg-gradient-to-br from-primary-300 to-primary-600 p-4 rounded-xl">
                    {eventName}
                </motion.h2>
                <div className="z-20 relative -top-6 right-4 inline-flex items-center justify-center w-8 h-8 text-xs font-semibold bg-gradient-to-br from-secondary-300 to-secondary-400 rounded-full text-gray-500">
                    {acceptedCount}
                </div>
            </div>
        </motion.div>
    );
}