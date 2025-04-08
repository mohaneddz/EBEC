"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react";
import { Button } from "@/components/Global/Button";
import Modal from "@/components/Global/Modal";
import supabase from '@/config/supabaseClient'
import UserInfo from "@/components/Main/UserInfo";
import { IconShieldFilled } from "@tabler/icons-react";

const DEFAULT_PIC = "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"

export const UserPage = ({ id }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const departments = ['IT', 'HR', 'Multimedia', 'Design', 'Relex', 'Events'];
    const [user, setUser] = useState(null);
    const [motivation, setMotivation] = useState('');

    const handleMotivationChange = (e) => {
        setMotivation(e.target.value);
    }

    const handleSendRequest = () => {
        if (selectedDepartment) {
            sendRequest();
        } else {
            alert("Please select a department before sending a request.");
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }

        fetchUser();
    }, []);

    const handleSelect = (department) => {
        setSelectedDepartment(department);
    };

    const openModal = () => {
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
        setSelectedDepartment(null); // Reset selection on close
    };

    const handleLogOut = () => {
        supabase.auth.signOut()
            .then(() => {
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    const sendRequest = async () => {
        console.log(`Sending request for department: ${selectedDepartment}`);
        // add to supabase table for 'emails'
        const { data, error } = await supabase.from('Emails').insert([
            // the date must be in format YYYY-MM-DDTHH:MM:SSZ
            { name: user.user_metadata?.display_name, email: user.email, type: 'Change Department', message: `Change from ${user.user_metadata?.department} to ${selectedDepartment}.\nMotivation: ${motivation}`, date: new Date().toISOString() }
        ]);
        if (error) {
            console.error('Error sending request:', error);
        } else {
            console.log('Request sent successfully:', data);
        }

        closeModal();
    }

    const allowed = ['Pres  ident', 'Vice President', 'General Secretary']

    return (
        <div className='flex flex-col items-center justify-center'>

            <Modal isOpen={isVisible} onClose={closeModal} title="Select Department & Add Motivation">
                {/* Department Selection Grid */}
                <div className="grid grid-cols-3 gap-4 justify-items-center mt-4">
                    {departments.map((department) => (
                        <button
                            key={department}
                            onClick={() => handleSelect(department)}
                            // Consider slightly smaller buttons if text overflows, or adjust grid gap
                            className={`
                            w-24 h-12
                            text-sm // Added smaller text just in case names are long
                            flex items-center justify-center
                            px-2 
                            rounded-md
                            text-center 
                            transition-colors duration-150 ease-in-out
                            ${selectedDepartment === department
                                    ? 'bg-gradient-to-br from-secondary-light to-secondary-dark text-white shadow-md' // Enhanced selected style
                                    : 'bg-gradient-to-br from-primary-light to-primary-dark text-slate-400 hover:from-secondary-400 hover:to-secondary-600' // Adjusted unselected style
                                }`}
                        >
                            {department}
                        </button>
                    ))}
                </div>

                {/* Motivation Section */}
                <div className="mt-6"> {/* Increased margin-top for spacing */}
                    <label htmlFor="motivation" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Motivation (Optional)
                    </label>
                    <textarea
                        id="motivation"
                        rows="4" // Adjust rows as needed
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Briefly explain why you are requesting this department..."
                        value={motivation}
                        onChange={handleMotivationChange}
                    />
                </div>

                {/* Action Button */}
                <div className="flex justify-center mt-6"> {/* Adjusted margin-top */}
                    <Button
                        text={'Send Request'}
                        color1={'#FFC208'} color2={'#FDA916'}
                        className="w-2/5" // Keeping the width, adjust if needed
                        onClick={handleSendRequest} // Use the wrapper function
                        // Disable button if no department is selected (optional)
                        disabled={!selectedDepartment}
                    />
                </div>
            </Modal>

            {user &&

                (allowed.includes(user.user_metadata?.role) ||
                    ((user.user_metadata?.role === 'Manager') &&
                        (user.user_metadata?.department === 'IT' || user.user_metadata?.department === 'HR'))
                ) &&

                // user.role === 'admin' && 
                <a href="/admin"
                    className={"z-50 fixed hover:scale-105 acitve:scale-95 bottom-0 right-0 m-8  rounded-full bg-gradient-to-br from-primary-light to-primary-dark text-white p-4 shadow-lg hover:shadow-xl transition duration-300 ease-in-out"}>
                    <IconShieldFilled className="text-white " />
                </a>
            }

            <div className="custom-shape-divider-top-1738426196">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>

            <svg className="absolute bottom-80 left-24" xmlns="http://www.w3.org/2000/svg" width="25.007" height="25.007" viewBox="0 0 25.007 25.007">
                <path id="Path_770" d="M144.027,76.58H136.21V68.763a2.345,2.345,0,0,0-4.689,0V76.58H123.7a2.345,2.345,0,0,0,0,4.689h7.817v7.817a2.345,2.345,0,0,0,4.689,0V81.269h7.817a2.345,2.345,0,0,0,0-4.689Z" transform="translate(-121.362 -66.421)" fill="#FDA916"></path>
            </svg>

            <svg className="absolute bottom-24 left-24" xmlns="http://www.w3.org/2000/svg" width="100.27" height="98.45" viewBox="0 0 100.27 98.45">
                <defs>
                    <linearGradient id="linear-gradient" x1="-0.284" y1="-0.633" x2="1.896" y2="2.49" gradientUnits="objectBoundingBox">
                        <stop offset="0" className="text-primary-dark" stopColor="currentColor"></stop>
                        <stop offset="1" className="text-primary-700" stopColor="currentColor"></stop>
                    </linearGradient>
                    <filter id="Path_767" x="0" y="0" width="100.27" height="98.45" filterUnits="userSpaceOnUse">
                        <feOffset dx="1" dy="1" input="SourceAlpha"></feOffset>
                        <feGaussianBlur stdDeviation="0.5" result="blur"></feGaussianBlur>
                        <feFlood floodOpacity="0.149"></feFlood>
                        <feComposite operator="in" in2="blur"></feComposite>
                        <feComposite in="SourceGraphic"></feComposite>
                    </filter>
                </defs>
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_767)">
                    <path id="Path_767-2" d="M251.206,96.089a44.7,44.7,0,0,1,7.8-1.324c21.3-1.642,43.618,14.256,48.006,35.268,5.265,25.217-12.216,53.169-37.32,58.967s-53.347-12.1-58.321-37.384C206.565,127.191,227.572,102.259,251.206,96.089Z" transform="translate(-210.18 -94.15)" fill="url(#linear-gradient)"></path>
                </g>
            </svg>

            <svg className="absolute top-80 right-24" xmlns="http://www.w3.org/2000/svg" width="100.27" height="98.45" viewBox="0 0 100.27 98.45">
                <defs>
                    <linearGradient id="linear-gradient" x1="-0.284" y1="-0.633" x2="1.896" y2="2.49" gradientUnits="objectBoundingBox">
                        <stop offset="0" className="text-primary-dark" stopColor="currentColor"></stop>
                        <stop offset="1" className="text-primary-700" stopColor="currentColor"></stop>
                    </linearGradient>
                    <filter id="Path_767" x="0" y="0" width="100.27" height="98.45" filterUnits="userSpaceOnUse">
                        <feOffset dx="1" dy="1" input="SourceAlpha"></feOffset>
                        <feGaussianBlur stdDeviation="0.5" result="blur"></feGaussianBlur>
                        <feFlood floodOpacity="0.149"></feFlood>
                        <feComposite operator="in" in2="blur"></feComposite>
                        <feComposite in="SourceGraphic"></feComposite>
                    </filter>
                </defs>
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_767)">
                    <path id="Path_767-2" d="M251.206,96.089a44.7,44.7,0,0,1,7.8-1.324c21.3-1.642,43.618,14.256,48.006,35.268,5.265,25.217-12.216,53.169-37.32,58.967s-53.347-12.1-58.321-37.384C206.565,127.191,227.572,102.259,251.206,96.089Z" transform="translate(-210.18 -94.15)" fill="url(#linear-gradient)"></path>
                </g>
            </svg>

            {user && (
                <UserInfo
                    name={user.user_metadata?.display_name || "No Name"}
                    email={user.email}
                    role={user.user_metadata?.role || "Member"}
                    department={user.user_metadata?.department || "Unassigned"}
                    openModal={openModal}
                    handleLogOut={handleLogOut}
                    image={DEFAULT_PIC}
                />
            )}


        </div>
    );
};

export default UserPage;