"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function DepartmentCard({
    picture,
    title,
    onClick,
    onFlip,
    isFlipped
}: {
    picture: string;
    title: string;
    onClick: () => void;
    onFlip: () => void;
    isFlipped: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        onFlip();
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onClick();
        scrollDown();
    };

    function scrollDown() {
        const element = document.getElementById("team");
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: window.innerHeight * 1.2, behavior: 'smooth' });
        }
    }

    return (
        <div
            className={`card-container w-min ${isHovered ? 'hovered' : ''}`}
            style={{ margin: '10px' }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                {/* Front side */}
                <div
                    className="card-face front full center"
                    style={{
                        background: 'radial-gradient(circle, #1b2755 0%, #0a1029 100%)',
                        padding: '30px',
                        border: '4px solid #fda916',
                        borderRadius: '12px',
                        boxSizing: 'border-box'
                    }}
                >
                    <Image
                        src={picture}
                        alt={title}
                        width={160}
                        height={160}
                        className="w-40 h-40"
                    />
                </div>

                {/* Back side */}
                <div
                    className="card-face back"
                    style={{
                        background: 'radial-gradient(circle, #1b2755 0%, #0a1029 100%)',
                        padding: '20px',
                        border: '4px solid #fda916',
                        borderRadius: '12px',
                        boxSizing: 'border-box'
                    }}
                >
                    <div className="flex flex-col items-center">
                        {title.split(' ').map((word, index) => (
                            <span
                                key={index}
                                className="text-secondary-dark font-black text-3xl"
                            >
                                {word}
                            </span>
                        ))}

                        <Button
                            variant="secondary"
                            className="mt-4 text-white font-bold"
                            onClick={handleButtonClick}
                        >
                            Explore!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
