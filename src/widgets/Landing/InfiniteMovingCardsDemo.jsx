"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/Infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 rounded-md flex flex-col antialiased items-center justify-center overflow-hidden">
      {/* <div className="h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden m-0 p-0"> */}
        {/* <h1 className="text-3xl font-bold text-center mt-12 mb-8 text-[--midnight-navy]">
          Voices from Our Community
        </h1> */}
        {/* <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        /> */}
      {/* </div> */}
      <div className="w-full max-w-7xl">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          className="w-full"
        />
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
