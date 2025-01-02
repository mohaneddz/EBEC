"use client";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {

    const particle = () => {
      const newParticle = {
        id: Date.now(),
        size: Math.random() * 15 + 5,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 10,
        animationDelay: Math.random() * 5,
      };

      setParticles((prevParticles) => {
        const updatedParticles = [...prevParticles, newParticle];
        if (updatedParticles.length > 20) {
          updatedParticles.shift();
        }
        return updatedParticles;
      });

      setTimeout(() => {
        setParticles((prevParticles) =>
          prevParticles.filter((p) => p.id !== newParticle.id)
        );
      }, 20000);
    };

    const particleInterval = setInterval(particle, 300);

    return () => clearInterval(particleInterval);
  }, []);

  return (
    
    <>
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-dark to-primary-light">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-[rgba(100,255,218,0.1)] rounded-full opacity-50"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: 0,
                animation: `quantum-float ${particle.animationDuration}s linear ${particle.animationDelay}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg rounded-xl p-6 border border-white/5 transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FBA919] to-[#FBBE12]">
                Explore
              </h3>
              <div className="space-y-3">
                {[
                  "Entrepreneurship Hub",
                  "Startup Playground",
                  "Business Insights",
                  "Community Pulse",
                ].map((link) => (
                  <p
                    key={link}
                    className="block text-white/70 hover:text-[#FBBE12] hover:translate-x-2 transition-all duration-300"
                  >
                    {link}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg rounded-xl p-6 border border-white/5 transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FBA919] to-[#FBBE12]">
                Connect
              </h3>
              <div className="space-y-3">
                {[
                  "Global Business Network",
                  "Collaboration Spaces",
                  "Mentorship Program",
                  "Expert Forums",
                ].map((link) => (
                  <p
                    key={link}
                    className="block text-white/70 hover:text-[#FBBE12] hover:translate-x-2 transition-all duration-300"
                  >
                    {link}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg rounded-xl p-6 border border-white/5 transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FBA919] to-[#FBBE12]">
                Learn
              </h3>
              <div className="space-y-3">
                {[
                  "Business Mastery Courses",
                  "Interactive Workshops",
                  "Leadership Masterclasses",
                  "Future-Ready Skills",
                ].map((link) => (
                  <p
                    key={link}
                    className="block text-white/70 hover:text-[#FBBE12] hover:translate-x-2 transition-all duration-300"
                  >
                    {link}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg rounded-xl p-6 border border-white/5 transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FBA919] to-[#FBBE12]">
                Connect
              </h3>
              <div className="flex space-x-6">
                {["Instagram", "LinkedIn", "Discord"].map((platform, index) => (
                  <a
                    key={platform}
                    href={
                      index === 0
                        ? "https://www.instagram.com/ebec__club?igsh=MWNnenJxOGdja2p6OQ=="
                        : index === 1
                          ? "https://www.linkedin.com/company/ensia-business-entrepreneurship-club-ebec/"
                          : "https://discord.gg/VCdAh2eP"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#FBBE12] transition-all duration-300 transform hover:scale-125"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      {index === 0 && (
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.197-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.646 1.439-1.441s-.644-1.44-1.439-1.44z" />
                      )}
                      {index === 1 && (
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      )}
                      {index === 2 && (
                        <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.536c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-7.008-1.728-7.008-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692.012-2.424.096l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.144-1.728 7.008 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.41-2.1-1.41l.336.204.576.348.156.096.432.264c.308.18.62.336.928.468.52.204 1.14.408 1.86.552.948.18 2.052.24 3.24.012.588-.096 1.188-.264 1.812-.552.44-.18.932-.468 1.456-.864 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.328-5.676c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-white/50 mt-12 text-sm">
            © {new Date().getFullYear()} EBEC club. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
