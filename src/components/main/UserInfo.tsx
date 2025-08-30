import { motion } from "motion/react";
import { Input } from "@/components/global/Input";
import { Button } from "@/components/global/Button";

import Image from 'next/image'

type UserInfoProps = {
    image: string;
    name: string;
    email: string;
    role: string;
    department: string;
    openModal: () => void;
    handleLogOut: () => void;
};

export default function UserInfo({ image, name, email, role, department, openModal, handleLogOut }: UserInfoProps) {

    return (
        <div className="userSection mt-10 flex flex-col items-center justify-center">

            <div className="cursor-pointer relative z-30">
                <div className="relative w-40 h-40">
                    <Image
                        src={image}
                        alt="pfp"
                        fill
                        sizes="200px"
                        className="rounded-full border-solid border-4 border-secondary-600 active:scale-95 hover:cursor-default
                        shadow-lg hover:scale-105 transition-all duration-100 object-cover bg-center bg-cover"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>

            <motion.div className="lg:w-[25rem] md:w-[20rem] sm:w-[15rem] settings bg-white rounded-lg p-10 flex flex-col items-center -translate-y-4">
                <div className="w-full flex flex-col">
                    <div className="flex flex-col gap-2">
                        <Input id={`name-${name}`} value={name} placeholder="Name" readonly />
                        <Input id={`email-${email}`} value={email} placeholder="Email" type="email" readonly />
                        <Input id={`role-${role}`} value={role} placeholder="Role" readonly />
                        <div className="flex gap-0 flex-col">
                            <Input id={`department-${department}`} value={department} placeholder="Department" readonly />
                            <p className="text-center text-xs">Need to <span className="text-primary-light-40 underline click" onClick={openModal}>switch your department?</span></p>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center gap-4 [&>*]:w-full">
                        <Button text={'Logout'} color1={'#FFC208'} color2={'#FDA916'} onClick={handleLogOut} />
                    </div>
                </div>
            </motion.div>

        </div>
    );
};
