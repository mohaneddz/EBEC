"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react";
import { Button } from "@/components/Global/Button";
import Modal from "@/components/Global/Modal";
import supabase from '@/config/supabaseClient'
import UserInfo from "@/components/Main/UserInfo";
import { IconShieldFilled } from "@tabler/icons-react";

import Image from 'next/image'
const image1 = "/Assets/FakePFP/9.jpg";

export const UserPage = ({ id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const departments = ['AI', 'Marketing', 'ER', 'HR', 'Finance', 'Operations'];
    const [user, setUser] = useState(null);

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
        window.location.href = '/login';
    };

    const sendRequest = () => {
        console.log(`Sending request for department: ${selectedDepartment}`);
        closeModal(); // Close after "sending"
    }

    return (
        <div className='flex flex-col items-center justify-center'>

            <Modal isOpen={isVisible} onClose={closeModal} title="Select Department">
                {/* Use a grid with equal columns and justify-items-center */}
                <div className="grid grid-cols-3 gap-4 justify-items-center mt-4">
                    {departments.map((department) => (
                        <button
                            key={department}
                            onClick={() => handleSelect(department)}
                            className={`
                                w-24 h-12  
                                flex items-center justify-center
                                rounded-full
                                ${selectedDepartment === department
                                    ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-white'
                                    : 'bg-gradient-to-br from-primary-100 to-primary-200 text-slate-500'
                                }`}
                        >
                            {department}
                        </button>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Button
                        text={'Send Request'}
                        color1={'#1e4b8a'}
                        color2={'#1b3764'}
                        className="w-2/5 " // Removed extra mt-8, as we have margin on the container
                        onClick={sendRequest}
                    />
                </div>
            </Modal>
            { user && 
            // user.role === 'admin' && 
                <a href="/admin"
                    className={"fixed hover:scale-105 acitve:scale-95 bottom-0 right-0 m-8  rounded-full bg-gradient-to-br from-primary-light to-primary-dark text-white p-4 shadow-lg hover:shadow-xl transition duration-300 ease-in-out"}>
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

            {user &&

                <UserInfo name={user.name} email={user.email} role={user.role} department={'IT'} openModal={openModal} handleLogOut={handleLogOut} image={image1} />
            }

        </div>
    );
};

export default UserPage;