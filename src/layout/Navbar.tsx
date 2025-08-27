"use client";

import { useRouter, usePathname } from "next/navigation";
import { IconUser, IconHome, IconCalendarEvent, IconHelp } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";

import { motion } from "motion/react";
import { User } from "@supabase/supabase-js";

import supabase from '@/config/supabaseClient';
import Image from "next/image";

const logo = "/EBEC.png";


export default function Navbar({ }) {

  const router = useRouter();
  const pathname = usePathname(); 
  const navbarRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Events", path: "/events", icon: IconCalendarEvent },
    { name: "About", path: "/about", icon: IconHelp },
  ];

  const isNavItemActive = (itemPath: string) => {
    if (itemPath === '/') {
      return pathname === '/';
    }
    return pathname === itemPath;
  };

  const isUserSectionActive = () => {
    return pathname.startsWith('/user/');
  };

  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
      setIsOpen(false);
    }
  };

  const handleLogoClick = () => {
    router.push("/");
    setIsOpen(false);
  };

  const profilePath = user?.id ? `/user/${user.id}` : "/login";

  return (
    <header
      ref={navbarRef}
      className="navbar sticky w-full top-0 z-50 shadow-md bg-white">

      <nav className="container mx-auto px-4 py-2 z-50">
        <div className="flex items-center">

          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
            <Image
              src={logo}
              alt="EBEC Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center gap-16">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              return (
                <motion.div
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="relative pb-1 font-medium cursor-pointer text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className={`${isActive
                      ? "text-secondary-dark"
                      : "text-gray-600 hover:text-primary-dark"
                      } flex items-center gap-2`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary-dark"
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
                  className={`${isUserSectionActive()
                    ? "text-secondary-dark"
                    : "text-gray-600 hover:text-primary-dark"
                    }`}
                />
              </motion.div>
            }
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="space-y-2">
              <span
                className={`block w-6 h-0.5 bg-primary-dark transition-transform duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-[10px]" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-primary-dark transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-primary-dark transition-transform duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-[10px]" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav Links */}
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
              return (
                <div
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-3 rounded-md cursor-pointer ${isActive ? "text-secondary-dark bg-yellow-50"
                    : "text-sm text-gray-400 hover:text-primary-dark hover:bg-gray-100"}`}>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${isUserSectionActive()
                  ? "text-secondary-dark bg-yellow-50"
                  : "text-sm text-gray-400 hover:text-primary-dark hover:bg-gray-100"}`}>
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