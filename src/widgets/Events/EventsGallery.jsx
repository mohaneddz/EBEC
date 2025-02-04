"use client";

import { useRef, useState, useEffect } from "react";
import { ExpandableCardDemo } from "@/components/ExpandableCards";
import supabase from '@/config/supabaseClient';

const EventsGallery = () => {
    useRef(null);
    const [Events, setEvents] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            const { data, error } = await supabase.from('Event').select('*');

            if (error) {
                setFetchError('Could not fetch the Events!');
                setEvents(null);
                console.log('Fetch error:', error);
            }
            if (data) {
                const events = data
                    .map(({ id, title, src, description, content, event_date }) => ({
                        id,
                        title,
                        src,
                        description,
                        content,
                        ctaText: "Learn More",
                        ctaLink: `/events/${id}`,
                        event_date,
                    }))
                    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
                setEvents(events);
                setFetchError(null);
            }
        };
        fetchEvent();
    }, []);

    return (
        <div className="Events__Gallery flex justify-around w-screen bg-gradient-to-tr from-secondary-600 to-secondary-500 mb-80">            {
            Events && (
                < ExpandableCardDemo cards={Events} />
            )
        }

        </div>
    );
};

export default EventsGallery;
