"use client";

import React from "react";
import EventsGallery from "@/widgets/Events/EventsGallery";
import { TimelineDemo } from "@/widgets/Events/TimeLineDemo";
import { UpcomingEvents } from "@/widgets/Events/UpcomingEvents";
import { TypewriterEffectDemo } from "@/components/Typewriter-effect";

const Events = () => {

  const words1 = [
    { text: "Discover " },
    { text: "New " },
    { text: "Horizons.", className: "text-secondary-light dark:text-secondary-light" },
  ];

  const words2 = [
    { text: "Stay " },
    { text: "Up" },
    { text: "To" },
    { text: "Date.", className: "text-secondary-light dark:text-secondary-light" },
  ];

  // const words3 = [
  //   { text: "Discover " },
  //   { text: "New " },
  //   { text: "Horizons.", className: "text-secondary-light dark:text-secondary-light" },
  // ];

  return (
    <>
      {/* General Events */}
      <TypewriterEffectDemo words={words1} className={"text-lg"} />
      <EventsGallery />

      {/* Upcoming Events */}
      <TypewriterEffectDemo words={words2} className={"text-lg"} />
      <UpcomingEvents />

      {/* Past Roadmap */}
      {/* <TypewriterEffectDemo words={words3} className={"text-lg"} /> */}
      <TimelineDemo />
    </>
  );
};

export default Events;
