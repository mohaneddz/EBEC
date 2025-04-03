"use client";

const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//3.jpg";
const image2 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//1.jpg";
const image3 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg";

import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";

import { TextGenerateEffect } from "@/components/Global/TextGenerator";
import { WobbleCard } from "@/components/Main/Wobble-card";

export default function WobbleCardSection() {
    const cardRefs = [useRef(null), useRef(null), useRef(null)];
    const inView = cardRefs.map(ref => useInView(ref, { once: true }));

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    return (
        <div id="WobbleCardSection"
            className="min-h-screen flex flex-col justify-center w-full bg-gradient-to-br from-primary-light to-primary-dark pb-24 ">

            <TextGenerateEffect
                words="Memorable Moments"
                className="relative block my-16 md:my-20 text-center mt-20"
                color={"secondary-dark"}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">

                <motion.div
                    ref={cardRefs[0]}
                    variants={cardVariants}
                    initial="hidden"
                    animate={inView[0] ? "visible" : "hidden"}
                    className="col-span-2 md:col-span-2 lg:col-span-2 h-full transparent min-h-[300px] md:min-h-[400px] lg:min-h-[300px]"
                >
                    <WobbleCard
                        containerClassName="h-full"
                        backgroundImage={image1}
                    >
                        <div className="max-w-xs md:max-w-md">
                            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-bold tracking-[-0.015em] text-primary-dark">
                                Opening Day
                            </h2>
                            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-primary-dark">
                                Opening Day marks the launch of our dynamic journey, bringing
                                together visionaries, innovators, and aspiring professionals to
                                celebrate new beginnings, set goals, and ignite collaborations for
                                a successful future.
                            </p>
                        </div>
                    </WobbleCard>
                </motion.div>

                <motion.div
                    ref={cardRefs[1]}
                    variants={cardVariants}
                    initial="hidden"
                    animate={inView[1] ? "visible" : "hidden"}
                    transition={{ delay: 0.2 }}
                    className="col-span-2 md:col-span-2 lg:col-span-1 transparent min-h-[300px] md:min-h-[300px]"
                >
                    <WobbleCard
                        containerClassName="h-full"
                        backgroundImage={image2}
                    >
                        <div className="w-full">
                            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-bold tracking-[-0.015em] text-primary-dark">
                                NETLIXIX
                            </h2>
                            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-primary-dark">
                                Empowering future professionals with expert tips on crafting
                                standout CVs and acing interviews, fostering confidence and growth.
                            </p>
                        </div>
                    </WobbleCard>
                </motion.div>

                <motion.div
                    ref={cardRefs[2]}
                    variants={cardVariants}
                    initial="hidden"
                    animate={inView[2] ? "visible" : "hidden"}
                    transition={{ delay: 0.4 }}
                    className="col-span-2 md:col-span-2 lg:col-span-3 transparent min-h-[400px] md:min-h-[500px] lg:min-h-[300px]"
                >
                    <WobbleCard
                        containerClassName="h-full"
                        backgroundImage={image3}
                    >
                        <div className="max-w-xs md:max-w-md">
                            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-bold tracking-[-0.015em] text-primary-dark">
                                IGNITE EVENT
                            </h2>
                            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-primary-dark">
                                IGNITE, our flagship event, connects aspiring interns with
                                innovative enterprises through networking, training, and
                                collaboration, fostering growth and opportunity for all
                                participants.
                            </p>
                        </div>
                    </WobbleCard>
                </motion.div>

            </div>

        </div>
    );
}
