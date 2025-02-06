"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IconX, IconCheck, IconArrowBadgeDownFilled } from "@tabler/icons-react";

const image1 = "/Assets/FakePFP/4.jpg";

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
const arrowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.1, ease: "easeOut" } },
};

export default function DepartmentSwitch({ id, name, role, department, newDepartment }) {
    return (
        <motion.div
            className="relative m-8relative w-96 rounded-xl shadow-xl p-6 m-8 hover:shadow-2xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ background: `linear-gradient(135deg, #dbeffe 0%, #e0e8f5 100%)` }}
        >
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
                className="absolute bottom-0 right-0  h-2/4 w-2/4 pointer-events-none opacity-20 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                <path fill="currentColor" d="M14 84Q29 69 49 70Q69 71 87 54Q105 37 93 17Q81 -3 61 3Q41 9 25 30Q9 51 25 68Q41 85 14 84Z" />
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

            <div className="top-4 absolute flex items-center gap-0">
                <Image
                    src={image1}
                    width={100}
                    height={100}
                    alt="Profile Picture"
                    className="w-24 h-24 z-40 rounded-full border-4 border-secondary-600 object-cover"
                />
                <div className="p-4">
                    <h1 className="truncate text-xl font-extrabold text-gray-700">{name}</h1>
                    <h2 className="truncate text-lg font-bold text-gray-600">{`${department} - ${role}`}</h2>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-8 mb-2">
                <motion.h2
                    className="select-none text-nowrap truncate z-40 m-0 w-40 text-lg text-center bg-gradient-to-br from-primary-300 to-primary-500 p-4 rounded-3xl text-white font-bold"
                    variants={departmentLabelVariants}
                >{department}</motion.h2>
                <motion.div
                    variants={arrowVariants}
                >
                    <IconArrowBadgeDownFilled className="h-10 w-10 text-gray-500" />
                </motion.div>
                <motion.h2
                    className="select-none text-nowrap truncate z-40 m-0 w-40 text-lg text-center bg-gradient-to-br from-secondary-400 to-secondary-500 p-4 rounded-3xl text-white font-bold"
                    variants={departmentLabelVariants}
                >{newDepartment}</motion.h2>
            </div>
        </motion.div>
    );
}