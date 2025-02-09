"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/Infinite-moving-cards";
import { TextGenerateEffect } from "@/components/TextGenerator";

export default function InfiniteMovingCardsSection() {
  return (

    <div id="InfiniteMovingCardsSection"
      className="w-full bg-gradient-to-br from-slate-50 to-slate-200 ">

      <TextGenerateEffect
        words="Trusted by Many"
        className="my-16 md:my-40 text-xl sm:text-2xl md:text-3xl lg:text-9xl text-center font-bold"
        color={"primary-light"}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 rounded-md flex flex-col antialiased items-center justify-center mb-40 ">
        
        <div className="w-full max-w-7xl overflow-y-visible">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div>

      </div>

    </div>

  );
}

const testimonials = [
  {
    quote:
      "This club is an amazing platform for students to develop their professional skills and network with industry leaders. Truly inspiring!",
    name: "Aya Malak",
    title: "A Platform for Professional Growth",
  },
  {
    quote:
      "I love how the club fosters innovation and entrepreneurship while providing real-world opportunities like IGNITE. Great work!",
    name: "Abdennour",
    title: "Innovation and Real-World Opportunities",
  },
  {
    quote:
      "Being part of this business club has been a game-changer. The events and training sessions are top-notch and highly motivating.",
    name: "Ismail",
    title: "A Game-Changer for Students",
  },
  {
    quote:
      "This club creates a strong community of aspiring professionals and mentors, making it the perfect environment for growth and collaboration.",
    name: "Mohamed",
    title: "A Strong Community for Collaboration",
  },
  {
    quote:
      "What sets this business club apart is its focus on connecting students with real opportunities. It's the perfect blend of learning and networking!",
    name: "Meriem",
    title: "The Perfect Blend of Learning and Networking",
  },
];
