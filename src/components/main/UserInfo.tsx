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
                <div className="relative w-[200px] h-[200px]">
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
            <motion.div className="lg:w-[35rem] md:w-[30rem] sm:w-[20rem] settings bg-white rounded-lg p-12 flex flex-col items-center -translate-y-4">
                <h1 className="text-3xl text-slate-700 font-semibold mb-6">Settings</h1>
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <Input value={name} placeholder="Name" readonly />
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
