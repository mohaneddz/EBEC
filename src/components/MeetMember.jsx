import { motion } from "motion/react";
import Image from "next/image";

export default function MeetMember({ name, role, image }) {
    return (
        <div className="flex flex-col items-center justify-center align-center hover:scale-105 transition-transform duration-300 ease-in-out">
            <Image 
                src={image} 
                className="w-[20rem] h-[25rem] rounded-sm shadow-md shadow-black/30 hover:shadow-xl transition-shadow duration-300 ease-in-out object-cover object-center" 
                alt="Picture of the Manager" 
                width={500} 
                height={500} 
            />
            <div
                className="rounded-sm bg-primary-light h-24 w-[80%] text-white 
                            flex flex-col justify-center items-center -translate-y-16 ] shadow-md shadow-black/30 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-secondary-light">
                    {name}
                </h3>
                <h5>
                    {role}
                </h5>
            </div>
        </div>
    )
}