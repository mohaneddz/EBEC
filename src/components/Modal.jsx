"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';

const Modal = ({ children, isVisible, close }) => {
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    if (!isVisible) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={close}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-white w-[28rem] h-80 rounded-lg shadow-lg flex flex-col justify-center items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default Modal;