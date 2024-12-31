"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import logo from "../../public/EBEC.png"
// import { UserCircle } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  // const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About us", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
      setActivePage(item.name);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    setActivePage("Home");
  };

  return (
    <header className="sticky w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Image
              src={logo}
              alt="EBEC Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <div className="font-semibold text-lg text-[var(--deep-blue)] md:hidden">
                EBEC
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center gap-16">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                onClick={() => handleNavigation(item)}
                className="relative py-2 font-medium cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <span
                  className={`${
                    activePage === item.name
                      ? "text-[var(--sunrise-yellow)]"
                      : "text-gray-600 hover:text-[var(--deep-blue)]"
                  }`}
                >
                  {item.name}
                </span>
                {activePage === item.name && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--sunrise-yellow)]"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center ml-auto mr-4">
            {/* <UserCircle className="w-8 h-8 text-[var(--deep-blue)] cursor-pointer hover:text-[var(--sunrise-yellow)] transition-colors" /> */}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2"
          >
            <div className="space-y-2">
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-all ${
                  isOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-opacity ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-all ${
                  isOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  handleNavigation(item);
                  setIsOpen(false);
                }}
                className={`block px-3 py-2 cursor-pointer ${
                  activePage === item.name
                    ? "text-[var(--sunrise-yellow)]"
                    : "text-gray-600 hover:text-[var(--deep-blue)]"
                }`}
              >
                {item.name}
              </div>
            ))}
            <div
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[var(--deep-blue)] cursor-pointer"
            >
              {/* <UserCircle className="w-5 h-5" /> */}
              <span>Profile</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;