"use client";

import React, { useState, useEffect, useRef } from 'react';
import supabase from '@/config/supabaseClient';
import { motion } from 'motion/react';

import { FollowerPointerCard, TitleComponent } from "@/components/Following-pointer";
import { TextGenerateEffect } from "@/components/TextGenerator";

import Image from "next/image";

export const AboutUsSection = () => {

    const [AboutUsIndex, setAboutUsIndex] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [Members, setMembers] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [Departments, setDepartments] = useState(null);
    const intervalRef = useRef(null);

    const [picAnimation, setPicAnimation] = useState(false);
    const [textAnimation, setTextAnimation] = useState(false);


    const handlePicAnimation = (latest) => {
        if (latest.opacity === 0) {
            setPicAnimation(true);
        }
    };

    const handletTextAnimation = (latest) => {
        if (latest.opacity === 0) {
            setTextAnimation(true);
        }
    };

    useEffect(() => {
        if (picAnimation && textAnimation) {
            setPicAnimation(false);
            setTextAnimation(false);
            setAboutUsIndex(prev => (prev + 1) % (Departments?.length || 1));
            // console.log(AboutUsIndex);
        }
    }, [Departments, picAnimation, textAnimation]);

    // useEffect(() => {
    //     if (intervalRef.current) return;

    //     intervalRef.current = setInterval(() => {
    //         setAboutUsIndex(prev => (prev + 1) % (Departments?.length || 1));
    //     }, 3000);

    //     return () => {
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //             intervalRef.current = null;
    //         }
    //     };
    // }, [Departments]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fetching Data -------------------------------------

    // Members
    useEffect(() => {
        if (Members) return;
        const fetchEvent = async () => {
            const { data, error } = await supabase.from('Team').select('*');

            if (error) {
                setFetchError('Could not fetch the Members!');
                setMembers(null);
                // console.log('Fetch error:', error);
            }
            if (data) {
                const Members = data
                    .map(({ id, name, dep, role, src }) => ({
                        id,
                        name,
                        dep,
                        role,
                        src
                    })).sort((a, b) => a.id - b.id);
                setMembers(Members);
                setFetchError(null);
                // console.log(Members);
            }
        };
        fetchEvent();
    }, [Members])

    // Departments
    useEffect(() => {
        if (Departments) return;
        const fetchEvent = async () => {
            const { data, error } = await supabase.from('Department').select('*');

            if (error) {
                setFetchError('Could not fetch the Departments!');
                setDepartments(null);
                // console.log('Fetch error:', error);
            }
            if (data) {
                const Departments = data
                    .map(({ id, name, description, short_description }) => ({
                        id,
                        name,
                        description,
                        short_description
                    }))
                setDepartments(Departments);
                setFetchError(null);
                // console.log(Departments);
            }
        };
        fetchEvent();
    }, [Departments]);

    return (

        <div id='AboutUsSection'>


            <div
                className="mt-40 relative bg-gradient-to-br from-primary-dark to-primary-light flex flex-col
                      h-[40rem] sm:h-[50rem] md:h-[60rem] lg:h-[70rem] justify-center shadow-xl 
                      shadow-slate-900/50 -mb-5 z-10 huge:hover:shadow-2xl huge:hover:shadow-slate-900/90 transition duration-200 overflow-hidden">

                <TextGenerateEffect
                    margin={""}
                    color={"white"}
                    words="Discover Our Team"
                    className={` my-16 md:my-32 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center`}
                />

                <div className="relative grid grid-cols-2 pr-16 md:pr-4 gap-16 w-full h-full align-center justify-center items-center">

                    {/* The Circle */}

                    <div className="relative h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[30rem] md:w-[30rem] lg:h-[35rem] lg:w-[35rem] xl:h-[40rem] xl:w-[40rem] rounded-full border-4 -left-36">

                        {/* Elements inside the circle */}

                        <motion.div
                            className="absolute top-0 left-0 h-full w-full rounded-full"
                            transition={{
                                times: [0, 0.1, 0.9, 1],
                                duration: 3,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatDelay: 0.05,
                            }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                rotate: [-30, 0, 0, 30],
                            }}
                            onUpdate={(latest) => {
                                if (latest.opacity === 0 && !picAnimation) {
                                    setPicAnimation(true);
                                }
                            }} // Trigger change on animation complete
                        >
                            {/* The Pictures! */}
                            {Departments && Members &&
                                <>
                                    <FollowerPointerCard className="static Co1"
                                        title={
                                            <TitleComponent
                                                title={Members[(AboutUsIndex * 3) % Members.length]?.name || "Empty Position!"}
                                                avatar={Members[(AboutUsIndex * 3) % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"}
                                            />
                                        }
                                        color={"#0ea5e9"}
                                    >
                                        <Image
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'cover' }}
                                            className="z-10 absolute -top-4 right-4 h-16 w-16 select-none
                                            sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-36 lg:h-36 xl:w-44 xl:h-44
                                            sm:-top-8 sm:right-12 md:-top-12 md:right-32 lg:right-44 lg:-top-16 xl:-top-20 xl:right-48 
                                            rounded-full border-2 border-secondary-dark bg-center bg-cover
                                            hover:scale-110 transition duration-200 active:scale-90"
                                            src={Members[(AboutUsIndex * 3 + 1) % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"}
                                            alt="Member Picture"
                                        />
                                    </FollowerPointerCard>

                                    <FollowerPointerCard className="static Manager"
                                        title={
                                            <TitleComponent
                                                title={Members[(AboutUsIndex * 3) % Members.length]?.name || "Empty Position!"}
                                                avatar={Members[(AboutUsIndex * 3) % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"}
                                            />
                                        }
                                        color={"#ef6c00"}

                                    >
                                        <Image
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'cover' }}
                                            className="z-10 absolute top-20 -right-12 h-24 w-24 select-none
                                            sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56 
                                            sm:top-24 sm:-right-12 md:top-36 md:-right-20 lg:top-36 lg:-right-20 xl:top-44 xl:-right-24 
                                            rounded-full border-4 border-secondary-dark bg-center bg-cover
                                            hover:scale-110 transition duration-200 active:scale-90"
                                            src={Members[(AboutUsIndex * 3) % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"}
                                            alt="Member Picture"
                                        />
                                    </FollowerPointerCard>

                                    <FollowerPointerCard className="static Co2"
                                        title={
                                            <TitleComponent title={Members[AboutUsIndex * 3 + 2 % Members.length]?.name || "Empty Position!"} avatar={Members[AboutUsIndex * 3 + 2 % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"} />
                                        }
                                        color={"#0ea5e9"}
                                    >
                                        <Image
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'cover' }}
                                            className="z-10 absolute -bottom-4 right-4 h-16 w-16 select-none
                            sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-36 lg:h-36 xl:w-44 xl:h-44
                            sm:-bottom-8 sm:right-12 md:-bottom-12 md:right-32 lg:right-44 lg:-bottom-16 xl:-bottom-20 xl:right-48 
                            rounded-full border-2 border-secondary-light bg-center bg-cover
                            hover:scale-110 transition duration-200 active:scale-90"
                                            src={Members[AboutUsIndex * 3 + 2 % Members.length]?.src || "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Members/Unknown.png?t=2024-12-11T08%3A25%3A24.534Z"}
                                            alt="Member Picture"
                                        />
                                    </FollowerPointerCard>
                                </>
                            }
                        </motion.div>

                    </div>

                    {/* The Heading */}

                    <div className="Description flex flex-col justify-center items-center sm:gap-4 lg:px-8 px-4 msm:pr-8 huge:pr-32">

                        {Departments &&
                            <>
                                <motion.h1
                                    className="xl:text-8xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-bold text-center text-secondary-dark my-8"
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        x: [-10, 0, 0, 10]
                                    }}
                                    transition={{
                                        times: [0, 0.1, 0.9, 1],
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatDelay: 0.05,
                                    }}
                                    onUpdate={(latest) => {
                                        if (latest.opacity === 0 && !textAnimation) {
                                            setTextAnimation(true);
                                        }
                                    }}
                                >
                                    {Departments[AboutUsIndex].name}
                                </motion.h1>

                                <motion.p
                                    className="text-center xl:text-2xl lg:text-xl md:text-md sm:text-lg text-slate-300 my-4 leading-relaxed"
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        x: [-10, 0, 0, 10]
                                    }}
                                    transition={{
                                        times: [0, 0.1, 0.9, 1],
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatDelay: 0.05,
                                    }}
                                >
                                    {isSmallScreen ? Departments[AboutUsIndex].short_description : Departments[AboutUsIndex].description}

                                </motion.p>
                            </>
                        }
                        <motion.a
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            href={'login'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            target="_blank"
                            className="px-4 py-3 mt-8 text-xs md:text-baseline lg:text-xl lg:px-8 lg:py-4 xl:text-2xl rounded-full font-bold
                    bg-secondary-dark hover:bg-secondary-light text-white hover:text-black">
                            {"Join Us"}
                        </motion.a>
                    </div>
                    <div />
                </div>
            </div>
        </div>);

};

export default AboutUsSection;
