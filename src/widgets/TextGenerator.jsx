"use client";
import { useEffect, useRef, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 1,
  triggerOnce = true,
}) => {
  const [scope, animate] = useAnimate();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  let wordsArray = words.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!isVisible || !triggerOnce)) {
          setIsVisible(true);
          animate(
            "span",
            {
              opacity: 1,
              filter: filter ? "blur(0px)" : "none",
            },
            {
              duration: duration ? duration : 1,
              delay: stagger(0.2),
            }
          );
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );

    const currentContainerRef = containerRef.current;

    if (currentContainerRef) {
      observer.observe(currentContainerRef);
    }

    // Cleanup the observer on component unmount
    return () => {
      if (currentContainerRef) {
        observer.unobserve(currentContainerRef);
      }
    };
  }, [isVisible, triggerOnce, animate, duration, filter]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="my-20">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0 text-2xl sm:text-3xl md:text-5xl font-bold text-center mt-12 -mb-8 text-[--midnight-navy]"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
