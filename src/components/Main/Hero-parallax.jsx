'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { delay } from "motion";

export const HeroParallax = ({ products }) => {
  
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="sm:h-[155rem] md:h-[155rem] lg:h-[165rem] vsm:h-[150rem] h-[160rem] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 + 0.5, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 + 1, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </motion.div>

    </div>
  );
};

export const Header = () => {

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const title = ['ENSIA Business', <br key="br1" />, '& Entrepreneurship Club'];

  const smallTitle = [
    'ENSIA',
    <br key="br1" />,
    'Business',
    <br key="br2" />,
    '& Entrepreneurship',
    <br key="br3" />,
    'Club'
  ];

  return (
    <div className="w-screen relative mx-auto py-20 md:py-40 px-4 left-0 top-0 flex align-center items-start flex-col">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="md:text-center max-w-[80%] inline-block text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-extrabold text-primary-dark pl-8 text-start"
        style={{ textAlign: "start" }}
      >
        {isSmallScreen ? smallTitle : title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 2.5 }}
        className="text-start w-full text-wrap max-w-2xl text-sm md:text-md lg:text-xl mt-8 text-primary-light pl-8"
      >
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </motion.p>
    </div>
  );
};

export const ProductCard = ({ product, translate, transition, animate, initial }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-full sm:w-[30rem] relative flex-shrink-0"
    >
      <Link href="#" className="block group-hover/product:shadow-2xl">
        <motion.img
          src={product.thumbnail}
          height="350"
          width="350"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
          initial={{ opacity: 0 }} // Ensure images also fade in
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        <Link
          href={'#'}
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-lg"
          alt={product.title}
        ></Link>
      </h2>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-primary-dark pointer-events-none rounded-lg"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-secondary-dark rounded-lg">
        {product.title}
      </h2>
    </motion.div>
  );
};

