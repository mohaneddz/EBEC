"use client";

import React, { useRef } from "react";
import { GlareCardDemo } from '@/components/Events/Glare-card'
import { motion } from "motion/react";

const image1 = '/Assets/Hero/1.jpg';

const Events = [
    {
        id: 1,
        title: "Coming Soon!",
        description: "",
        src: ""
    },
    {
        id: 2,
        title: "IGNITE",
        description: "The Biggest Internship Fair in the Year!",
        src: image1
    },
    {
        id: 3,
        title: "Coming Soon!",
        description: "",
        src: ""
    }
];

const words2 = [
    { text: "Stay " },
    { text: "Up" },
    { text: "To" },
    { text: "Date.", className: "text-white" },
];

export default function UpcomingEventsSection({ id, ref }) {

    const titleRef = useRef(null);

    return (
        <div className="mb-8 mt-40"  id={id}  >

            <svg className="-z-10 translate-y-2" width="100%" height="192" viewBox="0 0 960 192" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g clipPath="url(#clip0_505_1163)">
                    <path d="M0 45.0004L32 45.5004C64 46.0004 128 47.0004 192 43.5004C256 40.0004 320 32.0004 384 31.7004C448 31.3004 512 38.7004 576 35.0004C640 31.3004 704 16.7004 768 11.5004C832 6.30037 896 10.7004 928 12.8004L960 15.0004V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V45.0004Z" fill="#1C2D75" />
                    <path d="M0 101L32 100.8C64 100.7 128 100.3 192 93.3C256 86.3 320 72.7 384 68.3C448 64 512 69 576 74C640 79 704 84 768 82.7C832 81.3 896 73.7 928 69.8L960 66V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V101Z" fill="#0F1F4E" />
                    <path d="M0 129L32 133.2C64 137.3 128 145.7 192 148.8C256 152 320 150 384 151.5C448 153 512 158 576 155.5C640 153 704 143 768 135C832 127 896 121 928 118L960 115V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V129Z" fill="#0A1029" />
                </g>
                <defs>
                    <clipPath id="clip0_505_1163">
                        <rect width="100%" height="192" fill="white" />
                    </clipPath>
                </defs>
            </svg>

            <div
                ref={titleRef}
                className="z-10 flex flex-col justify-center items-center gap-32 h-min min-h-screen px-8 lg:px-16 py-20 bg-primary-dark">
                    <motion.h1 className="text-secondary-dark text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black"   >Stay Up To Date</motion.h1>
                <div ref={ref}>
                    {
                        Events && (
                            <GlareCardDemo cards={Events} />
                        )
                    }
                </div>
            </div >

            <svg className="scale-x-[-1] scale-y-[-1] -translate-y-2 -z-10" width="100%" height="192" viewBox="0 0 960 192" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g clipPath="url(#clip0_505_1163)">
                    <path d="M0 45.0004L32 45.5004C64 46.0004 128 47.0004 192 43.5004C256 40.0004 320 32.0004 384 31.7004C448 31.3004 512 38.7004 576 35.0004C640 31.3004 704 16.7004 768 11.5004C832 6.30037 896 10.7004 928 12.8004L960 15.0004V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V45.0004Z" fill="#1C2D75" />
                    <path d="M0 101L32 100.8C64 100.7 128 100.3 192 93.3C256 86.3 320 72.7 384 68.3C448 64 512 69 576 74C640 79 704 84 768 82.7C832 81.3 896 73.7 928 69.8L960 66V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V101Z" fill="#0F1F4E" />
                    <path d="M0 129L32 133.2C64 137.3 128 145.7 192 148.8C256 152 320 150 384 151.5C448 153 512 158 576 155.5C640 153 704 143 768 135C832 127 896 121 928 118L960 115V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V129Z" fill="#0A1029" />
                </g>
                <defs>
                    <clipPath id="clip0_505_1163">
                        <rect width="100%" height="192" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </div >
    );
};