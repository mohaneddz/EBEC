"use client";

import React from 'react';
import { motion } from "motion/react";
import { IconBrandDiscordFilled, IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandLinkedinFilled } from '@tabler/icons-react';

// It's good practice to define the data or pass it as props
const socialIcons = [
  { name: 'Facebook', icon: IconBrandFacebookFilled, link: 'https://web.facebook.com/people/EBECClub/61555816156722/?_rdc=1&_rdr#' },
  { name: 'Instagram', icon: IconBrandInstagramFilled, link: 'https://www.instagram.com/ebec__club' },
  { name: 'LinkedIn', icon: IconBrandLinkedinFilled, link: 'https://dz.linkedin.com/company/ensia-business-entrepreneurship-club-ebec?trk=ppro_cprof' },
  { name: 'Discord', icon: IconBrandDiscordFilled, link: 'https://discord.gg/N8ChkwHN' },
];

const SocialLinks = () => {
  return (
    <div className="flex gap-4">
      {socialIcons.map((social) => (
        <motion.button
          key={social.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
          style={{ color: '#0a1028' }}
          onClick={() => window.open(social.link, '_blank')}
          aria-label={`Visit our ${social.name} page`}
        >
          <social.icon size={20} />
        </motion.button>
      ))}
    </div>
  );
};

export default SocialLinks;