"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react"; // Corrected import
import { useOutsideClick } from "../../hooks/Use-outside-click"; // Make sure this path is correct

export function ExpandableCardDemo({ cards, className }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
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

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] mx-auto">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full h-full md:max-w-[500px] md:h-fit md:max-h-[90%]  flex flex-col md:rounded-3xl bg-primary-light overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  width={400}
                  height={400}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-semibold text-secondary-light text-base"
                    >
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
                    href={active.ctaLink || "#"} // Changed to '#' to prevent page reload, use a real link if needed.
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    target="_self"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-secondary-dark hover:bg-secondary-light text-white hover:text-black"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-400 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto  [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
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

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-16 mt-5 p-4 md:px-8 py-10 md:pt-20 mb-30 mx-auto">
        {cards.filter((card)=>card.src !== "").map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="flex flex-col bg-[#141f4b] hover:bg-primary-light rounded-xl cursor-pointer hover:drop-shadow-lg hover:shadow-secondary-dark"
          >
            <div className="flex gap-4 flex-col w-full items-center p-4 ">
              {" "}
              {/* Added padding here */}
              <motion.div
                layoutId={`image-${card.title}-${id}`}
                className="flex items-center justify-center w-full"
              >
                {" "}
                {/* Ensure full width */}
                <Image
                  width={300}
                  height={300}
                  src={card.src}
                  alt={card.title}
                  className="h-60 rounded-md object-cover object-top w-full" // Added w-full for image responsiveness
                />
              </motion.div>
              <motion.div
                layout
                className="flex justify-center gap-2 pt-4 items-center flex-col w-full" // Added w-full
              >
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-semibold text-secondary-dark text-center text-base truncate"  // Removed md:text-left
                >
                  {card.title}
                </motion.h3>
                <p className="text-neutral-400 text-center text-base  overflow-hidden truncate text-ellipsis"> {/*Used text-ellipsis for overflow handling*/}
                  {card.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}


export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path d="M18 6L6 18M6 6l12 12" /> {/* Simplified path */}
        </motion.svg>
    );
};