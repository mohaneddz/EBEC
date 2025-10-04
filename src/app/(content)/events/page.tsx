import EventsGallery from "@/sections/Events/EventsGallerySection";
import UpcomingEventsSection from "@/sections/Events/UpcomingEventsSection";
import EventsHeroSection from "@/sections/Events/EventsHeroSection";
import ActivitiesSection from "@/sections/Events/ActivitiesSection";

import LogoSliderSection from "@/sections/Events/LogoSliderSection";

export default function Events() {


  return (
    <>
      <EventsHeroSection />
      <LogoSliderSection />
      <UpcomingEventsSection />
      <ActivitiesSection />
      <EventsGallery />
    </>
  );
};
