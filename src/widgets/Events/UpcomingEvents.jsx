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
        <div className="container mx-auto ">
            <div
                ref={titleRef}
                className=" flex justify-around">
                {Events && (
                    <GlareCardDemo cards={Events} />
                )}
            </div>
        </div>
    );
};

export default UpcomingEvents;