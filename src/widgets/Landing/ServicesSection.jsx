"use client";

import React, { useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { IconBook, IconUsers, IconCalendarEvent, IconTrophy } from '@tabler/icons-react';
import Link from 'next/link';

export default function ServicesSection() {

    const services = [
        {
            title: "Training & Workshops",
            icon: IconBook,
            link: "/events"
        },
        {
            title: "Networking Events",
            icon: IconUsers,
            link: "/events"
        },
        {
            title: "Club Activities",
            icon: IconCalendarEvent,
            link: "/events"
        },
        {
            title: "Competitions",
            icon: IconTrophy,
            link: "/events"
        }
    ];

    const backgroundSvg = encodeURIComponent(`
      <svg id="visual" viewBox="0 0 960 540" width="960" height="540" xmlns="http://www.w3.org/2000/svg" stopOpacityxmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="960" height="540" fill="#ffffff"></rect><defs><linearGradient id="grad1_0" x1="43.8%" y1="0%" x2="100%" y2="100%"><stop offset="14.444444444444446%" stopColor="#ffffff" stopOpacity="1"></stop><stop offset="85.55555555555554%" stopColor="#ffffff" stopOpacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="56.3%" y2="100%"><stop offset="14.444444444444446%" stopColor="#ffffff" stopOpacity="1"></stop><stop offset="85.55555555555554%" stopColor="#ffffff" stopOpacity="1"></stop></linearGradient></defs><g transform="translate(960, 0)"><path d="M0 216C-25.7 189.8 -51.5 163.7 -86 149C-120.5 134.2 -163.9 130.9 -187.1 108C-210.2 85.1 -213.1 42.5 -216 0L0 0Z" fill="#feb60f"></path></g><g transform="translate(0, 540)"><path d="M0 -216C36.1 -207.9 72.3 -199.7 105.5 -182.7C138.7 -165.7 169.1 -139.9 187.1 -108C205 -76.1 210.5 -38 216 0L0 0Z" fill="#feb60f"></path></g></svg>
    `);
    const [isDesktop, setIsDesktop] = useState(false);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Always call hooks unconditionally
    const translateYLeftTransform = useTransform(scrollYProgress, [0, 1], [0, 170]);
    const translateYRightTransform = useTransform(scrollYProgress, [0, 1], [0, -170]);
    const translateYAllTransform = useTransform(scrollYProgress, [0, 1], [0, -0]);
    
    // Then conditionally use the results
    const translateYLeft = isDesktop ? translateYLeftTransform : 0;
    const translateYRight = isDesktop ? translateYRightTransform : 0;
    const translateYAll = isDesktop === false ? translateYAllTransform : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <div
            ref={ref}
            className="flex flex-col w-screen min-h-min h-screen justify-center bg-white"
            style={{
                backgroundImage: `url("data:image/svg+xml,${backgroundSvg}")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-col min-h-min">

                <motion.div
                    className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-40 md:mt-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ translateY: translateYAll }}
                >

                    <svg xmlns="http://www.w3.org/2000/svg" width="100.27" height="98.45" viewBox="0 0 100.27 98.45" className='absolute opacity-95 -right-4 -top-24 md:-left-40 lg:left-4 md:top-0'>
                        <defs>
                            <linearGradient id="linear-gradient" x1="-0.284" y1="-0.633" x2="1.896" y2="2.49" gradientUnits="objectBoundingBox">
                                <stop offset="0" stopColor="#1b2755"></stop>
                                <stop offset="1" stopColor="#0a1029"></stop>
                            </linearGradient>
                            <filter id="Path_767" x="0" y="0" width="100.27" height="98.45" filterUnits="userSpaceOnUse">
                                <feOffset dx="1" dy="1" input="SourceAlpha"></feOffset>
                                <feGaussianBlur stdDeviation="0.5" result="blur"></feGaussianBlur>
                                <feFlood floodOpacity="0.149"></feFlood>
                                <feComposite operator="in" in2="blur"></feComposite>
                                <feComposite in="SourceGraphic"></feComposite>
                            </filter>
                        </defs>
                        <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_767)">
                            <path id="Path_767-2" d="M251.206,96.089a44.7,44.7,0,0,1,7.8-1.324c21.3-1.642,43.618,14.256,48.006,35.268,5.265,25.217-12.216,53.169-37.32,58.967s-53.347-12.1-58.321-37.384C206.565,127.191,227.572,102.259,251.206,96.089Z" transform="translate(-210.18 -94.15)" fill="url(#linear-gradient)"></path>
                        </g>
                    </svg>

                    {/* Left side - Text Content */}
                    <motion.div style={{ translateY: translateYLeft }} className="max-w-xl mb-12 " variants={itemVariants}>
                        <h2 className="text-4xl vsm:text-5xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4">
                            Why EBEC?
                        </h2>
                        <div className="h-1 w-12 bg-secondary-500 mb-4"></div>
                        <p className="text-lg text-gray-600">
                            <b>EBEC</b> offers various services to help students develop their entrepreneurial and business skills.  Through our programs, you'll gain practical experience and valuable connections in the business world.
                        </p>
                    </motion.div>

                    {/* Right side - Services Grid */}
                    <motion.div style={{ translateY: translateYRight }} className="grid grid-cols-2 gap-4 lg:-mb-16">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants} // Apply itemVariants for individual card animation
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#ffc00e",
                                    }}
                                    className="p-8 bg-slate-50 rounded-lg cursor-pointer flex flex-col items-center justify-center border-2 border-transparent group"
                                >
                                    <Link href={service.link} passHref className="flex flex-col items-center justify-center">
                                        <div className="relative flex flex-col items-center justify-center">
                                            <Icon className="w-16 h-16 text-secondary-500 mb-4 group-hover:text-black transition-colors duration-75" strokeWidth={1.5} />
                                            <h3 className="text-xl font-semibold text-gray-900 text-center group-hover:text-white transition-colors duration-75">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};