"use client";

import { cn } from "../lib/utils";
import React, { useEffect, useState, useCallback } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const getDirection = useCallback((direction) => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  }, []);

  const getSpeed = useCallback((speed) => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  }, []);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      containerRef.current.style.setProperty("--font-family", "Poppins");
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection(direction);
      getSpeed(speed);
      setStart(true);
    }
  }, [getDirection, getSpeed, direction, speed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  const [start, setStart] = useState(false);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 h-full w-screen max-w-7xl overflow-x-hidden overflow-y-visible [mask-image:linear-gradient(to_right,transparent,#eef1f6_10%,#eef1f6_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-14 w-max flex-nowrap", 
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items?.map((item) => ( 
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px] hover:-translate-y-10 transition-transform duration-300 ease-in-out"
            style={{
              background: "linear-gradient(180deg, #1e293b, #0f172a)",
              fontFamily: "monospace"
            }}
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className=" relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-secondary-dark font-semibold text-sm leading-[1.6]">
                    {item.name}
                  </span>
                  <span className=" text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
