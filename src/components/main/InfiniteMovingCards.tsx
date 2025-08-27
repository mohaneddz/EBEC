"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState, useCallback, useRef } from "react";

type InfiniteMovingCardItem = {
  name: string;
  quote: string;
  title: string;
};

type InfiniteMovingCardsProps = {
  items: InfiniteMovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  const getDirection = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }, [direction]);

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      let duration;
      if (speed === "fast") {
        duration = "20s";
      } else if (speed === "normal") {
        duration = "40s";
      } else {
        duration = "80s";
      }
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  }, [speed]);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current && !start) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDirection, getSpeed, direction, speed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  useEffect(() => {
    setStart(false);
    if (scrollerRef.current) {
      const timeoutId = setTimeout(() => addAnimation(), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [items, addAnimation]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        "max-w-7xl",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 py-4 w-max flex-nowrap",
          "gap-4 sm:gap-6 md:gap-8",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items?.map((item, index) => (
          <li
            className={cn(
              "relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700",
              "w-[90vw] max-w-full sm:w-[350px] md:w-[400px] lg:w-[450px]",
              "px-6 py-5 sm:px-8 sm:py-6",
              "hover:-translate-y-1 transition-transform duration-200 ease-in-out"
            )}
            style={{
              background: "linear-gradient(180deg, #1e293b, #0f172a)",
              fontFamily: "monospace",
            }}
            key={item.name || `card-${index}`}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className=" relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-4 sm:mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className=" text-sm font-medium text-secondary-dark">
                    {item.name}
                  </span>
                  <span className=" text-xs sm:text-sm leading-[1.6] text-gray-400 font-normal">
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