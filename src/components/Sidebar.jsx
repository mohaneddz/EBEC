"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";

export const Logo = () => {
    return (
        (<button
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
            <div
                className="h-5 w-6 bg-black dark:bg-secondary-light rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black  whitespace-pre">
                Admin Board
            </motion.span>
        </button>)
    );
};
export const LogoIcon = () => {
    return (
        (<button
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
            <div
                className="h-5 w-6 bg-black dark:bg-secondary-dark rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </button>)
    );
};

export const Dashboard = ({ children }) => {
    return (
        (<div className="flex flex-1 w-full">
            <div
                className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200  bg-white  flex flex-col gap-2 flex-1 h-full w-full overflow-y-scroll">
                {children}
            </div>
        </div>)
    );
};

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        (<SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>)
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate
}) => {
    return (
        (<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>)
    );
};

export const SidebarBody = (props) => {
    return (<>
        <DesktopSidebar {...props} />
        <MobileSidebar {...(props)} />
    </>);
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen, animate } = useSidebar();
    return (<>
        <motion.div
            className={cn(
                "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100  w-[300px] flex-shrink-0",
                className
            )}
            animate={{
                width: animate ? (open ? "300px" : "60px") : "300px",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}>
            {children}
        </motion.div>
    </>);
};

export const MobileSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen } = useSidebar();
    return (<>
        <div
            className={cn(
                "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100  w-full"
            )}
            {...props}>
            <div className="flex justify-end z-20 w-full">
                <IconMenu2
                    className="text-neutral-800"
                    onClick={() => setOpen(!open)} />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "fixed h-full w-full inset-0 bg-white  p-10 z-[100] flex flex-col justify-between",
                            className
                        )}>
                        <div
                            className="absolute right-10 top-10 z-50 text-neutral-800"
                            onClick={() => setOpen(!open)}>
                            <IconX />
                        </div>
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </>);
};

export const SidebarLink = ({
    link,
    className,
    onClick,
    ...props
}) => {
    const { open, animate } = useSidebar();
    return (
        <button
            className={cn("flex items-center justify-start gap-2  group/sidebar py-2", className)}
            onClick={onClick}
            {...props}>
            {link.icon}
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
                {link.label}
            </motion.span>
        </button>
    );
};
