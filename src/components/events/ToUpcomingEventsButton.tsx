"use client";

import { Button } from "@/components/global/Button";

export default function ToUpcomingEventsButton() {

    const scrollToUpcomingEvents = () => {
        const el = document.getElementById("upcomingEvents");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        else{
            window.scrollBy({ top: window.innerHeight * 2.2, behavior: "smooth" });
        }
    };

    return (

        <Button
            className="text-foreground z-40"
            aria-label="Scroll to Upcoming Events"
            text="I'm Ready!"
            onClick={scrollToUpcomingEvents}
        />
    );
};
