import React from "react";
import { Timeline } from "@/components/Timeline";
import Image from "next/image";
import image1 from "../../../public/Assets/Hero/14.jpg";

export function TimelineDemo() {
  const data = [
    {
      title: "October 2024",
      content: (
        <div>
          <p className="text-xs md:text-sm font-normal mb-8 text-[#102a4d]">
            Opening Day ignited our collective vision, bringing together
            passionate visionaries, innovative thinkers, and aspiring
            professionals. This transformative event celebrated new beginnings,
            fostered ambitious goals, and sparked powerful collaborations that
            will shape our future&apos;s trajectory.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={image1}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
              hover:scale-105 
              hover:shadow-lg 
              cursor-pointer"
            />
          </div>
        </div>
      ),
    },
    {
      title: "May 2024",
      content: (
        <div>
          {/* <p
            className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p> */}
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8 mt-20">
            IGNITE emerged as our flagship event, meticulously designed to
            bridge the gap between ambitious students and innovative
            enterprises. Through intensive networking, comprehensive training,
            and strategic collaborations, we created an ecosystem that propels
            professional development and unlocks unprecedented opportunities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={image1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="cards template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8 mt-20">
            NETLIXIX represents our strategic career empowerment initiative,
            dedicated to transforming potential into professional excellence.
            Through expert-led workshops, we equipped future professionals with
            cutting-edge strategies for crafting compelling CVs, mastering
            interview techniques, and building unshakeable confidence in their
            career journeys.
          </p>
          {/* <div className="mb-8">
            <div
              className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Card grid component
            </div>
            <div
              className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Startup template Aceternity
            </div>
            <div
              className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Random file upload lol
            </div>
            <div
              className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div
              className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Salman Bhai Fan Club registrations open
            </div>
          </div> */}
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={image1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
              hover:scale-105 
              hover:shadow-lg 
              cursor-pointer"
            />
            <Image
              src={image1}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
  hover:scale-105 
  hover:shadow-lg 
  cursor-pointer"
            />
            <Image
              src={image1}
              alt="cards template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]transition-transform duration-300 ease-in-out 
              hover:scale-105 
              hover:shadow-lg 
              cursor-pointer"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
