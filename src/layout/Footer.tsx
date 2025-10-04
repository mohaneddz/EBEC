import React from 'react';
import SocialLinks from '@/components/layout/FooterSocialLinks';
import QuickLinksMenu from '@/components/layout/FooterQuickLinks';

const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg";

const Footer = () => {
  return (
    <footer className="w-full relative text-white py-16 bg-gradient-to-r from-[#0a1028] to-[#132051]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg')] bg-center bg-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1028]/95 to-[#132051]/60 backdrop-blur-md" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400 text-2xl">⬡</span>
              <span className="text-xl font-semibold text-white">EBEC - ENSIA</span>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              EBEC (ENSIA&apos;s Business and Entrepreneurship Club) is a student-led organization dedicated to empowering future business leaders and AI innovators. We provide workshops, mentorship, and networking opportunities to help students bridge the gap between technology and entrepreneurship.
            </p>
            <SocialLinks />
          </div>

          <div>
            <div className="relative inline-block mb-8">
              <h3 className="text-xl font-semibold text-white">Quick Links</h3>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            </div>
            <QuickLinksMenu />
          </div>

          <div>
            <div className="relative inline-block mb-8">
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
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

      <div className="relative z-10 text-center mt-20 text-gray-400">
        <div className="w-full border-t border-gray-600 my-8" />
        <div className="w-max mx-auto center col gap-4">
          © 2025 EBEC - ENSIA. All rights reserved.
          <span>
            <div className="w-full border-t border-gray-600" />
            Made By <a href="https://github.com/mohaneddz" className='text-secondary-light underline'>MANAA Mohaned</a> - 2024
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;