"use client";

import { motion, useTransform, useScroll, useInView } from "motion/react";
import { useRef } from "react";

const baseUrl = "/imgs/general/";
const cardNumbers = [7, 10, 15, 1, 5, 6, 11]; 
const cards = cardNumbers.map((num, index) => ({
    url: `${baseUrl}${num}.avif`,
    title: ["Ideate", "Engineer", "Lead", "Pitch", "Network", "Scale", "Dominate"][index],
    id: index + 1
}));

export const EBECInfoSlide = () => {
    const targetRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef(null);

    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    const isHeaderInView = useInView(headerRef, { once: true });
    const isCardsInView = useInView(cardsRef, { once: true });

    return (
        <motion.section ref={targetRef} className="relative h-[300vh] max-h-[300vh] bg-primary-dark">
            <div className="sticky top-0 flex flex-col justify-center w-screen h-screen overflow-hidden">

                <div className="relative block h-40">a</div>
                <div ref={headerRef} className="w-full text-center pb-6">
                    <motion.h1
                        className="text-secondary-light text-5xl sm:text-6xl lg:text-7xl font-black pt-8"
                        initial={{ opacity: 0, y: -50 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        The EBEC Formula
                    </motion.h1>
                </div>

                <div ref={cardsRef} className="top-0 flex-1 flex items-center pb-8">
                    <motion.div
                        style={{ x }}
                        className="flex gap-16 md:gap-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    >
                        {cards.map((card) => (
                            <Card card={card} key={card.id} />
                        ))}
                    </motion.div>
                </div>

            </div>
        </motion.section>
    );
};

interface CardProps {
    card: {
        url: string;
        title: string;
        id: number;
    };
}

const Card = ({ card }: CardProps) => {
    return (
        <div
            key={card.id}
            className="group relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[28.125rem] lg:w-[28.125rem] overflow-hidden bg-neutral-200 mb-8 lg:mb-0"
        >
            <div
            style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            ></div>
            <div className="absolute inset-0 z-10 grid place-content-center">
            <p className="bg-gradient-to-br from-white/20 to-white/0 p-4 sm:p-6 lg:p-8 text-4xl sm:text-5xl lg:text-6xl font-black text-white backdrop-blur-lg rounded-sm">
                {card.title}
            </p>
            </div>
        </div>
    );
};
