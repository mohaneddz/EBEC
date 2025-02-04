"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import logo from "../../public/EBEC.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconUser, IconHome, IconCalendarEvent, IconHelp } from "@tabler/icons-react";

const Navbar = ({ onHeightChange }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const router = useRouter();
  const navbarRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Events", path: "/events", icon: IconCalendarEvent },
    { name: "FAQ", path: "/faq", icon: IconHelp },
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      router.push(item.path);
      setActivePage(item.name);
    }
  };

  const handleLogoClick = () => {
    router.push("/");
    setActivePage("Home");
  };

  useEffect(() => {
    if (navbarRef.current && onHeightChange) {
      onHeightChange(navbarRef.current.offsetHeight);
    }
  }, [navbarRef, onHeightChange]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActivePage(currentItem.name);
    }
  }, []);

  return (
    <header
      ref={navbarRef}
      className="navbar sticky w-full top-0 z-50 shadow-md bg-white"
    >
      <nav className="container mx-auto px-4 py-2 z-50">
        <div className="flex items-center">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Image
              src={logo}
              alt="EBEC Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
            <div>
              <div className="font-semibold text-lg text-[var(--deep-blue)]">
                EBEC
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
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
                  } flex items-center gap-2`}
                >
                  <item.icon size={20} />
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

          {/* User Icon - Desktop */}
          <div className="hidden md:flex ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer p-2"
              onClick={() => router.push('/login')}
            >
              <IconUser
                size={24}
                className="text-gray-600 hover:text-[var(--deep-blue)]"
              />
            </motion.div>
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 focus:outline-none"
          >
            <div className="space-y-2">
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-all ${isOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-opacity ${isOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-all ${isOpen ? "-rotate-45 -translate-y-2.5" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav Links */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  handleNavigation(item);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                  activePage === item.name
                    ? "text-[var(--sunrise-yellow)]"
                    : "text-gray-600 hover:text-[var(--deep-blue)]"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </div>
            ))}
            <div
              onClick={() => {
                router.push("/user");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[var(--deep-blue)] cursor-pointer"
            >
              <IconUser size={20} />
              <span>Profile</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;