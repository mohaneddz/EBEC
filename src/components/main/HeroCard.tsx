"use client";

import { useState, useEffect } from "react";
import { motion, MotionValue } from "motion/react";
import type { HeroCard } from '@/types/hero';

type HeroCardContentProps = {
    card: HeroCard;
    translate: MotionValue<number>;
    transition: any;
    animate: any;
    initial: any;
};

export default function HeroCardContent({
    card,
    translate,
    transition,
    animate,
    initial,
}: HeroCardContentProps) {

    return (
        <motion.div
            style={{ x: translate }}
            initial={initial}
            animate={animate}
            transition={transition}
            whileHover={{ y: -20 }}
            key={card.title}
            className="group/product h-96 w-full sm:w-[30rem] relative flex-shrink-0"
        >
            <div className="block group-hover/product:shadow-2xl">
                <motion.img
                    src={card.thumbnail}
                    height="350"
                    width="350"
                    loading="eager"
                    decoding="async"
                    className={`object-cover object-left-top absolute h-full w-full inset-0 transition-opacity duration-500}`}
                    alt={card.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            </div>

            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>

            <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-secondary-dark rounded-lg">
                {card.title}
            </h2>
        </motion.div>
    );
}
