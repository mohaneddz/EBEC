"use client";

import { cn } from "../../lib/utils"; // Ensure this path is correct
import React, { useEffect, useState, useCallback, useRef } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  // --- Hooks for setting direction and speed ---
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
      } else { // slow
        duration = "80s";
      }
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  }, [speed]);

  // --- Hook for initializing animation ---
  const addAnimation = useCallback(() => {
    // Check if refs are available and animation hasn't started
    if (containerRef.current && scrollerRef.current && !start) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate items for seamless looping
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        // Add aria-hidden to duplicated items for accessibility
        duplicatedItem.setAttribute("aria-hidden", true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection(); // Set animation direction via CSS var
      getSpeed();     // Set animation speed/duration via CSS var
      setStart(true); // Add the animation class to start scrolling
    }
    // Intentionally avoiding 'start' in dependency array to prevent re-running duplication
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDirection, getSpeed, direction, speed]); // Re-run if props change

  // --- Effect to run animation setup ---
  useEffect(() => {
    addAnimation();
  }, [addAnimation]); // Re-run addAnimation if its definition changes (due to props)

  // --- Effect to reset animation if items change ---
  // Optional: If you want the animation to reset/rebuild when 'items' prop changes
  useEffect(() => {
    // Reset state and clear previous items if needed (optional, depends on desired behavior)
    setStart(false);
    if (scrollerRef.current) {
      // A simple way to reset is to remove duplicated nodes, but might be complex.
      // A more robust way might involve clearing innerHTML and re-running addAnimation.
      // For simplicity, let's just re-trigger addAnimation. It handles duplication check implicitly.
      // NOTE: This might cause a visual flicker if items change frequently.
      // Consider a more advanced diffing strategy if needed.
      const timeoutId = setTimeout(() => addAnimation(), 0); // Run on next tick
      return () => clearTimeout(timeoutId);
    }
  }, [items, addAnimation]); // Re-run if items or addAnimation change


  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        "max-w-7xl",
        className // Allow overriding/extending styles
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // Flex layout: nowrap ensures single line, w-max fits content
          "flex min-w-full shrink-0 py-4 w-max flex-nowrap",
          // Responsive gap between items
          "gap-4 sm:gap-6 md:gap-8",
          // Animation class applied conditionally
          start && "animate-scroll",
          // Pause on hover behavior
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items?.map((item, index) => ( // Added index for potential key fallback
          <li
            className={cn(
              // Card base styles: background is set via inline style below
              "relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700",
              // *** RESPONSIVE WIDTH ***
              // Use viewport width for very small screens, then fixed sizes for larger screens
              "w-[90vw] max-w-full sm:w-[350px] md:w-[400px] lg:w-[450px]",
              // *** RESPONSIVE PADDING ***
              "px-6 py-5 sm:px-8 sm:py-6",
              // Subtle hover effect
              "hover:-translate-y-1 transition-transform duration-200 ease-in-out" // Reduced effect slightly
            )}
            style={{
              background: "linear-gradient(180deg, #1e293b, #0f172a)",
              fontFamily: "monospace" // Kept from original, adjust if needed
            }}
            // Use a unique key, fallback to index if name isn't guaranteed unique
            key={item.name || `card-${index}`}
          >
            <blockquote>
              {/* Decorative element (kept from original) */}
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              {/* Quote */}
              <span className=" relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              {/* Author section */}
              <div className="relative z-20 mt-4 sm:mt-6 flex flex-row items-center"> {/* Reduced base margin-top */}
                <span className="flex flex-col gap-1">
                  {/* Author Name */}
                  <span className=" text-sm font-medium text-secondary-dark"> {/* Adjusted style */}
                    {item.name}
                  </span>
                  {/* Author Title - smaller on mobile */}
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