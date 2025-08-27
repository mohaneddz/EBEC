"use client";

import Slider from 'react-infinite-logo-slider'
import { motion } from "motion/react";
import Image from 'next/image';

const baseUrl = "imgs/logos/";
const images = Array.from({ length: 17 }, (_, i) => `${baseUrl}${i + 1}.webp`);

export default function LogoSliderSection() {
    return (
        <div className="w-screen h-full flex flex-col items-center justify-center gap-6 my-20 sm:my-30 md:my-40">

            <motion.h1 className="text-slate-400 mb-10 sm:mb-20 md:mb-40 text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-black">
                Our Collaborators
            </motion.h1>

            <div className="relative h-full opacity-40 p-4 w-[90%] sm:w-[85%] md:min-w-[100%] md:max-w-[70rem]">

                <Slider
                    duration={40}
                    pauseOnHover={true}
                    blurBorders={true}
                    blurBorderColor={'#e9edf4'}
                >
                    {images.map((image, index) => (
                        <Slider.Slide key={index}>
                            <Image
                                unoptimized
                                height={500}
                                width={500}
                                src={image}
                                alt={`collaborator logo ${index}`}
                                className='w-max h-min sm:w-20 sm:h-20 md:w-24 md:h-24 bg-opacity-15'
                            />
                        </Slider.Slide>
                    ))}
                </Slider>
            </div>
        </div>
    )
}
