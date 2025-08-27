import Image from "next/image";
import ToUpcomingEventsButton from "@/components/events/ToUpcomingEventsButton";

const image = "/imgs/general/2.avif";

export default function EventsHeroSection() {


    return (
        <div className="relative w-screen overflow-x-hidden h-[calc(100vh-3rem)] mb-16">
            <Image
                src={image}
                alt="Events"
                width={1200}
                height={1200}
                priority
                className="object-cover w-full h-full brightness-75 overflow-x-hidden"
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6">
                <p className="text-4xl md:text-5xl lg:text-7xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-200 text-center font-poppins tracking-wide">
                    Explore Our Events!
                </p>
                <ToUpcomingEventsButton />
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
            <div className="absolute inset-0 z-10 backdrop-blur-[2px]" />
            <div className="absolute top h-[100%] inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
    )
}