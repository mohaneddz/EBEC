"use client";

import React, { useEffect } from "react";
import { createClient } from '@/utils/supabase/client';

import { motion } from "motion/react";
import { GlareCardDemo } from '@/sections/Events/UpcomingEvnetsGlareCard'

export default function UpcomingEventsSection() {

    const [data, setData] = React.useState<{ id: string; title: string; description: string; src: string; open: boolean }[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await createClient()
                .from('upcoming')
                .select('*')
                .order('id', { ascending: true });
            if (error) {
                console.error("Error fetching events:", error);
            }
            if (data) {
                const updatedEvents = data.map((event) => ({
                    id: event.id,
                    title: event.title || "Coming Soon!",
                    date: event.date,
                    location: event.location,
                    description: event.brief,
                    src: event.picture,
                    open: event.open,
                }));
                //console.log('Upcoming events fetched successfully: ' + updatedEvents.length + ' events.');
                setData(updatedEvents);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);


    return (
        <div className="flex flex-col min-h-screen mt-40 mb-8 h-min" >

            <svg className="top-0 translate-y-2 -z-10" width="100%" height="192" viewBox="0 0 960 192" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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

            <div className="flex items-center justify-center bg-primary-dark">
                <div className="z-10 flex flex-col items-center justify-center gap-32 px-8 py-20 lg:h-screen lg:px-16 bg-primary-dark">
                    <motion.h1 className="text-2xl font-black text-secondary-dark vsm:text-3xl sm:text-5xl lg:text-7xl"   >Stay Up To Date</motion.h1>

                    {loading ? <p id="upcomingEvents" className="text-2xl font-bold text-center text-slate-700">Loading Upcoming Events...</p> :
                        <div>
                            {
                                <GlareCardDemo cards={data} />
                            }
                        </div>
                    }

                </div>
            </div>

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