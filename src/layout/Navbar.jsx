"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Changed import for framer-motion (common practice)
import logo from "../../public/EBEC.png";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { IconUser, IconHome, IconCalendarEvent, IconHelp } from "@tabler/icons-react";
import supabase from '@/config/supabaseClient';

const Navbar = ({ onHeightChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const navbarRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    // Add listener for auth state changes (optional but good practice)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Events", path: "/events", icon: IconCalendarEvent },
    { name: "FAQ", path: "/faq", icon: IconHelp },
    // Example: If you add an admin link later
    // { name: "Admin", path: "/admin", icon: IconSettings }, // Assuming IconSettings exists
  ];

  // Function to determine if a standard nav item is active (exact match)
  const isNavItemActive = (itemPath) => {
    // Handle the root path explicitly to avoid matching prefixes like /events
    if (itemPath === '/') {
      return pathname === '/';
    }
    return pathname === itemPath;
  };

  // Function to determine if the user profile section is active
  const isUserSectionActive = () => {
    return pathname.startsWith('/user/');
  };

  // Function to determine if the admin section is active (example)
  // const isAdminSectionActive = () => {
  //   return pathname.startsWith('/admin/');
  // };

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
      setIsOpen(false); // Close mobile menu on navigation
    }
  };

  const handleLogoClick = () => {
    router.push("/");
    setIsOpen(false); // Close mobile menu on navigation
  };

  useEffect(() => {
    if (navbarRef.current && onHeightChange) {
      onHeightChange(navbarRef.current.offsetHeight);
    }
    // Recalculate height if isOpen changes (mobile menu opens/closes)
  }, [navbarRef, onHeightChange, isOpen]);


  // Determine user profile path
  const profilePath = user?.id ? `/user/${user.id}` : "/login";

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
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              // Example for admin prefix matching if needed:
              // const isActive = item.path === '/admin' ? isAdminSectionActive() : isNavItemActive(item.path);
              return (
                <motion.div
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="relative py-2 font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className={`${isActive // Use direct path check
                      ? "text-[var(--sunrise-yellow)]"
                      : "text-gray-600 hover:text-[var(--deep-blue)]"
                      } flex items-center gap-2`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </span>
                  {isActive && ( // Use direct path check
                    <motion.div
                      layoutId="underline" // layoutId needs to be unique if multiple underlines can exist
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--sunrise-yellow)]"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* User Icon - Desktop */}
          <div className="hidden md:flex ml-auto">
            {
              !loading &&
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer p-2"
                onClick={() => handleNavigation(profilePath)}
              >
                <IconUser
                  size={24}
                  className={`${isUserSectionActive() // Check if user section is active
                    ? "text-[var(--sunrise-yellow)]"
                    : "text-gray-600 hover:text-[var(--deep-blue)]"
                    }`}
                />
              </motion.div>
            }
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 focus:outline-none"
            aria-label="Toggle menu" // Accessibility improvement
            aria-expanded={isOpen} // Accessibility improvement
          >
            <div className="space-y-2">
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-transform duration-300 ease-in-out ${ // Improved transition
                  isOpen ? "rotate-45 translate-y-[10px]" : "" // Adjusted translation
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-opacity duration-300 ease-in-out ${ // Improved transition
                  isOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--deep-blue)] transition-transform duration-300 ease-in-out ${ // Improved transition
                  isOpen ? "-rotate-45 -translate-y-[10px]" : "" // Adjusted translation
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav Links */}
        {/* Optional: Use Framer Motion for smoother transition */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          style={{ overflow: 'hidden' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden"
        >
          <div className="pt-4 pb-3 space-y-1"> {/* Removed conditional rendering wrapper */}
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              // Example for admin prefix matching if needed:
              // const isActive = item.path === '/admin' ? isAdminSectionActive() : isNavItemActive(item.path);
              return (
                <div
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${ // Added rounded-md for better hover/active state appearance
                    isActive // Use direct path check
                      ? "text-[var(--sunrise-yellow)] bg-yellow-50" // Add subtle bg for active mobile item
                      : "text-gray-600 hover:text-[var(--deep-blue)] hover:bg-gray-100" // Add hover bg
                    }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </div>
              );
            })}
            {/* Mobile Profile Link */}
            {
              !loading &&
              <div
                onClick={() => handleNavigation(profilePath)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${ // Added rounded-md
                  isUserSectionActive() // Check if user section is active
                    ? "text-[var(--sunrise-yellow)] bg-yellow-50" // Add subtle bg for active mobile item
                    : "text-gray-600 hover:text-[var(--deep-blue)] hover:bg-gray-100" // Add hover bg
                  }`}
              >
                <IconUser size={20} />
                <span>Profile</span>
              </div>
            }
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Navbar;