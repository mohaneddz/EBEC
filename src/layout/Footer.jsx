"use client";

import React from "react";
import logo from "../../public/EBEC.png"
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mb-0 p-0">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="#" className="flex items-center">
          <Image src={logo} className="h-16 md:h-24" alt="EBEC Logo" />
        </a>

        {/* Center: EBEC Text - Hidden only on small phones, visible on other screens */}
        <div className="hidden sm:block text-center">
          <p className="text-lg font-bold text-[#102a4d] dark:text-white">
            <span style={{ color: "var(--golden-orange)" }}>EBEC</span>{" "}
            ENSIA&apos;s Business & Enterprise Club
          </p>
        </div>

        {/* Right: Icons */}
        <div className="flex space-x-4 md:space-x-8 text-2xl md:text-3xl">
          
           <a  href="https://www.instagram.com/ebec__club?igsh=MWNnenJxOGdja2p6OQ=="
            className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
          
           <a  href="https://www.linkedin.com/company/ensia-business-entrepreneurship-club-ebec/"
            className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          
            <a href="https://discord.gg/VCdAh2eP"
            className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
          >
            <i className="fab fa-discord"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// import React from "react";
// import logo from "../../Components/Assets/EBEC.png";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const Footer = () => {
//   return (
//     <div>
//       <footer className="mb-0 p-0">
//         <div className="relative w-full max-w-screen-xl mx-auto flex items-center justify-between">
//           {/* Left: Logo */}
//           <a href="#" className="flex items-center">
//             <Image src={logo} className="h-24" alt="EBEC Logo" />
//           </a>

//           {/* Center: EBEC Text */}
//           <div className="text-center">
//             <p className="text-lg font-bold text-[#102a4d] dark:text-white">
//               <span style={{ color: "var(--golden-orange)" }}>EBEC</span>{" "}
//               ENSIA's Business & Enterprise Club
//             </p>
//           </div>

//           {/* Right: Icons */}
//           <div className="flex space-x-8 text-4xl mb-0">
//             <a
//               href="
// https://www.instagram.com/ebec__club?igsh=MWNnenJxOGdja2p6OQ=="
//               className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
//             >
//               <i className="fab fa-instagram"></i>
//             </a>
//             <a
//               href="https://www.linkedin.com/company/ensia-business-entrepreneurship-club-ebec/"
//               className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
//             >
//               <i className="fab fa-linkedin"></i>
//             </a>
//             <a
//               href="
// https://discord.gg/VCdAh2eP"
//               className="text-[#102a4d] hover:text-[#fba919] transition-colors duration-300"
//             >
//               <i className="fab fa-discord"></i>
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Footer;