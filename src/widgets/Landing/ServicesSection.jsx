"use client";

import React from 'react';
import { motion } from "framer-motion";
import { IconBook, IconUsers, IconCalendarEvent, IconTrophy, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link'; // Import Link component

export default function ServicesSection() {
    const services = [
        {
            title: "Training & Workshops",
            icon: IconBook,
            link: "/events" // Link to events page
        },
        {
            title: "Networking Events",
            icon: IconUsers,
            link: "/events" // Link to events page
        },
        {
            title: "Club Activities",
            icon: IconCalendarEvent,
            link: "/events" // Link to events page
        },
        {
            title: "Competitions",
            icon: IconTrophy,
            link: "/events" // Link to events page
        }
    ];

    return (
        <div className="w-full h-screen flex flex-col justify-center bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    <svg xmlns="http://www.w3.org/2000/svg" width="100.27" height="98.45" viewBox="0 0 100.27 98.45" className='absolute -left-32 top-0'>
                        <defs>
                            <linearGradient id="linear-gradient" x1="-0.284" y1="-0.633" x2="1.896" y2="2.49" gradientUnits="objectBoundingBox">
                                <stop offset="0" stopColor="#1b2755"></stop>
                                <stop offset="1" stopColor="#0a1029"></stop>
                            </linearGradient>
                            <filter id="Path_767" x="0" y="0" width="100.27" height="98.45" filterUnits="userSpaceOnUse">
                                <feOffset dx="1" dy="1" input="SourceAlpha"></feOffset>
                                <feGaussianBlur stdDeviation="0.5" result="blur"></feGaussianBlur>
                                <feFlood flood-opacity="0.149"></feFlood>
                                <feComposite operator="in" in2="blur"></feComposite>
                                <feComposite in="SourceGraphic"></feComposite>
                            </filter>
                        </defs>
                        <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_767)">
                            <path id="Path_767-2" d="M251.206,96.089a44.7,44.7,0,0,1,7.8-1.324c21.3-1.642,43.618,14.256,48.006,35.268,5.265,25.217-12.216,53.169-37.32,58.967s-53.347-12.1-58.321-37.384C206.565,127.191,227.572,102.259,251.206,96.089Z" transform="translate(-210.18 -94.15)" fill="url(#linear-gradient)"></path>
                        </g>
                    </svg>

                    {/* Left side - Text Content */}
                    <div className="max-w-xl">
                        <h2 className="text-7xl font-bold text-gray-900 mb-4">
                            Why EBEC?
                        </h2>
                        <div className="h-1 w-12 bg-yellow-500 mb-4"></div>
                        <p className="text-lg text-gray-600">
                            <b>EBEC</b> offers various services to help students develop their entrepreneurial and business skills. Through our programs, you'll gain practical experience and valuable connections in the business world.
                        </p>
                    </div>

                    {/* Right side - Services Grid */}
                    <div className="grid grid-cols-2 gap-4">

                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#ffc00e",
                                    }}
                                    className="p-8 bg-slate-50 rounded-lg cursor-pointer flex flex-col items-center justify-center border-2 border-transparent group" // Added "group" class here
                                >
                                    <Link href={service.link} passHref className="flex flex-col items-center justify-center">
                                        <div className="relative flex flex-col items-center justify-center">
                                            {/* ICON should turn black */}
                                            <Icon className="w-16 h-16 text-secondary-500 mb-4 group-hover:text-black transition-colors duration-75" strokeWidth={1.5} />
                                            <h3 className="text-xl font-semibold text-gray-900 text-center group-hover:text-white transition-colors duration-75">
                                                {service.title}
                                            </h3>
                                            <motion.div
                                                className="absolute bottom-0 right-0 opacity-0"
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    x: [-5, 5, 10]
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                            </motion.div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};