"use client";

import React, { useEffect, useRef } from "react";
import { GlareCardDemo } from '@/components/Glare-card'

const Events = [
    {
        id: 1,
        title: "Coming Soon!",
        description: "",
        src: ""
    },
    {
        id: 2,
        title: "Coming Soon!",
        description: "",
        src: ""
    },
    {
        id: 3,
        title: "Coming Soon!",
        description: "",
        src: ""
    }
];

export const UpcomingEvents = () => {
    const titleRef = useRef(null);

    return (
        <div
            ref={titleRef}
            className="
            flex
                w-screen
                px-8 lg:px-16 py-20
                my-16
                bg-gradient-to-tr
                from-slate-400
                to-slate-300
                shadow-slate-700/20 
                hover:shadow-slate-700/35 
                shadow-[0_20px_50px_rgba(0,0,0,0)] 
                transition-shadow duration-300">
            {
                Events && (
                    <GlareCardDemo cards={Events} />
                )
            }
        </div >
    );
};

export default UpcomingEvents;