import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const AccordionIcon = ({ isOpen }) => {
    return (
        <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-6 h-6"
        >
            <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{
                    rotate: isOpen ? 180 : 0,
                    scale: isOpen ? 0.8 : 1
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            </motion.div>
        </motion.div>
    );
};

export const AccordionItem = ({ title, content, index, isOpen, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-sm bg-white/10 rounded-2xl mb-4 overflow-hidden border border-white/20 shadow-xl"
        >
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onClick}
                className={`w-full flex justify-between items-center p-6 bg-gradient-to-r from-primary-dark/90 to-primary-light/90 ${isOpen ? 'text-slate-400' : 'text-white'
                    } hover:text-secondary-dark transition duration-200`}
            >
                <motion.span
                    className="text-xl font-medium tracking-tight"
                    layout
                >
                    {title}
                </motion.span>
                <AccordionIcon isOpen={isOpen} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            transition: {
                                height: {
                                    duration: 0.4,
                                    ease: [0.04, 0.62, 0.23, 0.98]
                                },
                                opacity: { duration: 0.25 }
                            }
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                                height: { duration: 0.3 },
                                opacity: { duration: 0.25 }
                            }
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 bg-gradient-to-b from-white/5 to-white/10 text-white/90"
                        >
                            {content}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const Accordion = ({ accordionData, activeIndex, onAccordionClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-8 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 to-primary-light/30 blur-3xl" />
            {accordionData.map((item, index) => (
                <AccordionItem
                    key={index}
                    index={index}
                    title={item.title}
                    content={item.content}
                    isOpen={activeIndex === index}
                    onClick={() => onAccordionClick(index)}
                />
            ))}
        </motion.div>
    );
};

export default Accordion;
