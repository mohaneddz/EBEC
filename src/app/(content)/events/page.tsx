import EventsGallery from "@/sections/Events/EventsGallerySection";
import UpcomingEventsSection from "@/sections/Events/UpcomingEventsSection";
import EventsHeroSection from "@/sections/Events/EventsHeroSection";
import EventTypesSection from "@/sections/Events/EventTypesSection";

import LogoSliderSection from "@/sections/Events/LogoSliderSection";

export default function Events() {


  return (
    <>
      <EventsHeroSection />
      <LogoSliderSection />
      <UpcomingEventsSection />
      <EventTypesSection />
      <EventsGallery />
    </>
  );
};
