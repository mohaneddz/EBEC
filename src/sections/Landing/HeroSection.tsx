import HeroParallax from "@/components/main/HeroParallax";
import HeroHeader from "@/components/main/HeroHeader";

const cards = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Memory`,
  thumbnail: `imgs/general/${i + 1}.avif`
}));

export default function Hero() {
  return (
    <div id="HeroSection" className="w-full min-w-max h-full">
      <div className="sm:h-[155rem] md:h-[155rem] lg:h-[165rem] vsm:h-[150rem] h-[160rem] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
        <HeroHeader />
        <HeroParallax cards={cards} />
      </div>

      <div className="bg-gray-100">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="absolute shape-fill w-screen bg-white" fill="#E1E4EA" fillOpacity="1"></path>
        </svg>
      </div>

    </div>
  );
}
