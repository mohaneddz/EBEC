"use client";

import { cn } from "@/utils/cn";
import React, { useRef } from "react";

import Image from "next/image";
import type { GlareCardProps } from '@/types/glareCard';

export const GlareCard = ({
  enabled,
  className,
  cardData,
  onClick,
  isOpen
}: GlareCardProps & { isOpen?: boolean }) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  });

  // Inline styles remain the same as they are dynamically calculated
  const containerStyle: React.CSSProperties & Record<string, string> = {
    "--m-x": "50%", "--m-y": "50%", "--r-x": "0deg", "--r-y": "0deg",
    "--bg-x": "50%", "--bg-y": "50%", "--duration": "300ms", "--foil-size": "100%",
    "--opacity": "0", "--radius": "12px", "--easing": "ease",
    "--transition": "var(--duration) var(--easing)"
  };

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current;
      refElement.current.style.setProperty("--m-x", `${glare.x}%`);
      refElement.current.style.setProperty("--m-y", `${glare.y}%`);
      refElement.current.style.setProperty("--r-x", `${rotate.x}deg`);
      refElement.current.style.setProperty("--r-y", `${rotate.y}deg`);
      refElement.current.style.setProperty("--bg-x", `${background.x}%`);
      refElement.current.style.setProperty("--bg-y", `${background.y}%`);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!refElement.current) return;
    const rect = refElement.current.getBoundingClientRect();
    const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const percentage = { x: (100 / rect.width) * position.x, y: (100 / rect.height) * position.y };
    const delta = { x: percentage.x - 50, y: percentage.y - 50 };

    state.current.background = { x: 50 + percentage.x / 8 - 6.25, y: 50 + percentage.y / 6 - 8.33 };
    state.current.rotate = { x: -(delta.y / 3.5) * 0.4, y: (delta.x / 2) * 0.4 };
    state.current.glare = { x: percentage.x, y: percentage.y };

    updateStyles();
  }

  const handlePointerEnter = () => {
    isPointerInside.current = true;
    if (refElement.current) {
      setTimeout(() => {
        if (isPointerInside.current) {
          refElement.current!.style.setProperty("--duration", "0s");
        }
      }, 300);
    }
  }

  const handlePointerLeave = () => {
    isPointerInside.current = false;
    if (refElement.current) {
      refElement.current.style.setProperty("--duration", "300ms");
      refElement.current.style.setProperty("--r-x", `0deg`);
      refElement.current.style.setProperty("--r-y", `0deg`);
      refElement.current.style.setProperty("--bg-x", "50%");
      refElement.current.style.setProperty("--bg-y", "50%");
    }
  }

  return (
    <div
      style={containerStyle}
      className={cn("relative h-[400px] aspect-[17/21] rounded-xl overflow-hidden [perspective:600px] will-change-transform", className)}
      ref={refElement}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        onClick={enabled ? onClick : undefined}
        className={cn(
          "relative w-full h-full rounded-xl border border-slate-800 transition-transform duration-[var(--duration)] ease-[var(--easing)] [transform:rotateY(var(--r-y))_rotateX(var(--r-x))]",
          enabled && "group cursor-pointer"
        )}
      >
        {isOpen && (
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden z-20">
            <div className="absolute w-40 transform rotate-45 bg-yellow-400 text-center text-black text-xs font-bold shadow py-1 right-[-34px] top-[25px]">
              Open
            </div>
          </div>
        )}

        {!isOpen && (
          <div className="absolute inset-0 bg-primary-dark/40 z-20 pointer-events-none" />
        )}

        {/* Card Content */}
        <div className="w-full h-full grid [clipPath:inset(0_0_0_0_round_var(--radius))]">
          <div className="w-full h-full"
            style={{
              background: 'radial-gradient(circle, #1b2755 0%, #0a1029 100%)',
            }}
          >
            {cardData.src ? (
              <div className="relative w-full h-full group ">
                <Image
                  height={400}
                  width={300}
                  src={cardData.src}
                  alt={cardData.title}
                  className="object-cover w-full h-full transition-all duration-500 ease-in-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex flex-col justify-center text-center transition-colors duration-500 bg-black/0 group-hover:bg-black/60">
                  <h2 className="text-3xl font-black text-secondary-dark opacity-0 drop-shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
                    {cardData.title}
                  </h2>
                  <p className="mt-2 text-gray-300 opacity-0 drop-shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100 text-wrap px-4">
                    {cardData.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="15"
                  className="w-20 h-20 text-slate-300"
                  viewBox="0 0 320 512">
                  <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74v1.4c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160C288 89.3 230.7 32 160 32h-32C57.3 32 0 89.3 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                </svg>
                <h2 className="pt-8 text-xl font-bold text-slate-300">{cardData.title}</h2>
                <p className="pt-4 text-center text-slate-500">{cardData.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
