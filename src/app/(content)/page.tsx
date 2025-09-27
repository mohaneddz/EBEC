import React from 'react'

import Hero from '@/sections/Landing/HeroSection'
import InfiniteMovingCardsSection from '@/sections/Landing/InfiniteMovingCardsSection';
import WobbleCardSection from '@/sections/Landing/WobbleCardsSection';
import ServicesSection from '@/sections/Landing/ServicesSection';
import {EBECInfoSlide} from '@/sections/Landing/EBECInfoSlide';
import Footer from '@/layout/Footer';

export default function Home() {
  return (
    <div className="bg-[#e1e4ea] flex flex-col justify-center align-center items-center">
      <Hero />
      <InfiniteMovingCardsSection />
      <EBECInfoSlide />
      <ServicesSection />
      <WobbleCardSection />
      <Footer />
    </div >
  )
}