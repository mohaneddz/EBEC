import React from 'react'

import Hero from '@/widgets/Landing/HeroSection'
// import { TextGenerateEffect } from "@/components/TextGenerator";
// import { supabase } from '@/config/supabaseClient';
import Footer from '@/layout/Footer';
import InfiniteMovingCardsSection from '@/widgets/Landing/InfiniteMovingCardsSection';
import WobbleCardSection from '@/widgets/Landing/WobbleCardsSection';
import ServicesSection from '@/widgets/Landing/ServicesSection';
import {EBECInfoSlide} from '@/widgets/Landing/EBECInfoSlide';
import MeetOurTeam from '@/widgets/Landing/MeetOurTeam';

export default function Home() {
  // use observer API to set the #About section to be relative when the scrollArea is scrolled
  // console.log('The DataBase: ', supabase);
  return (
    <div className="bg-[#e1e4ea] flex flex-col justify-center align-center items-center">
      <Hero />
      <MeetOurTeam />
      <EBECInfoSlide />
      <ServicesSection />
      <WobbleCardSection />
      <InfiniteMovingCardsSection />
      <Footer />

      {/* <div className="h-[40vh]"></div> */}
    </div >
  )
}