import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { cn } from "../lib/utils";
import Image from "next/image";

const colors = [
  "#0ea5e9", // sky-500
  "#737373", // neutral-500
  "#14b8a6", // teal-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#eab308", // yellow-500"
];

export const FollowerPointerCard = ({
  children,
  className,
  title,
  color
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = React.useRef(null);
  const [rect, setRect] = useState(null);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const updateRect = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    // Initialize rect when the component mounts
    updateRect();

    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const handleMouseMove = (e) => {
    if (rect) {
      const offsetX = e.screenX - rect.left;
      const offsetY = e.screenY - rect.top;
      x.set(offsetX);
      y.set(offsetY);
    }
  };

  const handleMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      style={{
        cursor: "none",
      }}
      ref={ref}
      className={cn("relative z-50", className)}
    >
      <AnimatePresence>
        {isInside && <FollowPointer x={x} y={y} title={title} color={color} />}
      </AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
  color
}) => {

  return (
    <motion.div
      className="h-4 w-4 rounded-full fixed z-50"
      style={{
        x,
        y,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 text-secondary-light transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-secondary-dark z-50"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"
        ></path>
      </svg>
      <motion.div
        style={{
          backgroundColor: color || colors[Math.floor(Math.random() * colors.length)],
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="px-2 py-2 text-white whitespace-nowrap min-w-max text-xs rounded-full z-[100]"
      >
        {title || `William Shakespeare`}
      </motion.div>
    </motion.div>
  );
};

export const TitleComponent = ({
  title,
  avatar,
}) => (
  <div className="flex space-x-2 items-center px-2 py-4 rounded-2xl z-50">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt=""
      className="rounded-full border-2 border-white z-50"
    />
    <p>{title}</p>
  </div>
);
