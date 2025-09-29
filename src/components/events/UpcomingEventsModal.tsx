import React, { useRef, useEffect } from "react";

import type { ModalProps } from '@/types/glareCard';
import Image from "next/image";

import { AnimatePresence, motion } from "motion/react";
import { IconX } from "@tabler/icons-react";

export default function Modal({ isOpen, onClose, title, children, imageUrl }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
                    <motion.div
                        ref={modalRef}
                        className="relative flex flex-col w-full max-w-lg bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        {imageUrl && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={imageUrl}
                                    alt={title || "Modal Image"}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )}
                        <div className="flex-grow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <button onClick={onClose} className="text-gray-500 ">
                                    <IconX size={24} />
                                </button>
                            </div>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};