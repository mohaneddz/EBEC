"use client";

import { cn } from "@/utils/cn";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";

type Word = {
  text: string;
  className?: string;
};

type TypewriterEffectProps = {
  words: Word[];
  className?: string;
  cursorClassName?: string;
};

type TypewriterEffectDemoProps = {
  words: Word[];
  className?: string;
};

export default function TypewriterEffectDemo({ words, className }: TypewriterEffectDemoProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[10rem] text-lg">
      <TypewriterEffect words={words} className={className} />
    </div>
  );
}

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName
}: TypewriterEffectProps) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate("span", {
        display: "inline-block",
        opacity: 1,
        width: "fit-content",
      }, {
        duration: 0.3,
        delay: stagger(0.1),
        ease: "easeInOut",
      });
    }
  }, [isInView, animate]);

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <motion.span
              initial={{}}
              key={`char-${index}`}
              className={cn(`text-primary-dark opacity-0 hidden text-3xl vsm:text-3xl sm:text-5xl`, word.className)}
            >
              {char}
            </motion.span>
          ))}
          {idx < wordsArray.length - 1 && <span className="inline-block">&nbsp;</span>}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={cn("text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center", className)}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn("inline-block rounded-sm w-[3px] h-8 md:h-10 lg:h-12 bg-white", cursorClassName)}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName
}: TypewriterEffectProps) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const renderWords = () => (
    <div>
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <span
              key={`char-${index}`}
              className={cn(`dark:text-white text-black`, word.className)}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: "0%" }}
        whileInView={{ width: "fit-content" }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{ whiteSpace: "nowrap" }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn("block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500", cursorClassName)}
      ></motion.span>
    </div>
  );
};
