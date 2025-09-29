"use client";

import React from 'react';
import { IconArrowBackUp } from "@tabler/icons-react";
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image'

// Removed unused imports

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {

    const unwrappedParams = React.use(params);
    const id = unwrappedParams?.id;

    const [event, setEvent] = useState<any>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [allImages, setAllImages] = useState<string[]>([]);

    useEffect(() => {
        // ... (fetch logic remains the same)
        const fetchevent = async () => {
            const supabase = createClient();
            if (!id) {
                setFetchError('Event ID is missing.');
                setEvent(null);
                setAllImages([]);
                return;
            }
            setFetchError(null);
            setEvent(null);
            setAllImages([]);

            try {
                const { data, error } = await supabase
                    .from('Events')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (data) {
                    const eventData = { ...data };
                    // console.log('event :', eventData);
                    setEvent(eventData);

                    const combinedImages = [
                        eventData.mainPicture,
                        ...(eventData.pictures || [])
                    ].filter(img => img && typeof img === 'string' && img.trim() !== '');
                    setAllImages(combinedImages);

                    setFetchError(null);
                } else {
                    setFetchError(`Event with ID ${id} not found.`);
                    setEvent(null);
                    setAllImages([]);
                }
            } catch (error) {
                setFetchError('Could not fetch the event!');
                setEvent(null);
                setAllImages([]);
                // console.error('Fetch error:', error);
            }
        };
        fetchevent();
    }, [id]);


    // --- Skeleton Styling ---
    const skeletonBaseClass = "bg-gray-300 rounded animate-pulse";
    const darkSkeletonBaseClass = "bg-gray-500/50 rounded animate-pulse";

    // --- Image Collage Renderer (Keep from previous version) ---
    const renderImageCollage = (images: string[]) => {
        const count = images.length;
        const ImageItem = ({ src, className = '' }: { src: string; className?: string }) => (
            <div className={`relative w-full h-full overflow-hidden rounded-md ${className}`}>
                <Image
                    src={src}
                    height={500}
                    width={500}
                    alt={`Event image ${images.indexOf(src) + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    loading="lazy"
                />
            </div>
        );

        if (count === 0) {
            return <p className="text-center text-gray-500 italic">No images available for this event.</p>;
        }

        let gridClasses = 'grid gap-2 md:gap-4 mt-auto';
        let containerAspect = 'aspect-[4/3]';

        if (count === 1) {
            gridClasses += ' grid-cols-1 grid-rows-1';
        } else if (count === 2) {
            gridClasses += ' grid-cols-1 grid-rows-2';
        } else if (count === 3) {
            gridClasses += ' grid-cols-3 grid-rows-2';
            containerAspect = 'aspect-[16/9]';
        } else if (count === 4) {
            gridClasses += ' grid-cols-2 grid-rows-2';
            containerAspect = 'aspect-square';
        } else { // 5 or more images
            gridClasses += ' grid-cols-6 grid-rows-2';
            containerAspect = 'aspect-[16/9]';
        }

        return (
            // Added margin-bottom to space it from potential following content
            <div className={`${gridClasses} w-full ${containerAspect} mb-12 md:mb-16`}>
                {images.slice(0, 5).map((img: string, index: number) => {
                    const rules: Record<string, string> = {
                        "3-0": "col-span-2 row-span-2",
                        "3-1": "col-span-1 row-span-1",
                        "3-2": "col-span-1 row-span-1",
                        "5-0": "col-span-3 row-span-1",
                        "5-1": "col-span-3 row-span-1",
                        "5-2": "col-span-2 row-span-1",
                        "5-3": "col-span-2 row-span-1",
                        "5-4": "col-span-2 row-span-1",
                    };

                    const key = `${count >= 5 ? 5 : count}-${index}`;
                    const itemClasses = rules[key] || "";

                    return <ImageItem key={img || index} src={img} className={itemClasses} />;
                })}
            </div>

        );
    };


    // --- Main Render ---
    return (
        <div className="relative min-h-screen flex flex-col"> {/* Use Flex column for header + content */}

            {/* Header Section (Gradient) - Stays as is */}
            <div className="p-8 pb-12 bg-gradient-to-br from-primary-dark to-primary-light flex-shrink-0"> {/* flex-shrink-0 prevents header shrinking */}
                <Link href="/events" className='z-40 inline-block'>
                    <IconArrowBackUp className="z-40 my-4 ml-4 text-primary-dark h-12 w-12 p-2 flex-shrink-0 bg-white rounded-full hover:bg-gray-100 transition-colors" />
                </Link>

                {/* Event Name, Brief, Date/Location */}
                <div className="text-center mb-4">
                    {event ? <h1 className="text-2xl w-full vsm:text-3xl sm:text-5xl lg:text-7xl font-bold text-secondary-dark">{event.name}</h1> : !fetchError ? <div className={`${darkSkeletonBaseClass} h-10 w-3/4 sm:h-14 lg:h-20 mx-auto`}></div> : <h1 className="text-2xl w-full vsm:text-3xl sm:text-5xl lg:text-7xl font-bold text-secondary-dark">&quotOh ooh!&quot</h1>}
                </div>
                <div className="text-center mb-2">
                    {event ? <h2 className="text-white w-full text-md vsm:text-lg sm:text-xl lg:text-3xl font-semibold">{event.brief}</h2> : !fetchError ? <div className={`${darkSkeletonBaseClass} h-6 w-1/2 sm:h-8 lg:h-10 mx-auto bg-white/40`}></div> : null}
                </div>
                <div className="text-center mb-0">
                    {event ? <h3 className="text-slate-400 w-full text-xs vsm:text-sm sm:text-base lg:text-lg font-medium">{event.date} | {event.location}</h3> : !fetchError ? <div className={`${darkSkeletonBaseClass} h-4 w-1/3 sm:h-5 lg:h-6 mx-auto bg-slate-400/50`}></div> : null}
                </div>
            </div>

            <div className="flex-grow w-full flex justify-center bg-gray-100"> {/* flex-grow takes remaining vertical space, bg-gray-100 for margins */}

                <div className="w-full max-w-7xl bg-white border-x border-gray-300 flex flex-col"> {/* max-w-7xl or adjust as needed, border-x adds left/right borders */}

                    {fetchError && !event && (
                        <div className='flex justify-center flex-col items-center '>
                            <div className="py-16 px-8 text-xl text-center text-slate-500 font-bold">{fetchError}</div>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
                            >
                                Return To Events
                            </Link>
                        </div>
                    )}

                    {(event || !fetchError) && (
                        <div className="px-8 py-12 md:px-12 md:py-16 flex-grow">

                            {/* Description Area */}
                            <div className="mb-12 md:mb-16 max-w-4xl mx-auto"> {/* Constrain text width */}
                                {event ? (
                                    event.description ? (
                                        <p className='text-lg leading-relaxed text-gray-700'>
                                            {event.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">No description available.</p>
                                    )
                                ) : (
                                    // Description Skeleton
                                    <div className="space-y-3">
                                        <div className={`${skeletonBaseClass} h-5 w-1/4`}></div>
                                        <div className={`${skeletonBaseClass} h-4 w-full`}></div>
                                        <div className={`${skeletonBaseClass} h-4 w-full`}></div>
                                        <div className={`${skeletonBaseClass} h-4 w-5/6`}></div>
                                        <div className={`${skeletonBaseClass} h-4 w-3/4`}></div>
                                    </div>
                                )}
                            </div>

                            {/* Image Collage Area */}
                            <div className="max-w-6xl mx-auto mt-auto">
                                {event ? (
                                    renderImageCollage(allImages) // Render the actual collage
                                ) : (
                                    <div className={`${skeletonBaseClass} w-full h-64 md:h-96 rounded-md mb-12 md:mb-16`}></div>
                                )}
                            </div>

                            {/* Add more content sections here within the white area if needed */}

                        </div> // End padding div
                    )}
                </div> {/* End Central White Content Column */}

            </div> {/* End Main Content Area with Margins */}
        </div> // End relative min-h-screen
    );
}