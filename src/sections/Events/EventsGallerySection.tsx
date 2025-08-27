"use client";

import { useRef, useState, useEffect } from "react";
import { ExpandableCardDemo } from "@/components/events/ExpandableCards";
import supabase from '@/config/supabaseClient';
import { motion } from "motion/react";
import type { EventCard } from "@/types/events";

type EventRow = {
	id: number | string;
	name?: string | null;
	mainPicture?: string | null;
	description?: string | null;
	brief?: string | null;
	date?: string | null;
};


const EventsGallery = () => {
	const ref = useRef<HTMLParagraphElement | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [Events, setEvents] = useState<EventCard[] | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);

	useEffect(() => {
		const fetchEvent = async () => {
			setLoading(true);
			try {
				const { data, error } = await supabase.from('Events').select('*');
				if (error) {
					setFetchError('Could not fetch the Events!');
					setEvents(null);
					return;
				}
				if (data) {
					const events: EventCard[] = data
						.map(({ id, name, mainPicture, description, brief, date }) => ({
							id: String(id),
							title: name ?? '',
							src: mainPicture ?? null,
							description: brief ?? '',
							content: description ?? '',
							ctaText: "Learn More",
							ctaLink: `/events/${id}`,
							event_date: date ?? '',
						}))
						.filter(event => event.src && event.src.trim() !== "")
						.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
					setEvents(events);
					setFetchError(null);
				} else {
					setEvents(null);
				}
			} catch {
				setFetchError('Could not fetch the Events!');
				setEvents(null);
			} finally {
				setLoading(false);
			}
		};
		fetchEvent();
	}, []);

	return (
		<>
			<svg className="-z-10 translate-y-2" width="100%" height="192" viewBox="0 0 960 192" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
				<g clipPath="url(#clip0_505_1163)">
					<path d="M0 45.0004L32 45.5004C64 46.0004 128 47.0004 192 43.5004C256 40.0004 320 32.0004 384 31.7004C448 31.3004 512 38.7004 576 35.0004C640 31.3004 704 16.7004 768 11.5004C832 6.30037 896 10.7004 928 12.8004L960 15.0004V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V45.0004Z" fill="#1C2D75" />
					<path d="M0 101L32 100.8C64 100.7 128 100.3 192 93.3C256 86.3 320 72.7 384 68.3C448 64 512 69 576 74C640 79 704 84 768 82.7C832 81.3 896 73.7 928 69.8L960 66V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V101Z" fill="#0F1F4E" />
					<path d="M0 129L32 133.2C64 137.3 128 145.7 192 148.8C256 152 320 150 384 151.5C448 153 512 158 576 155.5C640 153 704 143 768 135C832 127 896 121 928 118L960 115V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V129Z" fill="#0A1029" />
				</g>
				<defs>
					<clipPath id="clip0_505_1163">
						<rect width="100%" height="192" fill="white" />
					</clipPath>
				</defs>
			</svg>
			<div className="Events__Gallery flex flex-col justify-center min-h-screen w-screen bg-primary-dark overflow-x-hidden lg:px-16 pb-16">
				<motion.h1 className="text-secondary-dark text-4xl sm:text-5xl lg:text-7xl font-black text-center py-20">
					Events Gallery
				</motion.h1>

				{Events && Events.length > 0 ? (
					<ExpandableCardDemo cards={Events} />
				) : loading ? (
					<p ref={ref} className="text-2xl font-bold text-slate-700 text-center">Loading Evnets...</p>
				) : <p className="text-2xl font-bold text-slate-700 text-center">{fetchError ? 'There was an error fetching the events' : 'No Events found yet!'}</p>
				}
			</div>
			<svg className="scale-x-[-1] scale-y-[-1] -translate-y-2 -z-10 mb-80" width="100%" height="192" viewBox="0 0 960 192" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
				<g clipPath="url(#clip0_505_1163)">
					<path d="M0 45.0004L32 45.5004C64 46.0004 128 47.0004 192 43.5004C256 40.0004 320 32.0004 384 31.7004C448 31.3004 512 38.7004 576 35.0004C640 31.3004 704 16.7004 768 11.5004C832 6.30037 896 10.7004 928 12.8004L960 15.0004V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V45.0004Z" fill="#1C2D75" />
					<path d="M0 101L32 100.8C64 100.7 128 100.3 192 93.3C256 86.3 320 72.7 384 68.3C448 64 512 69 576 74C640 79 704 84 768 82.7C832 81.3 896 73.7 928 69.8L960 66V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V101Z" fill="#0F1F4E" />
					<path d="M0 129L32 133.2C64 137.3 128 145.7 192 148.8C256 152 320 150 384 151.5C448 153 512 158 576 155.5C640 153 704 143 768 135C832 127 896 121 928 118L960 115V193H928C896 193 832 193 768 193C704 193 640 193 576 193C512 193 448 193 384 193C320 193 256 193 192 193C128 193 64 193 32 193H0V129Z" fill="#0A1029" />
				</g>
				<defs>
					<clipPath id="clip0_505_1163">
						<rect width="100%" height="192" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</>
	);
};

export default EventsGallery;