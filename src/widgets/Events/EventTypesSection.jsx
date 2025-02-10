"use client";

import Button from '@/components/Button';
import ShowcaseCard from '@/components/ShowcaseCard';
import { motion, useScroll, useTransform } from 'framer-motion'; 
import { useRef } from 'react';

const image1 = "/Assets/Hero/8.jpg";
const image2 = "/Assets/Hero/5.jpg";
const image3 = "/Assets/Hero/12.jpg";

export default function EventTypesSection() {
    const ref = useRef(null); 
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"] 
    });

    
    const translateY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateY2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const translateY3 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <div className="min-h-screen h-min w-screen bg-[#eef1f6] pb-24 pt-32" ref={ref}>

            <div className="grid grid-cols-3 w-[60%] gap-16 relative h-[40rem] mx-auto items-center">

                <motion.div className='z-10 col-start-1 col-end-2' style={{ translateY: translateY1 }}>
                    <ShowcaseCard image={image2} title={"Workshops"} description={"Prepare for the real world!"} claassname={'relative m-8'} />
                </motion.div>

                <motion.div className='z-10 col-start-2 col-end-3 row-span-2' style={{ translateY: translateY2 }}>
                    <ShowcaseCard image={image3} title={"Competetions"} description={"Your chance to show your skills!"} claassname={'relative m-8'} />
                </motion.div>

                <motion.div className='z-10 col-start-1 col-end-2 row-start-2 row-end-3' style={{ translateY: translateY3 }}>
                    <ShowcaseCard image={image1} title={"Events"} description={"Making Incredible experiences"} claassname={'relative m-8'} />
                </motion.div>

                <svg className='z-0 absolute h-[50rem] w-[50rem]' viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path className="opacity-20" fill="#1B2755" d="M31.4,-58.9C40,-49.5,45.8,-39.6,52.3,-29.7C58.8,-19.8,66.1,-9.9,71.2,3C76.4,15.9,79.5,31.8,74.8,44.9C70.2,58.1,57.9,68.4,44.1,75.8C30.3,83.1,15.2,87.4,1.1,85.4C-12.9,83.4,-25.8,75.2,-33.1,64.1C-40.4,53.1,-42.2,39.3,-48.2,28.1C-54.3,16.9,-64.5,8.5,-67.6,-1.8C-70.8,-12.1,-66.7,-24.1,-61.4,-36.5C-56.1,-48.9,-49.5,-61.6,-39.1,-70C-28.6,-78.4,-14.3,-82.5,-1.4,-80C11.4,-77.5,22.8,-68.4,31.4,-58.9Z" transform="translate(100 100)" />
                </svg>

                <div className="flex flex-col justify-center items-center col-start-3 col-end-4 row-span-2">
                    <div className="flex flex-col justify-center items-start">
                        <h1 className="w-min text-nowrap text-5xl font-black uppercase text-primary-light">Our Activities</h1>
                        <p className="text-lg text-primary-light py-8 ">We offer a wide range of activities, from learning to practice to competetions. <br />There is always Something for everyone! </p>
                        <Button text={"Join US"} color1={'#FFC208'} color2={'#FDA916'} />
                    </div>
                </div>

            </div>

        </div>
    );
}