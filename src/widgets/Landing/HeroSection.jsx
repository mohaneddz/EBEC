"use client";

import { useEffect, useRef } from "react";
import { HeroParallax } from "@/components/Hero-parallax";

// importing the images 1-15
const image1 = "/Assets/Hero/1.jpg";
const image2 = "/Assets/Hero/2.jpg";
const image3 = "/Assets/Hero/3.jpg";
const image4 = "/Assets/Hero/4.jpg";
const image5 = "/Assets/Hero/5.jpg";
const image6 = "/Assets/Hero/6.jpg";
const image7 = "/Assets/Hero/7.jpg";
const image8 = "/Assets/Hero/8.jpg";
const image9 = "/Assets/Hero/9.jpg";
const image10 = "/Assets/Hero/10.jpg";
const image11 = "/Assets/Hero/11.jpg";
const image12 = "/Assets/Hero/12.jpg";
const image13 = "/Assets/Hero/13.jpg";
const image14 = "/Assets/Hero/14.jpg";
const image15 = "/Assets/Hero/15.jpg";

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
        >
            < HeroParallax products={products} />
        </div>
    );
};

export default Hero;