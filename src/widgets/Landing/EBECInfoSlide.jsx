"use client";

import { motion, useTransform, useScroll, useInView } from "motion/react";
import { useRef } from "react";

const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//7.jpg";
const image2 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//10.jpg";
const image3 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//15.jpg";
const image4 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//1.jpg";
const image5 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//5.jpg";
const image6 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg";
const image7 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//11.jpg";

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
                        className="text-secondary-light text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black pt-8"
                        initial={{ opacity: 0, y: -50 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        The EBEC Formula
                    </motion.h1>
                </div>

                <div ref={cardsRef} className="top-0 flex-1 flex items-center">
                    <motion.div
                        style={{ x }}
                        className="flex gap-4"
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

const Card = ({ card }) => {
    return (
        <div
            key={card.id}
            className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200  mb-8 lg:mb-0"
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
                <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black text-white backdrop-blur-lg rounded-sm">
                    {card.title}
                </p>
            </div>
        </div>
    );
};

const cards = [
    {
        url: image1,
        title: "Ideate",
        id: 1,
    },
    {
        url: image2,
        title: "Engineer",
        id: 2,
    },
    {
        url: image3,
        title: "Lead",
        id: 3,
    },
    {
        url: image4,
        title: "Pitch",
        id: 4,
    },
    {
        url: image5,
        title: "Network",
        id: 5,
    },
    {
        url: image6,
        title: "Scale",
        id: 6,
    },
    {
        url: image7,
        title: "Dominate",
        id: 7,
    },
];