"use client";

import React, { useState } from "react";
import { Accordion } from "@/components/Others/Accordion";
import { motion } from "motion/react";

const accordionData = [
    {
        title: "What is EBEC?",
        content: "EBEC (ENSIA Business & Entrepreneurship Club) is a student-led organization dedicated to fostering entrepreneurship and business skills among engineering students. We organize workshops, networking events, and competitions to bridge the gap between technical education and business acumen."
    },
    {
        title: "How can I join EBEC?",
        content: "Joining EBEC is open to all ENSIA students. You can apply through our online application form during our recruitment periods, typically at the beginning of each semester. We look for motivated individuals who are passionate about business and technology."
    },
    {
        title: "What events does EBEC organize?",
        content: "We organize various events throughout the year including: entrepreneurship workshops, networking sessions with industry professionals, case study competitions, hackathons, and our annual business conference. Each event is designed to provide practical experience and industry exposure."
    },
    {
        title: "Are there any membership fees?",
        content: "EBEC membership is free for all ENSIA students. We believe in providing equal opportunities for all students to develop their business and leadership skills. Some special events might have nominal fees to cover operational costs."
    },
    {
        title: "Can I get involved in organizing events?",
        content: "Absolutely! We encourage members to actively participate in event organization. You can join different committees based on your interests: Events, Marketing, Public Relations, or Technical. This provides hands-on experience in event management and leadership."
    }
];

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full pt-24"
            >
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="select-none text-4xl sm:text-5xl text-secondary-dark mb-8 hover:cursor-pointer active:scale-95 hover:scale-110 hover:-translate-y-3 transition duration-200 font-black"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="select-none text-lg text-white/80"
                    >
                        <b><u>Everything</u></b> you need to know about EBEC
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    <Accordion 
                        accordionData={accordionData} 
                        activeIndex={activeIndex} 
                        onAccordionClick={handleAccordionClick} 
                    />
                </motion.div>
            </motion.div >
        </ >
    );
};

export default Faq;