import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Use framer-motion instead of motion/react for full features like layout

// AccordionIcon remains the same
export const AccordionIcon = ({ isOpen }) => {
    return (
        <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-6 h-6"
        >
            {/* Removed the inner motion.div for simplicity, direct animation on svg parent is enough */}
            {/* The original inner motion.div animation is now handled by the outer one */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full" // Use w-full h-full to respect parent size
            >
                {/* Simplified icon: just a chevron */}
                <motion.path
                    d="M6 9l6 6 6-6"
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }} // Rotate the path itself if needed, or rely on parent
                    stroke="currentColor" // Inherit stroke color
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* If you want the plus/minus circle icon back: */}
                {/*
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <motion.line
                    x1="8" y1="12" x2="16" y2="12"
                    initial={false}
                    animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }} // Example animation for plus/minus
                    transformOrigin="center center" // Ensure rotation is centered
                />
                */}
            </svg>
        </motion.div>
    );
};


export const AccordionItem = ({ title, content, index, isOpen, onClick }) => {
    return (
        <motion.div
            // Removed initial animation from item itself if you want ONLY content to animate on open/close
            // If you still want the staggered load animation, keep these:
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            // ---
            className="backdrop-blur-sm bg-white/10 rounded-2xl mb-4 overflow-hidden border border-white/20 shadow-xl"
        >
            {/* Make the button layout static relative to the item */}
            <motion.button
                // Removed layout from button too, if it was causing issues
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onClick}
                className={`w-full flex justify-between items-center p-6 bg-gradient-to-r from-primary-dark/90 to-primary-light/90 ${isOpen ? 'text-slate-400' : 'text-white'
                    } hover:text-secondary-dark transition duration-200`}
                // Add layout="position" if ONLY position needs animating on hover/tap, not size
            >
                {/* REMOVED layout PROP FROM HERE */}
                <span className="text-xl font-medium tracking-tight text-left mr-4"> {/* Added text-left and mr-4 for better spacing */}
                    {title}
                </span>
                <AccordionIcon isOpen={isOpen} />
            </motion.button>

            <AnimatePresence initial={false}> {/* Added initial={false} to prevent exit animation on first load */}
                {isOpen && (
                    <motion.section // Use section for semantic correctness
                        key="content" // Add key for AnimatePresence
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
                        className="overflow-hidden" // Keep overflow hidden on the animated section
                    >
                        {/* Content div doesn't need its own motion animation if parent handles opacity/height */}
                        <div className="p-6 bg-gradient-to-b from-white/5 to-white/10 text-white/90">
                            {content}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Accordion component remains the same
export const Accordion = ({ accordionData, activeIndex, onAccordionClick }) => {
    // Ensure framer-motion is imported if not already
    // import { motion } from 'framer-motion';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-8 relative"
        >
            {/* Consider removing blur if performance is an issue */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 to-primary-light/30 blur-3xl -z-10" /> {/* Added -z-10 */}
            {accordionData.map((item, index) => (
                <AccordionItem
                    key={item.id || index} // Use a stable key if available
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

// Assuming you have a wrapper component to manage state
// Example Usage:
const App = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const accordionData = [
        { title: "Item 1", content: "Content for item 1..." },
        { title: "Item 2", content: "Content for item 2..." },
        { title: "Item 3", content: "Content for item 3..." },
    ];

    // Define some dummy CSS variables or replace with your actual theme colors
    React.useEffect(() => {
        document.documentElement.style.setProperty('--color-primary-dark', '#4a0e90');
        document.documentElement.style.setProperty('--color-primary-light', '#8b5cf6');
        document.documentElement.style.setProperty('--color-secondary-dark', '#c084fc');
    }, []);

    return (
        <div style={{ background: 'linear-gradient(to bottom right, #1e1b4b, #312e81)', minHeight: '100vh', paddingTop: '2rem' }}>
             {/* Basic CSS Variables for colors used in Tailwind classes */}
            <style>{`
                :root {
                 --color-primary-dark: #4a0e90; /* Example purple */
                 --color-primary-light: #8b5cf6; /* Example lighter purple */
                 --color-secondary-dark: #c084fc; /* Example even lighter purple */
                }
            `}</style>
            <Accordion
                accordionData={accordionData}
                activeIndex={activeIndex}
                onAccordionClick={handleAccordionClick}
            />
        </div>
    );
}


// Default export might need adjustment based on your file structure
// export default Accordion; // Or export default App; if App is your main component in this file