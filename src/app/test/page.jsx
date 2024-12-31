"use client";

import React from 'react';
import { motion } from 'motion/react';

const test = () => {
  return (
    <>
      <motion.div
        className="relative w-[30rem] h-[10rem] bg-blue-500 overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="fixed w-[30rem] h-[10rem] p-10">
          <p className="text-black">Content stays in place relative to the page</p>
        </div>
      </motion.div>
    </>
  );
};

export default test;