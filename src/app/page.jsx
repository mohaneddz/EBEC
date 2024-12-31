import React from 'react'

import Hero from '@/widgets/Landing/Hero'
import Cards from '@/widgets/WobbleCardDemo';
import InfiniteMovingCardsDemo from '@/widgets/Landing/InfiniteMovingCardsDemo';
import { TypewriterEffectDemo } from "@/components/Typewriter-effect";
import { TextGenerateEffect } from "@/widgets/TextGenerator";
import AboutUs from '@/components/AboutUs'
import { supabase } from '@/config/supabaseClient';

export default function Home() {
  // use observer API to set the #About section to be relative when the scrollArea is scrolled
  // console.log('The DataBase: ', supabase);
  return (
    <div className="bg-gradient-to-br from-bg to-bg-darker flex flex-col justify-center align-center items-center">
      <Hero />
      <TextGenerateEffect
        words="Moments To Remember"
        className="my-16 md:my-40 text-center"
      />
      <Cards />
      <TextGenerateEffect
        words="Voices from Our Community"
        className="my-16 md:my-40 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center"
      />
      <InfiniteMovingCardsDemo />
      <TextGenerateEffect
        words="Discover Our Team"
        className="my-16 md:my-40 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center"
      />
      <AboutUs />
      <div className="h-[40vh]"></div>
    </div >
  )
}