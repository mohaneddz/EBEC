"use client";
import React, { useEffect } from 'react';
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/utils/cn";

type TextGenerateEffectProps = {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
};

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate("span", {
      opacity: 1,
      filter: filter ? "blur(0px)" : "none",
    }, {
      duration: duration,
      delay: stagger(0.2),
    });
  }, [animate, duration, filter]);

  const renderWords = () => (
    <motion.div ref={scope}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="dark:text-white text-black opacity-0"
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
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white leading-snug tracking-wide text-3xl font-bold text-center mt-20 mb-8 text-primary-dark">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
