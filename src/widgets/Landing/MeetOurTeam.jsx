"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import MeetMember from "@/components/MeetMember";

const adminsData = [
    { id: 1, name: "Kermache Adlene", dep: "Executive", role: "President", src: "https://i.pinimg.com/736x/f3/78/4a/f3784adc704a1bc9bcb2e494cd39caee.jpg" },
    { id: 2, name: "Menadi Mohamed", dep: "Executive", role: "Vice_President", src: "https://st2.depositphotos.com/1317882/7825/i/450/depositphotos_78258620-stock-photo-cheerful-businessman-with-crossed-arms.jpg" },
    { id: 3, name: "Daif Oumaima", dep: "Executive", role: "General_Secretary", src: "https://img.freepik.com/premium-photo/young-white-handsome-man-shirt-strict-office-suit-stands-isolated-white-background_267786-4470.jpg" },
]

const teamData = [
    { id: 16, name: "Manaa Mohaned", dep: "IT", role: "Manager", src: "https://retratosbarcelona.com/wp-content/uploads/2022/09/Retratos_Barcelona_Corporate_Headshot_Iberent_3.jpg" },
    { id: 7, name: "Arbaoui Khadidja", dep: "Design", role: "Manager", src: "https://i.pinimg.com/736x/77/71/68/7771683223d86b237a3304d6f32828b9.jpg" },
    { id: 10, name: "Ahsatal Imad", dep: "Multimedia", role: "Manager", src: "https://static.wixstatic.com/media/331f88_2091d4d7434c4bafa4bdc6007e6855c4~mv2_d_3840_5760_s_4_2.jpg/v1/fill/w_260,h_354,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/331f88_2091d4d7434c4bafa4bdc6007e6855c4~mv2_d_3840_5760_s_4_2.jpg" },
    { id: 4, name: "Boucekkine Oumaima", dep: "Events", role: "Manager", src: "/Assets/Team/Ashref.jpg" },
    { id: 13, name: "Berbaoui Ashref", dep: "HR", role: "Manager", src: "https://media.istockphoto.com/id/838181996/fr/photo/portrait-dhommes-de-race-blanche.jpg?s=612x612&w=0&k=20&c=iff9ttGObtafZ1DaX2UubVw9pirguLuOQOXNlY_RFnA=" },
    { id: 19, name: "Chaabnia Enzo", dep: "Relex", role: "Manager", src: "https://i.pinimg.com/236x/89/13/51/891351a1fb95eae565ee1c1e2fd7e81d.jpg" },
];

export default function MeetOurTeam() {
    const adminsRef = useRef(null);
    const adminsInView = useInView(adminsRef, { once: true });

    const teamRef = useRef(null);
    const teamInView = useInView(teamRef, { once: true });

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };


    return (
        <div className="bg-gray-100 min-h-screen w-screen">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" ><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="absolute shape-fill w-screen bg-white" fill="#E1E4EA" fillOpacity="1"></path></svg>

            <div className="relative container mx-auto flex flex-col items-center justify-center align-center py-16">

                <motion.h1
                    className="mx-auto relative inline-block text-4xl vsm:text-5xl sm:text-7xl lg:text-8xl font-black text-center mb-12 bg-gradient-to-r from-secondary-dark to-secondary-light bg-clip-text text-transparent w-fit"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Meet our Team
                    <svg className="absolute top-0 -right-4 lg:-right-24 w-24 h-24" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 2000 2000"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ssstar-grad"><stop stopColor="#FFC208" stopOpacity="1" offset="0%"></stop><stop stopColor="#FDA916" stopOpacity="1" offset="100%"></stop></linearGradient></defs><g><g fill="url(#ssstar-grad)" id="star"><path d="M 500 500 C 1000 1000 1000 1000 2000 0 C 1000 1000 1000 1000 1500 1500 C 1000 1000 1000 1000 0 2000 C 1000 1000 1000 1000 500 500" strokeLinecap="round" strokeLinejoin="round"></path></g></g></svg>
                </motion.h1>

                <motion.h1
                    className="text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-extrabold text-center mb-12 text-primary-900"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Board Directors
                </motion.h1>

                <motion.div
                    ref={adminsRef}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-[repeat(3,20rem)] items-center justify-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate={adminsInView ? "visible" : "hidden"}
                >
                    {adminsData.map(member => (
                        <motion.div variants={itemVariants} key={member.id}>
                            <MeetMember
                                name={member.name}
                                role={`${member.dep} Manager`}
                                image={member.src || '/Assets/default-profile.png'}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Rest of the Team */}

                <motion.h1
                    className="text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-extrabold text-center mb-12 text-primary-900"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Team Leaders
                </motion.h1>

                <motion.div
                    ref={teamRef}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-[repeat(3,20rem)] items-center justify-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate={teamInView ? "visible" : "hidden"}
                >
                    {teamData.map(member => (
                        <motion.div variants={itemVariants} key={member.id}>
                            <MeetMember
                                name={member.name}
                                role={`${member.dep} Manager`}
                                image={member.src || '/Assets/default-profile.png'}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}