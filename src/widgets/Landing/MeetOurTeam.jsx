"use client";

import { motion, useInView } from "framer-motion"; // Note: Changed from motion/react based on common usage, adjust if 'motion/react' is specifically required by your setup
import { useEffect, useRef, useState } from "react";
import MeetMember from "@/components/Main/MeetMember";
import supabase from "@/config/supabaseClient";

const DEFAULT_PIC = "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"

export default function MeetOurTeam() {

    const adminsRef = useRef(null);
    const adminsInView = useInView(adminsRef, { once: true });

    const teamRef = useRef(null);
    const teamInView = useInView(teamRef, { once: true });

    const [team, setTeam] = useState(null); // Initialize as null
    const [admins, setAdmins] = useState(null); // Initialize as null
    const [isLoading, setIsLoading] = useState(true); // Single loading state, initially true
    const [fetchError, setFetchError] = useState(null); // Optional: state to hold fetch errors

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Removed loadTeam and loadAdmins states

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

    const adminRoles = ["President", "Vice President", "General Secretary"];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Ensure loading is true when fetch starts
            setFetchError(null); // Reset error state
            setTeam(null);      // Reset data states
            setAdmins(null);

            try {
                const { data, error } = await supabase.from('Forefront').select('*');

                if (error) {
                    console.error('Error fetching data:', error);
                    setFetchError('Could not fetch team data.');
                    setTeam([]); // Set to empty array on error to avoid null issues in map
                    setAdmins([]);
                } else if (data) {
                    console.log('Fetched data:', data);

                    const teamMembers = data.filter(member => !adminRoles.includes(member.department));
                    const adminMembers = data.filter(member => adminRoles.includes(member.department));

                    setTeam(teamMembers);
                    setAdmins(adminMembers);
                    // Logs inside here won't show the updated state immediately
                } else {
                    // Handle case where data is null/undefined but no error occurred
                     setTeam([]);
                     setAdmins([]);
                }
            } catch (err) {
                 console.error('Unexpected error during fetch:', err);
                 setFetchError('An unexpected error occurred.');
                 setTeam([]);
                 setAdmins([]);
            } finally {
                setIsLoading(false); // Set loading to false when fetch completes (success or error)
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Optional: You can log the state outside useEffect to see updates on re-renders
    // useEffect(() => {
    //    console.log("Admins state updated:", admins);
    //    console.log("Team state updated:", team);
    // }, [admins, team]);

    // --- Helper function for rendering placeholders ---
    const renderPlaceholders = (count) => {
        return Array.from({ length: count }).map((_, index) => (
            <div key={`placeholder-${index}`} className="w-full aspect-[3/4] sm:aspect-[4/5] bg-slate-300 rounded-lg animate-pulse duration-75"></div>
            // Adjusted aspect ratio slightly for common card shapes, revert if needed
        ));
    };

    return (
        <div className="bg-gray-100 min-h-screen w-screen overflow-x-hidden"> {/* Added overflow-x-hidden */}
            {/* ... SVG remains the same ... */}
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" ><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="absolute shape-fill w-screen bg-white" fill="#E1E4EA" fillOpacity="1"></path></svg>


            <div className="relative container mx-auto flex flex-col items-center justify-center align-center py-16 px-4 sm:px-6 lg:px-8"> {/* Added padding */}

                {/* ... Main Title H1 remains the same ... */}
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


                {/* Board Directors Section */}
                <motion.h1
                    className="text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-extrabold text-center my-12 text-primary-900" // Added margin-y
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Board Directors
                </motion.h1>

                <motion.div
                    ref={adminsRef}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl place-items-center" // Adjusted grid and added width/centering
                    variants={containerVariants}
                    initial="hidden"
                    animate={adminsInView ? "visible" : "hidden"}
                >
                    {isLoading ? (
                         renderPlaceholders(3) // Show 3 placeholders while loading
                    ) : fetchError ? (
                        <p className="col-span-full text-red-600 text-center">{fetchError}</p> // Show error
                    ) : admins && admins.length > 0 ? (
                        admins.map(member => (
                            <motion.div variants={itemVariants} key={member.id} className="w-full max-w-xs sm:max-w-sm"> {/* Ensure items have width */}
                                <MeetMember
                                    name={member.name}
                                    role={`${member.department}`}
                                    image={member.picture ? member.picture : DEFAULT_PIC}
                                />
                            </motion.div>
                        ))
                    ) : (
                         <p className="col-span-full text-gray-600 text-center">No board directors found.</p> // Message if no admins
                    )}
                </motion.div>

                {/* Team Leaders Section */}
                <motion.h1
                    className="text-2xl vsm:text-3xl sm:text-5xl lg:text-7xl font-extrabold text-center my-12 text-primary-900" // Added margin-y
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Team Leaders
                </motion.h1>

                <motion.div
                    ref={teamRef}
                     className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl place-items-center" // Adjusted grid and added width/centering
                    variants={containerVariants}
                    initial="hidden"
                    animate={teamInView ? "visible" : "hidden"}
                >
                    {isLoading ? (
                        renderPlaceholders(6) // Show 6 placeholders while loading
                    ) : fetchError ? (
                         <p className="col-span-full text-red-600 text-center">{fetchError}</p> // Show error (might be redundant if shown above)
                    ) : team && team.length > 0 ? (
                        team.map(member => (
                            <motion.div variants={itemVariants} key={member.id} className="w-full max-w-xs sm:max-w-sm"> {/* Ensure items have width */}
                                <MeetMember
                                    name={member.name}
                                    role={`${member.department} Manager`}
                                    image={member.picture ? member.picture : DEFAULT_PIC}
                                />
                            </motion.div>
                        ))
                    ) : (
                         <p className="col-span-full text-gray-600 text-center">No team leaders found.</p> // Message if no team members
                    )}
                </motion.div>
            </div>
        </div>
    );
}