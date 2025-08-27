"use client";

import React from 'react';
import { motion } from "motion/react";

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'About', path: '/about' },
  { name: 'User Profile', path: '/user' }
];

const QuickLinksMenu = () => {
  return (
    <ul className="space-y-4">
      {quickLinks.map((link) => (
        <motion.li
          key={link.name}
          whileHover={{ scale: 1.05, x: 10 }}
          whileTap={{ scale: 0.95 }}
          className="group" 
        >
          <a
            href={link.path}
            className="text-gray-300 hover:text-[#FFD700] transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-[#FFD700] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              ›
            </span>
            {link.name}
          </a>
        </motion.li>
      ))}
    </ul>
  );
};

export default QuickLinksMenu;