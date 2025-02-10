"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../hooks/Use-outside-click";

export function ExpandableCardDemo({ cards, className }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (<>

    <AnimatePresence>
      {active && typeof active === "object" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 h-full w-full z-10" />
      )}
    </AnimatePresence>

    <AnimatePresence>

      {active && typeof active === "object" ? (
        <div className="fixed inset-0 grid place-items-center z-[100] mx-auto">
          <motion.button
            key={`button-${active.title}-${id}`}
            layout
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.05,
              },
            }}
            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
            onClick={() => setActive(null)}>
            <CloseIcon />
          </motion.button>
          <motion.div
            layoutId={`card-${active.title}-${id}`}
            ref={ref}
            className="w-full h-full md:max-w-[500px] md:h-fit md:max-h-[90%]  flex flex-col md:rounded-3xl bg-primary-light overflow-hidden">

            <motion.div layoutId={`image-${active.title}-${id}`}>
              <Image
                width={400}
                height={400}
                src={active.src}
                alt={active.title}
                className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top" />
            </motion.div>

            <div>
              <div className="flex justify-between items-start p-4">
                <div className="">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-semibold text-secondary-light  text-base">
                    {active.title}
                  </motion.h3>
                  <p className="text-neutral-200 text-base">
                    {active.description}
                  </p>
                </div>

                <motion.a
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  href={active.ctaLink || "Learn More!"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  target="_self"
                  className="px-4 py-3 text-sm rounded-full font-bold bg-secondary-dark hover:bg-secondary-light  text-white hover:text-black">
                  {active.ctaText}
                </motion.a>
              </div>
              <div className="pt-4 relative px-4">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-400 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto  [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                  {typeof active.content === "function"
                    ? active.content()
                    : active.content}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>

    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 p-8 py-20 lg:w-[70%] mx-auto [&>*]:w-full [&>*]:h-full [&>*]:aspect-[3/3]">
      {cards.map((card) => (
        <motion.div
          layoutId={`card-${card.title}-${id}`}
          key={card.title}
          onClick={() => setActive(card)}
          whileHover={{ scale: 1.05, translateY: -10 }}
          className="sm:px-4 px-0 pb-8 pt-8 flex flex-col bg-[#141f4b] hover:bg-primary-light rounded-xl cursor-pointer hover:drop-shadow-lg hover:shadow-secondary-dark">
          <motion.div className="flex gap-4 flex-col w-full align-center">
            <motion.div layoutId={` image-${card.title}-${id}`} className="flex items-center align-center justify-center">
              <Image
                width={300}
                height={300}
                src={card.src}
                alt={card.title}
                className="h-60 rounded-md object-cover object-top w-4/5 sm:w-full" />
            </motion.div>
            <motion.div
              layout
              className="flex justify-center gap-2 pt-4 items-center flex-col"
            >
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="font-semibold text-secondary-dark text-center md:text-left text-base"
              >
                {card.title}
              </motion.h3>
              <p
                className="text-neutral-400 text-center md:text-left text-base block max-h-[100px] overflow-hidden"
              >
                {card.description}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

      ))}
    </ul>
  </>);
}

export const CloseIcon = () => {
  return (
    (<motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>)
  );
};