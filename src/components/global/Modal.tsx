"use client";

import { useRef, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconX } from '@tabler/icons-react';

type ModalButton = {
    label: ReactNode;
    onClick: () => void;
    className?: string;
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    children?: ReactNode;
    buttons?: ModalButton[];
};

export default function Modal ({
    isOpen,
    onClose,
    title,
    children,
    buttons
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Lock body scroll while the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/20"
                    onMouseDown={(e) => {
                        // Close only when clicking the backdrop itself, not when interacting with content or portals
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[70vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                <IconX size={20} />
                            </button>
                        </div>
                        {children}
                        <div className="flex justify-end space-x-3 pt-4">
                            {buttons && buttons.map((button, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={button.onClick}
                                    className={`click px-4 py-2 rounded-md transition-colors duration-150 ${button.className || 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}