"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FAQItem } from '@/types/about';

interface AccordionIconProps {
    isOpen: boolean;
}

interface AccordionItemProps {
    question: string;
    answer: ReactNode;
    index: number;
    isOpen: boolean;
    onClick: () => void;
}

interface AccordionProps {
    accordionData: FAQItem[];
}

export const AccordionIcon: React.FC<AccordionIconProps> = ({ isOpen }) => {
    return (
        <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-6 h-6"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
            >
                {/* The path itself shouldn't rotate, the container div handles the rotation */}
                <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </motion.div>
    );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, index, isOpen, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-sm bg-white/10 rounded-2xl mb-4 overflow-hidden border border-white/20 shadow-xl cursor-pointer"
        >
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onClick}
                className={`cursor-pointer w-full flex justify-between items-center p-6 bg-gradient-to-r from-primary-dark/90 to-primary-light/90 ${isOpen ? 'text-slate-400' : 'text-white'
                    } hover:text-secondary-dark transition duration-200`}
            >
                <span className="text-xl font-medium tracking-tight text-left mr-4">
                    {question} {/* Changed from title */}
                </span>
                <AccordionIcon isOpen={isOpen} />
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.04, 0.62, 0.23, 0.98]
                        }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-b from-primary/50 to-primary-light/70 text-white/90">
                            {answer} {/* Changed from content */}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const Accordion: React.FC<AccordionProps> = ({ accordionData }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleIndex = (index: number) => {
        setActiveIndex(prev => (prev === index ? null : index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-8 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 to-primary-light/30 blur-3xl -z-10" />
            {accordionData.map((item, index) => (
                <AccordionItem
                    key={item.id || index}
                    index={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={activeIndex === index}
                    onClick={() => toggleIndex(index)}
                />
            ))}
        </motion.div>
    );
};