"use client";

import { Button } from "@/components/global/Button";

export default function ToUpcomingEventsButton() {

    const scrollToUpcomingEvents = () => {
        const el = document.getElementById("upcomingEvents");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (

        <Button
            className="text-foreground hover:text-primary-foreground z-40"
            aria-label="Scroll to Upcoming Events"
            text="I'm Ready!"
            onClick={scrollToUpcomingEvents}
        />
    );
};
