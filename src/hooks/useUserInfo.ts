import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useUserInfo(initialName: string, initialImage: string, handleSaveChanges?: (name: string, image?: string) => void) {
    const [username, setUsername] = useState<string>(initialName);
    const [profileImage, setProfileImage] = useState<string>(initialImage);
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

        let imageUrl = initialImage;

        if (profileImage !== initialImage) {
            imageUrl = profileImage;
            setProfileImage(imageUrl);
        }

        if (handleSaveChanges) {
            handleSaveChanges(username, imageUrl);
        }
    };

    return {
        username,
        setUsername,
        profileImage,
        setProfileImage,
        canChangeDepartment,
        fileInputRef,
        handleImageClick,
        handleImageChange,
        handleSave,
    };
}