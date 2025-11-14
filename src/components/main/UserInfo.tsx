import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";

import Image from 'next/image'
import { useUserInfo } from "@/hooks/useUserInfo";

type UserInfoProps = {
    image: string;
    name: string;
    status: string;
    email: string;
    role: string;
    department: string;
    openDepartmentsModal: () => void;
    openIssuesModal: () => void;
    handleLogOut: () => void;
    handleDeleteAccount?: () => void;
    handleSaveChanges?: (name: string, image?: string) => void;
};

export default function UserInfo({ image, name, email, role, department, openDepartmentsModal, openIssuesModal, handleLogOut, status, handleSaveChanges }: UserInfoProps) {

    const { username, setUsername, profileImage, canChangeDepartment, fileInputRef, handleImageClick, handleImageChange, handleSave } = useUserInfo(name, image, handleSaveChanges);

    return (
        <div className="userSection mt-10 flex flex-col items-center justify-center">

            <div className="cursor-pointer relative z-30" onClick={handleImageClick}>
                <div className="relative w-40 h-40">
                    <Image
                        src={profileImage}
                        alt="pfp"
                        fill
                        sizes="200px"
                        className="rounded-full border-solid border-4 border-secondary-600 active:scale-95 cursor-pointer
                        shadow-lg hover:scale-105 transition-all duration-100 object-cover bg-center bg-cover"
                        style={{ objectFit: 'cover', cursor: 'pointer' }}
                        onMouseOver={e => (e.currentTarget.style.cursor = 'pointer')}
                    />
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="cursor-pointer"
                accept="image/*"
                style={{ display: 'none' }}
            />

            <motion.div className="lg:w-[25rem] md:w-[20rem] sm:w-[15rem] settings bg-white rounded-lg px-10 pb-10 pt-6 flex flex-col items-center -translate-y-4">

                <p className="text-center text-xs pb-4 text-gray-500">Tap on the image to change your picture</p>


                <div className="w-full flex flex-col">

                    <div className="grid gap-4">

                        <div>
                            <Label className="mb-2" htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="border-gray-400"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className="border-gray-400"
                                required
                                value={email}
                                disabled
                                readOnly
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                type="text"
                                placeholder="Admin"
                                className="border-gray-400"
                                required
                                value={role}
                                disabled
                                readOnly
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                type="text"
                                placeholder="Engineering"
                                className="border-gray-400"
                                required
                                value={department}
                                disabled
                                readOnly
                            />
                        </div>
                        {canChangeDepartment ? (
                            <p className="text-center text-xs">Need to <span className="text-primary-light-40 underline hover:text-secondary-dark click" onClick={openDepartmentsModal}>switch your department?</span></p>
                        ) : (
                            <p className="text-center text-xs text-gray-500/70">You can only request to change your department once a day</p>
                        )}
                        <div>
                            <Label className="mb-2" htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                type="text"
                                placeholder="Active"
                                className="border-gray-400"
                                required
                                value={status}
                                disabled
                                readOnly
                            />
                        </div>

                        <p className="text-center text-xs">having an <span className="text-primary-light-40 underline hover:text-secondary-dark click" onClick={openIssuesModal}>issue</span> with your department?</p>

                    </div>

                    <div className="my-4">

                        <Button onClick={handleSave} className="mt-4 w-full text-white" variant="secondary">
                            Save Changes
                        </Button>

                        <div className="grid grid-cols-2 gap-4 w-full">

                            <Button onClick={handleLogOut} className="mt-6 w-full text-white" variant="default">
                                Logout
                            </Button>
                            <Button onClick={handleLogOut} className="mt-6 w-full text-white" variant="destructive">
                                Delete Account
                            </Button>

                        </div>
                    </div>

                </div>
            </motion.div>

        </div>
    );
};
