import Image from "next/image";
import { Button } from "@/components/Button";
import { useContext } from "react"; 
import { ScrollContext } from "@/app/(content)/events/page"; 

const image1 = "/Assets/Hero/2.jpg";

export default function EventsHeroSection() {
    const scrollToUpcomingEvents = useContext(ScrollContext);

    return (
        <div className="relative w-screen overflow-x-hidden h-[calc(100vh-5rem)]">
            <Image
                src={image1}
                alt="Events"
                width={1200}
                height={1200}
                priority
                className="object-cover w-full h-full brightness-75 overflow-x-hidden"
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-9xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-200 text-center font-poppins tracking-wide">
                    Explore Our Events!
                </h1>

                <Button
                    variant="outline"
                    size="lg"
                    className="text-foreground hover:text-primary-foreground z-40"
                    aria-label="Scroll to Upcoming Events"
                    text="I'm Ready!"
                    onClick={scrollToUpcomingEvents} // Call the function from context
                />

            </div>

            {/* Vignette, gradient, blur */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 z-10 backdrop-blur-[2px]" />

            <h1 className="z-40 bottom-0 absolute flex justify-center items-center w-screen bg-gradient-to-b from-secondary-light to-secondary-dark h-24 text-5xl font-black text-black">
                EBEC
            </h1>

        </div>
    )
}