import { motion } from "motion/react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState, useEffect } from 'react';

import Image from 'next/image'

export default function UserInfo({ image, fname, lname, email, role, department, openModal, handleLogOut }) {
    const [imagePreview, setImagePreview] = useState(image);

    const handleImageClick = () => {
        document.getElementById('profilePicInput').click();

    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    useEffect(() => {
        // Cleanup function to revoke Object URL
        return () => {
            if (imagePreview && imagePreview !== image) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, image]);

    return (
        <div className="userSection mt-10 flex flex-col items-center justify-center">
            <div onClick={handleImageClick} className="cursor-pointer relative z-30">
                <div className="relative w-[200px] h-[200px]">
                    <Image
                        src={imagePreview}
                        alt="pfp"
                        fill
                        sizes="200px"
                        className="rounded-full border-solid border-4 border-secondary-600
            shadow-lg hover:opacity-90 transition-opacity object-cover"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <input
                    type="file"
                    id="profilePicInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>
            <motion.div className="lg:w-[35rem] md:w-[30rem] sm:w-[20rem] settings bg-white rounded-lg p-12 flex flex-col items-center -translate-y-4">
                <h1 className="text-3xl text-slate-700 font-semibold mb-6">Settings</h1>
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <Input value={fname} placeholder="First Name" readonly />
                    </div>
                    <div>
                        <Input value={lname} placeholder="Last Name" readonly />
                    </div>
                    <div>
                        <Input value={email} placeholder="Email" type="email" readonly />
                    </div>
                    <div>
                        <Input value={role} placeholder="Role" readonly />
                    </div>
                    <div>
                        <Input value={department} placeholder="Department" readonly />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-4 [&>*]:w-full">
                        <Button className="mt-4" text={'Change Department'} color1={'#1B3764'} color2={'#0E2A4D'} onClick={openModal} />
                        <Button className="mt-4" text={'Logout'} color1={'#FFC208'} color2={'#FDA916'} onClick={handleLogOut} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
