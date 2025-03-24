"use client";

import React, { createContext, useRef, useContext } from "react";

import EventsGallery from "@/widgets/Events/EventsGallerySection";
import UpcomingEventsSection from "@/widgets/Events/UpcomingEventsSection";
import EventsHeroSection from "@/widgets/Events/EventsHeroSection";
import LogoSliderSection from "@/components/LogoSliderSection";
import EventTypesSection from "@/widgets/Events/EventTypesSection";

export const ScrollContext = createContext(null);

const Events = () => {

  const upcomingEventsRef = useRef(null);

  const scrollToUpcomingEvents = () => {
    if (upcomingEventsRef.current) {
      upcomingEventsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (

    <ScrollContext.Provider value={scrollToUpcomingEvents}>

      {/* Hero Section */}
      <EventsHeroSection />

      {/* Sponsors */}
      <LogoSliderSection />

      {/* Upcoming Events - Assign the ref */}
      <UpcomingEventsSection id={"upcoming"} ref={upcomingEventsRef} />

      {/* EventTypes */}
      <EventTypesSection />

      {/* General Events */}
      <EventsGallery />

    </ScrollContext.Provider>
  );
};

export default Events;