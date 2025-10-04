"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import {
    IconInfoCircle,
    IconCircleCheckFilled,
    IconAlertTriangle,
    IconXboxXFilled,
    IconX,
} from '@tabler/icons-react';

export type ToastVariant = "info" | "success" | "warning" | "error";

type ToastProps = {
    variant?: ToastVariant;
    className?: string;
    message?: string;
    onClose?: () => void;
    duration?: number;
};

const toastVariants: Record<ToastVariant, { icon: React.ReactElement; bg: string; text: string; border: string }> = {
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

const Toast: React.FC<ToastProps> = ({ variant = "info", className, message, onClose, duration = 5000 }) => {
    const [visible, setVisible] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const variantStyles = toastVariants[variant] || toastVariants.info;

    useEffect(() => {
        if (message) {
            setVisible(true);
            setIsHiding(false);
        }
    }, [message]);

    useEffect(() => {
        if (visible && !isHiding) {
            const timer = setTimeout(() => {
                setVisible(false);
                setIsHiding(true);
                setTimeout(() => {
                    setIsHiding(false);
                    onClose && onClose();
                }, 500);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose, visible, isHiding]);

    if (!visible && !isHiding) return null;

    const handleClose = () => {
        setVisible(false);
        setIsHiding(true);
        setTimeout(() => {
            setIsHiding(false);
            onClose && onClose();
        }, 500);
    };

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-[100] p-4 rounded-md shadow-lg border-l-4 transition-opacity duration-500",
                variantStyles.bg,
                variantStyles.text,
                variantStyles.border,
                visible ? "opacity-100" : "opacity-0"
            )}
        >
            <div className={`flex items-center ${className}`}>
                <div className="text-sm mr-3">{variantStyles.icon}</div>
                <div className="text-sm flex-1">{message}</div>
                <button
                    onClick={handleClose}
                    className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <IconX size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;