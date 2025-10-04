import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type MeetMemberProps = {
    name: string;
    role: string;
    image: string;
};

export default function MeetMember({ name, role, image }: MeetMemberProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Removed unused isVisible
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.1 }}
                className="flex flex-col items-center justify-center align-center hover:scale-105 transition-transform duration-300 ease-in-out aspect-3/4"
            >
            <div className="relative w-[20rem] h-[25rem]">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-300 rounded-sm shadow-md shadow-black/30 animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                )}
                <Image
                    src={image}
                    className={`w-[20rem] h-[25rem] rounded-sm shadow-md shadow-black/30 hover:shadow-xl transition-shadow duration-300 ease-in-out object-cover object-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    alt="Picture of the Manager"
                    width={500}
                    height={500}
                    onLoadingComplete={() => setIsLoading(false)}
                />
            </div>
            <div
                className="rounded-sm bg-primary-light h-24 w-[80%] text-white
                    flex flex-col justify-center items-center -translate-y-16 shadow-md shadow-black/30 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-secondary-light">
                    {name}
                </h3>
                <h5>
                    {role}
                </h5>
            </div>
            </motion.div>
        </AnimatePresence>
    );
}