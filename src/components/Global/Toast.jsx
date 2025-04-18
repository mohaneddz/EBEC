// Toast.js
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Make sure this path is correct
import {
    IconInfoCircle,
    IconCircleCheckFilled,
    IconAlertTriangle,
    IconXboxXFilled,
    IconX,
} from '@tabler/icons-react';

const toastVariants = {
    info: {
        icon: <IconInfoCircle size={20} />,
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-500",
    },
    success: {
        icon: <IconCircleCheckFilled size={20} />,
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-500",
    },
    warning: {
        icon: <IconAlertTriangle size={20} />,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-500",
    },
    error: {
        icon: <IconXboxXFilled size={20} />,
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-500",
    },
};

const Toast = ({ variant = "info",className,  message, onClose, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);
    const variantStyles = toastVariants[variant] || toastVariants.info; // Default to info

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose && onClose(); // Call onClose after fade out
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-[100] p-4 rounded-md shadow-lg border-l-4 transition-opacity duration-500",
                variantStyles.bg,
                variantStyles.text,
                variantStyles.border,
                visible ? "opacity-100" : "opacity-0" // Fade out
            )}
        >
            <div className={`flex items-center ${className}`}>
                <div className="text-sm mr-3">{variantStyles.icon}</div>
                <div className="text-sm flex-1">{message}</div>
                <button
                    onClick={() => {
                        setVisible(false);
                        onClose && onClose();
                     }} // Call onClose when manually closed
                    className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <IconX size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;