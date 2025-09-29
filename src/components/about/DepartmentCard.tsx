"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DepartmentCard({ picture, title }: { picture: string; title: string }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    function scrollDown(){
        const element = document.getElementById("team");
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        else{
            window.scrollBy({ top: window.innerHeight * 1.2, behavior: 'smooth' });
        }
    }

    return (
        <div
            className={`card-container w-min ${isHovered ? 'hovered' : ''}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                {/* Front side */}
                <div
                    className="card-face front bg-[#262626]"
                    style={{ backgroundImage: `url(${picture})` }}
                ></div>
                {/* Back side */}
                <div className="card-face back bg-[#262626]">
                    <h3 className='text-secondary-dark font-black'>{title}</h3>
                    <Button variant="secondary" className='mt-4 text-white font-bold' onClick={scrollDown}>
                        Explore!
                    </Button>
                </div>
            </div>
        </div>
    );
}