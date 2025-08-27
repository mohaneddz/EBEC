"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { TextGenerateEffect } from "@/components/global/TextGenerator";
import { WobbleCard } from "@/components/main/WobbleCard";

const images = ['/imgs/general/3.avif', '/imgs/general/1.avif', '/imgs/general/6.avif'];

export default function WobbleCardSection() {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const isInView1 = useInView(ref1, { once: true });
    const isInView2 = useInView(ref2, { once: true });
    const isInView3 = useInView(ref3, { once: true });

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    return (
        <div id="WobbleCardSection" className="min-h-screen flex flex-col justify-center w-full bg-gradient-to-br from-primary-light to-primary-dark pb-24 ">
            <TextGenerateEffect
                words="Memorable Events"
                className="relative block my-16 md:my-20 text-center mt-20"
                color={"secondary-dark"}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
                <motion.div
                    ref={ref1}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isInView1 ? "visible" : "hidden"}
                    className="col-span-2 md:col-span-2 lg:col-span-2 h-full transparent min-h-[300px] md:min-h-[400px] lg:min-h-[300px]"
                >
                    <WobbleCard containerClassName="h-full" backgroundImage={images[0]}>
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
                    ref={ref2}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isInView2 ? "visible" : "hidden"}
                    transition={{ delay: 0.2 }}
                    className="col-span-2 md:col-span-2 lg:col-span-1 transparent min-h-[300px] md:min-h-[300px]"
                >
                    <WobbleCard containerClassName="h-full" backgroundImage={images[1]}>
                        <div className="w-full">
                            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-bold tracking-[-0.015em] text-primary-dark">
                                NATIXIS
                            </h2>
                            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-primary-dark">
                                Empowering future professionals with expert tips on crafting
                                standout CVs and acing interviews, fostering confidence and growth.
                            </p>
                        </div>
                    </WobbleCard>
                </motion.div>

                <motion.div
                    ref={ref3}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isInView3 ? "visible" : "hidden"}
                    transition={{ delay: 0.4 }}
                    className="col-span-2 md:col-span-2 lg:col-span-3 transparent min-h-[400px] md:min-h-[500px] lg:min-h-[300px]"
                >
                    <WobbleCard containerClassName="h-full" backgroundImage={images[2]}>
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