import React from 'react'

import Hero from '@/widgets/Landing/HeroSection'
import { TextGenerateEffect } from "@/components/TextGenerator";
import { supabase } from '@/config/supabaseClient';

import AboutUsSection from '@/widgets/Landing/AboutUsSection'
import InfiniteMovingCardsSection from '@/widgets/Landing/InfiniteMovingCardsSection';
import WobbleCardSection from '@/widgets/Landing/WobbleCardsSection';
import ServicesSection from '@/widgets/Landing/ServicesSection';

export default function Home() {
  // use observer API to set the #About section to be relative when the scrollArea is scrolled
  // console.log('The DataBase: ', supabase);
  return (
    <div className="bg-gradient-to-br from-bg to-bg-darker flex flex-col justify-center align-center items-center">
      <Hero />
      <ServicesSection />
      <WobbleCardSection />
      <InfiniteMovingCardsSection />
      <AboutUsSection />
      
      <div className="h-[40vh]"></div>
    </div >
  )
}