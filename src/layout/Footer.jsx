"use client";

import React from 'react';
import { motion } from "motion/react";
import { IconBrandDiscordFilled, IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandLinkedinFilled } from '@tabler/icons-react';

const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg";


const Footer = () => {
  const socialIcons = [
    { name: 'Facebook', icon: IconBrandFacebookFilled, link: 'https://web.facebook.com/people/EBECClub/61555816156722/?_rdc=1&_rdr#' },
    { name: 'Instagram', icon: IconBrandInstagramFilled, link: 'https://www.instagram.com/ebec__club' },
    { name: 'LinkedIn', icon: IconBrandLinkedinFilled, link: 'https://dz.linkedin.com/company/ensia-business-entrepreneurship-club-ebec?trk=ppro_cprof' },
    { name: 'Discord', icon: IconBrandDiscordFilled, link: 'https://discord.gg/N8ChkwHN' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'FAQ', path: '/faq' },
    { name: 'User Profile', path: '/user' }
  ];

  return (
    <footer
      style={{
        background: 'linear-gradient(to right, #0a1028, #132051)',
        position: 'relative',
        color: 'white',
        padding: '64px 0'
      }}
      className="w-full"
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to right, rgba(10, 16, 40, 0.95), rgba(19, 32, 81, 0.6)), url(${image1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: 0.1,
          zIndex: 1
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span style={{ color: '#FFD700', fontSize: '24px' }}>⬡</span>
              <span className="text-xl font-semibold text-white">EBEC - ENSIA</span>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              EBEC (ENSIA&apos;s Business and Entrepreneurship Club) is a student-led organization dedicated to empowering future business leaders and AI innovators. We provide workshops, mentorship, and networking opportunities to help students bridge the gap between technology and entrepreneurship.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                  style={{ color: '#0a1028' }}
                  onClick={() => window.open(social.link, '_blank')}
                >
                  <social.icon size={20} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="relative inline-block mb-8">
              <h3 className="text-xl font-semibold text-white">Quick Links</h3>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '100%',
                height: '4px',
                backgroundColor: '#FFD700',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                borderRadius: '2px'
              }} />
            </div>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
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
          </div>

          {/* Contact */}
          <div>
            <div className="relative inline-block mb-8">
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '100%', // Changed from 48px to 100%
                height: '4px',
                backgroundColor: '#FFD700',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)', // Added glow effect
                borderRadius: '2px' // Optional: adds rounded corners
              }} />
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">
                <span className="text-white font-semibold">Location: </span>
                Algeria, Algiers Higher School of Artificial Intelligence
              </p>
              <p className="text-gray-300">
                <span className="text-white font-semibold">Email: </span>
                ebec@ensia.edu.dz
              </p>
              <p className="text-gray-300">
                <span className="text-white font-semibold">Work Hours: </span>
                Sunday - Thursday 8:30 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="relative z-10 text-center mt-20 text-gray-400">
        <div className="w-full border-t border-gray-600 my-8" />
        © 2025 EBEC - ENSIA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
