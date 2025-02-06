"use client";

import React from "react";
import Image from "next/image";
import EventsGallery from "@/widgets/Events/EventsGallery";

import { UpcomingEvents } from "@/widgets/Events/UpcomingEvents";
import { TypewriterEffectDemo } from "@/components/Typewriter-effect";
import { Button } from "@/components/Button";
import LogoSlider from "@/components/logoSlider";

const image1 = "/Assets/Hero/2.jpg";

const image2 = "/Assets/Companies/Ooredoo.png";
const image3 = "/Assets/Companies/Ooredoo.png";
const image4 = "/Assets/Companies/Ooredoo.png";
const image5 = "/Assets/Companies/Ooredoo.png";
const image6 = "/Assets/Companies/Ooredoo.png";


const images = [image2, image3, image4, image5, image6];

const Events = () => {

  const words1 = [
    { text: "Discover " },
    { text: "New " },
    { text: "Horizons.", className: "text-secondary-light dark:text-secondary-light" },
  ];



  return (
    <>

      <div className="relative w-full h-screen">
        <Image
          src={image1}
          alt="Events"
          width={1200}
          height={1200}
          priority
          className="object-cover w-full h-full brightness-75"
        />

        {/* Centered content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-9xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-200 text-center font-poppins tracking-wide">
            Explore Our Events!
          </h1>

          {/* TODO : Fix the scroll down button issue */}
          <Button
            variant="outline"
            size="lg"
            className="text-foreground hover:text-primary-foreground z-40"
            aria-label="Login to account"
            text="I'm Ready!"
            link="#upcoming"
          />

        </div>
        {/* Vignette overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
        {/* Light gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Lens blur effect */}
        <div className="absolute inset-0 z-10 backdrop-blur-[2px]" />
      </div>

      <div className="relative h-full w-screen my-16">
        <LogoSlider images={images} />
      </div>

      {/* Upcoming Events */}
      <UpcomingEvents id="upcoming" />

      {/* General Even.ts */}
      <TypewriterEffectDemo words={words1} className={"text-lg"} />
      <EventsGallery />

    </>
  );
};

export default Events;
