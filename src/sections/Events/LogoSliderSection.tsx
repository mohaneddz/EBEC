"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const baseUrl = "imgs/logos/";
const images = Array.from({ length: 16 }, (_, i) => `${baseUrl}${i + 1}.webp`);

export default function LogoSliderSection() {
    const [paused, setPaused] = useState(false);
    
    return (
        <div className="w-screen h-full flex flex-col items-center justify-center gap-6 my-20 sm:my-30 md:my-40">
            <motion.h1
                className="text-slate-400 mb-10 sm:mb-20 md:mb-40 text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                Our Collaborators
            </motion.h1>
            
            <div
                className="relative w-[90%] sm:w-[85%] md:max-w-[70rem] overflow-hidden opacity-40"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 w-20 sm:w-32 md:w-40 h-full bg-gradient-to-r from-[#e1e4ea] via-[#e1e4ea]/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-20 sm:w-32 md:w-40 h-full bg-gradient-to-l from-[#e1e4ea] via-[#e1e4ea]/50 to-transparent z-10 pointer-events-none" />
                
                <motion.div
                    className="flex gap-6 sm:gap-8 md:gap-10 w-max"
                    animate={{ x: paused ? 0 : "-50%" }}
                    transition={{
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 40,
                    }}
                    style={{ willChange: "transform" }}
                >
                    {[...images, ...images].map((image, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative"
                        >
                            <Image
                                unoptimized
                                src={image}
                                alt={`collaborator logo ${index}`}
                                fill
                                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                                className="object-contain"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}