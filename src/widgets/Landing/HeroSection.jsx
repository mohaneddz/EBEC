"use client";


import { useEffect, useRef } from "react";
import { HeroParallax } from "@/components/Main/Hero-parallax";

// importing the images 1-15
const image1 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//1.jpg";
const image2 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//2.jpg";
const image3 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//3.jpg";
const image4 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//4.jpg";
const image5 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//5.jpg";
const image6 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//6.jpg";
const image7 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//7.jpg";
const image8 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//8.jpg";
const image9 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//9.jpg";
const image10 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//10.jpg";
const image11 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//11.jpg";
const image12 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//12.jpg";
const image13 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//13.jpg";
const image14 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//14.jpg";
const image15 = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/Event%20Images//15.jpg";

const Hero = ({ }) => {

    const titleRef = useRef(null);
    const products = [
        { id: 1, name: "Product 1", title: 'Event Image', thumbnail: image1 },
        { id: 2, name: "Product 2", title: 'Event Image', thumbnail: image2 },
        { id: 3, name: "Product 3", title: 'Event Image', thumbnail: image3 },
        { id: 4, name: "Product 4", title: 'Event Image', thumbnail: image4 },
        { id: 5, name: "Product 5", title: 'Event Image', thumbnail: image5 },
        { id: 6, name: "Product 6", title: 'Event Image', thumbnail: image6 },
        { id: 7, name: "Product 7", title: 'Event Image', thumbnail: image7 },
        { id: 8, name: "Product 8", title: 'Event Image', thumbnail: image8 },
        { id: 9, name: "Product 9", title: 'Event Image', thumbnail: image9 },
        { id: 10, name: "Product 10", title: 'Event Image', thumbnail: image10 },
        { id: 11, name: "Product 11", title: 'Event Image', thumbnail: image11 },
        { id: 12, name: "Product 12", title: 'Event Image', thumbnail: image12 },
        { id: 13, name: "Product 13", title: 'Event Image', thumbnail: image13 },
        { id: 14, name: "Product 14", title: 'Event Image', thumbnail: image14 },
        { id: 15, name: "Product 15", title: 'Event Image', thumbnail: image15 },
    ];

    return (
        <div ref={titleRef}
            id='HeroSection'
            className=""
        >
            < HeroParallax products={products} />
        </div>
    );
};

export default Hero;