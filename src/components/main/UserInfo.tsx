import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";

import Image from 'next/image'
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type UserInfoProps = {
    image: string;
    name: string;
    status: string;
    email: string;
    role: string;
    department: string;
    openModal: () => void;
    handleLogOut: () => void;
    handleDeleteAccount?: () => void;
    handleSaveChanges?: (name: string, image?: string) => void;
};

export default function UserInfo({ image, name, email, role, department, openModal, handleLogOut, status, handleSaveChanges }: UserInfoProps) {

    const [username, setUsername] = useState<string>(name);
    const [profileImage, setProfileImage] = useState<string>(image);
    const [canChangeDepartment, setCanChangeDepartment] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // moved inside effect to avoid changing dependencies on every render
        const isAllowedToChangeDepartment = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    console.error('Authentication error:', authError);
                    return false;
                }

                const { data, error } = await supabase
                    .from('department_switch')
                    .select('created_at')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Error fetching department switch data:', error);
                    return false;
                }

                if (!data || data.length === 0) {
                    return true; // No previous request, allow change
                }

                const lastRequest = new Date(data[0].created_at);
                const now = new Date();
                const oneDayMs = 24 * 60 * 60 * 1000;
                return (now.getTime() - lastRequest.getTime()) > oneDayMs;
            } catch (err) {
                console.error('Unexpected error:', err);
                return false;
            }
        };

        const checkPermission = async () => {
            const allowed = await isAllowedToChangeDepartment();
            setCanChangeDepartment(allowed);
        };
        checkPermission();
    }, []);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 256;
                    canvas.height = 256;
                    const size = Math.min(img.width, img.height);
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;
                    ctx?.drawImage(img, x, y, size, size, 0, 0, 256, 256);
                    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setProfileImage(croppedDataUrl);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // Updated save handler to store image in user_metadata
    const handleSave = async () => {

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Authentication error:', authError);
            return;
        }

        let imageUrl = image;

        if (profileImage !== image) {
            imageUrl = profileImage;
            setProfileImage(imageUrl);
        }

        if (handleSaveChanges) {
            handleSaveChanges(username, imageUrl);
        }
    };

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
                        {canChangeDepartment ? (
                            <p className="text-center text-xs">Need to <span className="text-primary-light-40 underline hover:text-secondary-dark click" onClick={openModal}>switch your department?</span></p>
                        ) : (
                            <p className="text-center text-xs text-gray-500/70">You can only request to change your department once a day</p>
                        )}
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
