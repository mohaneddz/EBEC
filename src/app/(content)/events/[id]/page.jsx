"use client";

import React from 'react';
import { CarouselDemo } from '@/components/Carousel.jsx';
import { IconArrowBackUp } from "@tabler/icons-react";
import supabase from '@/config/supabaseClient';
import { useRef, useState, useEffect } from "react";

const image1 = "/Assets/Hero/12.jpg";
import Link from 'next/link';
import { jsx } from 'react/jsx-runtime';

export default function event({ params }) {

  useRef(null);
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;

  const [event, setEvent] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchevent = async () => {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .eq('id', id);

      if (error) {
        setFetchError('Could not fetch the event!');
        setEvent(null);
        console.log('Fetch error:', error);
      }
      if (data) {
        const eventData = data[0];
        if (eventData?.description) {
          eventData.description = eventData.description.split(' ');
        }
        console.log('event :', eventData);
        setEvent(eventData);
        setFetchError(null);
      }
    };
    fetchevent();
  }, [id]);

  return (
    <div className="relative min-h-screen">

      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="774.5"
        height="748.5"
        viewBox="0 0 1549.042 1497.154"
        className="absolute -top-80 -right-80 -z-10"
      >
        <defs>
          <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
            <image href={image1} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        <path
          id="Path_1348"
          d="M-268.447,1407.859c-57.044,282.493-422.576,619.3-422.576,619.3S-905.2,2194.742-1066.237,2253.6s-353.144-13.894-459.413-204.364c-48.99-87.805-70.948-104.507-141.862-228.761s-120.947-177.409-141.8-268.254c-15.75-171.988,44.143-285.293,44.143-285.293s228.146-367.248,553.725-459.682c199.9-56.754,569.536-47.747,786.312,133.47C-288.322,1055.081-246.428,1298.815-268.447,1407.859Z"
          transform="translate(2000 -1000)"
          fill="url(#imagePattern)"
        />
      </svg> */}


      {/* gradient background */}
      <div className="p-8 mb-16 bg-gradient-to-br from-primary-dark to-primary-light">

        <Link href="/event" className='z-40 inline-block'>
          <IconArrowBackUp className="z-40 my-4 ml-4 text-primary-dark h-12 w-12 p-2 flex-shrink-0 bg-white rounded-full" />
        </Link>

        <h1 className="text-2xl text-center w-screen vsm:text-3xl sm:text-5xl lg:text-7xl mb-4 font-bold flex justify-center content-center items-center text-secondary-dark">
          {event?.name}</h1>
        <h2 className="text-white text-center w-screen text-md vsm:text-lg sm:text-xl lg:text-3xl font-semibold">{event?.brief}</h2>
        <h3 className="text-slate-400 text-center w-screen  text-xs vsm:text-sm sm:text-base lg:text-lg mb-8 font-medium">{event?.date} | {event?.location}</h3>
      </div>
      <p className='px-8 mb-8 text-lg leading-relaxed mx-auto'>
        {event?.description && event?.description.length > 0 ? (
          <>
            <span className="font-bold text-2xl">{event?.description[0]}</span>
            {event?.description[1] ? ' ' + event?.description.slice(1).join(' ') : ''}
          </>
        ) : 'No description available'}
      </p>
      {event?.mainPicture && (
        <CarouselDemo images={[event.mainPicture, ...(event?.pictures || [])]} />
      )}
    </div>
  );
}