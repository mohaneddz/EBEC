"use client";
import { useEffect, useRef, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/utils/cn";

type TextGenerateEffectProps = {
  words: string;
  color: string;
  margin?: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  triggerOnce?: boolean;
};

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  color,
  margin,
  className,
  filter = true,
  duration = 1,
  triggerOnce = true,
}) => {
  const [scope, animate] = useAnimate();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsArray = words.split(" ");

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
              duration: duration,
              delay: stagger(0.2),
            }
          );
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentContainerRef = containerRef.current;

    if (currentContainerRef) {
      observer.observe(currentContainerRef);
    }

    return () => {
      if (currentContainerRef) {
        observer.unobserve(currentContainerRef);
      }
    };
  }, [isVisible, triggerOnce, animate, duration, filter]);

  const renderWords = () => (
    <motion.div ref={scope} className={margin}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className={`opacity-0 text-4xl sm:text-5xl md:text-7xl font-bold text-center mt-12 -mb-8 text-${color}`}
          style={{
            filter: filter ? "blur(10px)" : "none",
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );

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
