"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react"; // Import useState
import Image from 'next/image';

export function GlareCardDemo({ cards }) {
    return (
        <div className="justify-around justify-items-center inline-grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {cards.map((card) => (
                <GlareCard enabled={card.src} key={card.id} className="relative flex flex-col items-center justify-center">
                    {!card.src ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                stroke="currentColor"
                                strokeWidth="15"
                                strokeMiterlimit="3.86874"
                                strokeLinecap="round"
                                className="w-20 h-20 text-slate-300"
                                viewBox="0 0 320 512">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                            </svg>
                            <h2 className="text-slate-300 font-bold pt-8 text-xl">
                                {card.title}
                            </h2>
                            <p className="text-slate-500 font-bold pt-8">
                                {card.description}
                            </p>
                        </div>
                    ) : (
                        <div
                            className="z-40 relative w-full h-full group" 
                        >
                            <Image
                                height={300}
                                width={300}
                                src={card.src}
                                alt={card.title}
                                className="w-full h-full object-cover transition duration-500 ease-in-out"
                            />
                            {/* Overlay and text, made visible on GlareCard hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-500">
                                <h2 className="text-secondary-dark font-black text-3xl drop-shadow-md opacity-0 group-hover:-translate-y-2 transition-transform duration-300 ease-in-out group-hover:opacity-100">
                                    {card.title}
                                </h2>
                                <p className="text-gray-300 font-medium mt-2 drop-shadow-md opacity-0 group-hover:-translate-y-2 transition-transform duration-300 ease-in-out group-hover:opacity-100">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    )}
                </GlareCard>
            ))}
        </div>
    );
}


export const GlareCard = ({
    children,
    enabled,
    className
}) => {
    const isPointerInside = useRef(false);
    const refElement = useRef(null);
    const state = useRef({
        glare: {
            x: 50,
            y: 50,
        },
        background: {
            x: 50,
            y: 50,
        },
        rotate: {
            x: 0,
            y: 0,
        },
    });
    const containerStyle = {
        "--m-x": "50%",
        "--m-y": "50%",
        "--r-x": "0deg",
        "--r-y": "0deg",
        "--bg-x": "50%",
        "--bg-y": "50%",
        "--duration": "300ms",
        "--foil-size": "100%",
        "--opacity": "0",
        "--radius": "48px",
        "--easing": "ease",
        "--transition": "var(--duration) var(--easing)"
    };

    const backgroundStyle = {
        "--step": "5%",
        "--foil-svg": `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' strokeLinecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")`,
        "--pattern": "var(--foil-svg) center/100% no-repeat",
        "--rainbow":
            "repeating-linear-gradient( 0deg,rgb(115, 239, 255) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
        "--diagonal":
            "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        "--shade":
            "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        backgroundBlendMode: "hue, hue, hue, overlay",
    };

    const updateStyles = () => {
        if (refElement.current) {
            const { background, rotate, glare } = state.current;
            refElement.current?.style.setProperty("--m-x", `${glare.x}%`);
            refElement.current?.style.setProperty("--m-y", `${glare.y}%`);
            refElement.current?.style.setProperty("--r-x", `${rotate.x}deg`);
            refElement.current?.style.setProperty("--r-y", `${rotate.y}deg`);
            refElement.current?.style.setProperty("--bg-x", `${background.x}%`);
            refElement.current?.style.setProperty("--bg-y", `${background.y}%`);
        }
    };
    return (
        (<div
            style={containerStyle}
            className={cn("relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-transform w-64 sm:w-[20rem] md:w-[15rem] lg:w-[18rem] xl:w-[24rem] [aspect-ratio:17/21]", className)}
            ref={refElement}
            onPointerMove={(event) => {
                const rotateFactor = 0.4;
                const rect = event.currentTarget.getBoundingClientRect();
                const position = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };
                const percentage = {
                    x: (100 / rect.width) * position.x,
                    y: (100 / rect.height) * position.y,
                };
                const delta = {
                    x: percentage.x - 50,
                    y: percentage.y - 50,
                };

                const { background, rotate, glare } = state.current;
                background.x = 50 + percentage.x / 4 - 12.5;
                background.y = 50 + percentage.y / 3 - 16.67;
                rotate.x = -(delta.x / 3.5);
                rotate.y = delta.y / 2;
                rotate.x *= rotateFactor;
                rotate.y *= rotateFactor;
                glare.x = percentage.x;
                glare.y = percentage.y;

                updateStyles();
            }}
            onPointerEnter={() => {
                isPointerInside.current = true;
                if (refElement.current) {
                    setTimeout(() => {
                        if (isPointerInside.current) {
                            refElement.current?.style.setProperty("--duration", "0s");
                        }
                    }, 300);
                }
            }}
            onPointerLeave={() => {
                isPointerInside.current = false;
                if (refElement.current) {
                    refElement.current.style.removeProperty("--duration");
                    refElement.current?.style.setProperty("--r-x", `0deg`);
                    refElement.current?.style.setProperty("--r-y", `0deg`);
                }
            }}>
            <div
                onClick={() => {
                    if (enabled) {
                        alert("Card clicked!");
                    }
                }}
                className={`sm:w-[20rem] md:w-[15rem] lg:w-[18rem] xl:w-[24rem] [aspect-ratio:17/21] grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] rounded-[var(--radius)] border border-slate-800 hover:[--opacity:0.2] hover:[--duration:200ms] hover:[--easing:linear] hover:filter-none ${enabled ? "hover:cursor-pointer group active:duration-100 active:scale-95 hover:scale-105" : ""}`}>
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clipPath:inset(0_0_0_0_round_var(--radius))]">
                    <div className={cn("h-full w-full bg-primary-dark")}>
                        {children}
                    </div>
                </div>
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clipPath:inset(0_0_1px_0_round_var(--radius))] opacity-[var(--opacity)] transition-opacity transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)]" />
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-[var(--opacity)] will-change-background transition-opacity [clipPath:inset(0_0_1px_0_round_var(--radius))] [background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] relative after:content-[''] after:grid-area-[inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit] after:bg-[inherit] after:mix-blend-exclusion after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-blend-mode:soft-light,_hue,_hard-light]"
                    style={{ ...backgroundStyle }} />
            </div>
        </div>)
    );
};