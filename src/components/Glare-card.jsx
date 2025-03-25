"use client";

import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import Button from './Button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Toast from './Toast'; // Import the Toast component

// Custom Input Component
const Input = ({
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    required,
    className,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const labelClasses = cn(
        "block text-sm font-medium transition-colors",
        isFocused || value ? "text-blue-600" : "text-gray-700",
        error ? "text-red-500" : ""
    );

    const inputClasses = cn(
        "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:border-transparent",
        isFocused ? "ring-blue-500 border-blue-500" : "border-gray-300",
        error ? "border-red-500 ring-red-500" : "",
        className
    );


    return (
        <div className="mb-4">
            <label className={labelClasses}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    className={inputClasses}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows="4"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-invalid={error ? "true" : "false"}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    className={inputClasses}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-invalid={error ? "true" : "false"}
                    {...props}
                />
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default function Modal({ isOpen, onClose, title, children, buttons, imageUrl }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/20">
                    <motion.div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-col"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        {imageUrl && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={imageUrl}
                                    alt={title || "Modal Image"}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )}
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3> {/* Larger, bolder title */}
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <IconX size={24} />  {/* Larger icon */}
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

export function GlareCardDemo({ cards }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [motivation, setMotivation] = useState('');
    const [motivationError, setMotivationError] = useState('');
    const [toasts, setToasts] = useState([]);

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
        setMotivation('');
        setMotivationError('');
    };

    const addToast = (message, variant = 'info') => {
        const id = Date.now(); // Unique ID for each toast
        setToasts((prevToasts) => [...prevToasts, { id, message, variant }]);
    };

    const handleSubmit = () => {
        let isValid = true;
        if (!motivation.trim()) {
            setMotivationError('Motivation is required');
            isValid = false;
        } else {
            setMotivationError('');
        }

        if (isValid) {
            console.log('Form submitted:', { motivation });
            // alert("Form Submitted"); // Replace alert with toast
            addToast('Form submitted successfully!', 'success'); // Show success toast
            closeModal();
        }
    };

    return (
        <>
            <div className="justify-around justify-items-center inline-grid grid-cols-1 md:grid-cols-3 gap-16 mx-auto">
                {cards.map((card) => (
                    <GlareCard
                        enabled={card.src}
                        key={card.id}
                        className="relative flex flex-col items-center justify-center"
                        cardData={card}
                        onClick={() => openModal(card)}
                    />
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedCard?.title || "Card Details"}
                imageUrl={selectedCard?.src}
            >
                {selectedCard && (
                    <>
                        <div className="mb-4">
                            <p className="text-gray-700 text-base">
                                {selectedCard.description}
                            </p>
                            <br />
                            <p className="text-sm text-gray-600">
                                <strong className='text-primary-light '>Date:</strong> {selectedCard.date || "TBD"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong className='text-primary-light '>Location:</strong> {selectedCard.location || "TBD"}
                            </p>
                        </div>
                        <Input
                            label="Motivation"
                            placeholder="Why are you interested in this event?"
                            type="textarea"
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            error={motivationError}
                            required
                        />
                        <div className="flex justify-end mt-6">  {/* Consistent spacing */}
                            <Button onClick={handleSubmit} color1="#FDA916" text="Submit" />
                        </div>
                    </>
                )}
            </Modal>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    variant={toast.variant}
                />
            ))}
        </>
    );
}

export const GlareCard = ({
    enabled,
    className,
    cardData,
    onClick
}) => {
    const isPointerInside = useRef(false);
    const refElement = useRef(null);
    const state = useRef({
        glare: { x: 50, y: 50 },
        background: { x: 50, y: 50 },
        rotate: { x: 0, y: 0 },
    });

    const containerStyle = {
        "--m-x": "50%",
        "--m-y": "50%",
        "--r-x": "0deg",
        "--r-y": "0deg",
        "--bg-x": "50%",
        "--bg-y": "50%",
        "--duration": "300ms",
        "--foil-size": "100%",
        "--opacity": "0",
        "--radius": "48px",
        "--easing": "ease",
        "--transition": "var(--duration) var(--easing)"
    };

    const backgroundStyle = {
        "--step": "5%",
        "--foil-svg": `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' strokeLinecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")`,
        "--pattern": "var(--foil-svg) center/100% no-repeat",
        "--rainbow":
            "repeating-linear-gradient( 0deg,rgb(115, 239, 255) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
        "--diagonal":
            "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        "--shade":
            "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        backgroundBlendMode: "hue, hue, hue, overlay",
    };

    const updateStyles = () => {
        if (refElement.current) {
            const { background, rotate, glare } = state.current;
            refElement.current.style.setProperty("--m-x", `${glare.x}%`);
            refElement.current.style.setProperty("--m-y", `${glare.y}%`);
            refElement.current.style.setProperty("--r-x", `${rotate.x}deg`);
            refElement.current.style.setProperty("--r-y", `${rotate.y}deg`);
            refElement.current.style.setProperty("--bg-x", `${background.x}%`);
            refElement.current.style.setProperty("--bg-y", `${background.y}%`);
        }
    };

    const handlePointerMove = (event) => {
        if (!refElement.current) return;

        const rotateFactor = 0.4;
        const rect = refElement.current.getBoundingClientRect();
        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        const percentage = {
            x: (100 / rect.width) * position.x,
            y: (100 / rect.height) * position.y,
        };
        const delta = {
            x: percentage.x - 50,
            y: percentage.y - 50,
        };

        const { background, rotate, glare } = state.current;
        background.x = 50 + percentage.x / 8 - 6.25;
        background.y = 50 + percentage.y / 6 - 8.33;
        rotate.x = -(delta.y / 3.5) * rotateFactor;
        rotate.y = (delta.x / 2) * rotateFactor;
        glare.x = percentage.x;
        glare.y = percentage.y;

        updateStyles();
    }

    const handlePointerEnter = () => {
        isPointerInside.current = true;
        if (refElement.current) {
            setTimeout(() => {
                if (isPointerInside.current) {
                    refElement.current.style.setProperty("--duration", "0s");
                }
            }, 300);
        }
    }

    const handlePointerLeave = () => {
        isPointerInside.current = false;
        if (refElement.current) {
            refElement.current.style.removeProperty("--duration");
            refElement.current.style.setProperty("--r-x", `0deg`);
            refElement.current.style.setProperty("--r-y", `0deg`);
            refElement.current.style.setProperty("--bg-x", "50%");
            refElement.current.style.setProperty("--bg-y", "50%");
        }
    }

    return (
        <div
            style={containerStyle}
            className={cn(
                "relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-transform w-50 h-72 lg:h-96 [aspect-ratio:17/21]", //Fixed height and width
                className
            )}
            ref={refElement}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}

        >
            <div
                onClick={enabled ? onClick : undefined}
                className={`w-full h-full grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] [transform:rotateY(var(--r-y))_rotateX(var(--r-x))] rounded-[var(--radius)] border border-slate-800 hover:[--opacity:0.2] hover:[--duration:200ms] hover:[--easing:linear] hover:filter-none ${enabled ? "hover:cursor-pointer group active:duration-100" : ""}`}
            >
                <div className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clipPath:inset(0_0_0_0_round_var(--radius))]">
                    <div className={cn("h-full w-full bg-primary-dark")}>
                        {cardData.src ? (
                            <div className="relative w-full h-full group">
                                <Image
                                    height={300}
                                    width={300}
                                    src={cardData.src}
                                    alt={cardData.title}
                                    className="w-full h-full object-cover transition duration-500 ease-in-out"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-500">
                                    <h2 className="text-secondary-dark font-black text-3xl drop-shadow-md opacity-0 group-hover:-translate-y-2 transition-transform duration-300 ease-in-out group-hover:opacity-100">
                                        {cardData.title}
                                    </h2>
                                    <p className="text-gray-300 text-center font-medium mt-2 drop-shadow-md opacity-0 group-hover:-translate-y-2 transition-transform duration-300 ease-in-out group-hover:opacity-100">
                                        {cardData.description}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    stroke="currentColor"
                                    strokeWidth="15"
                                    strokeMiterlimit="3.86874"
                                    strokeLinecap="round"
                                    className="w-20 h-20 text-slate-300"
                                    viewBox="0 0 320 512">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                                </svg>
                                <h2 className="text-slate-300 font-bold pt-8 text-xl">
                                    {cardData.title}
                                </h2>
                                <p className="text-slate-500 font-bold pt-8">
                                    {cardData.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clipPath:inset(0_0_1px_0_round_var(--radius))] opacity-[var(--opacity)] transition-opacity transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)]" />
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-[var(--opacity)] will-change-background transition-opacity [clipPath:inset(0_0_1px_0_round_var(--radius))] [background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] relative after:content-[''] after:grid-area-[inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit] after:bg-[inherit] after:mix-blend-exclusion after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-blend-mode:soft-light,_hue,_hard-light]"
                    style={{ ...backgroundStyle }} />
            </div>
        </div>
    );
};