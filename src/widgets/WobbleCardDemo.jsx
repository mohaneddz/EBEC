"use client";

import React from "react";
import Image from "next/image";
import Image1 from "../../public/Assets/Hero/8.jpg";
import { WobbleCard } from "../components/Wobble-card";

export default function WobbleCardDemo() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <WobbleCard
          containerClassName="col-span-1 md:col-span-2 lg:col-span-2 h-full bg-pink-800 min-h-[300px] md:min-h-[400px] lg:min-h-[300px]"
          backgroundImage={Image1}
        >
          <div className="max-w-xs md:max-w-md">
            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Opening Day
            </h2>
            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-neutral-200">
              Opening Day marks the launch of our dynamic journey, bringing
              together visionaries, innovators, and aspiring professionals to
              celebrate new beginnings, set goals, and ignite collaborations for
              a successful future.
            </p>
          </div>
        </WobbleCard>
        <WobbleCard
          containerClassName="col-span-1 min-h-[250px] md:min-h-[300px]"
          backgroundImage={Image1}
        >
          <div className="w-full">
            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              NETLIXIX
            </h2>
            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-neutral-200">
              Empowering future professionals with expert tips on crafting
              standout CVs and acing interviews, fostering confidence and growth.
            </p>
          </div>
        </WobbleCard>
        <WobbleCard
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-900 min-h-[400px] md:min-h-[500px] lg:min-h-[300px]"
          backgroundImage={Image1}
        >
          <div className="max-w-xs md:max-w-md">
            <h2 className="text-left text-balance text-lg md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              IGNITE EVENT
            </h2>
            <p className="mt-2 md:mt-4 text-left text-sm md:text-base text-neutral-200">
              IGNITE, our flagship event, connects aspiring interns with
              innovative enterprises through networking, training, and
              collaboration, fostering growth and opportunity for all
              participants.
            </p>
          </div>
        </WobbleCard>
      </div>
    </>
  );
}
