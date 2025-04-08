"use client";

// TODO fix overflow y on drop down
import { useState, useRef, useEffect } from 'react';
import { motion } from "motion/react";
import Image from "next/image";
import { IconPencil, IconUserX, IconCheck } from "@tabler/icons-react";
import supabase from '@/config/supabaseClient';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const changeButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
};

const kickButtonVariants = {
    initial: { scale: 1 },
    hover: { backgroundColor: "#f87171", color: "white", scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
};

const saveButtonVariants = {
    initial: {
        backgroundColor: "#E5E7EB",
        color: "#6B7280",
        scale: 1,
        cursor: "not-allowed"
    },
    hover: {
        backgroundColor: "#34D399",
        color: "white",
        scale: 1.1,
        transition: { duration: 0.2 },
        cursor: "pointer"
    },
    tap: { scale: 0.95, cursor: "pointer" },
    activeInitial: {
        backgroundColor: "#FFFFFF",
        color: "#6B7280",
        scale: 1,
        cursor: "pointer"

    }

};

export default function TeamMember({
    id,
    name,
    role,
    department,
    userPfp,
    availableDepartments,
    onDepartmentChange,
    onRoleChange,
    onRemoveMember,
    departmentChangeEnabled = true,
    roleChangeEnabled = true,
    removeMemberEnabled = true,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(department);
    const [selectedRole, setSelectedRole] = useState(role);
    const [departmentChanged, setDepartmentChanged] = useState(false);
    const [roleChanged, setRoleChanged] = useState(false);
    const dropdownRef = useRef(null);
    const [pendingDepartment, setPendingDepartment] = useState(department);
    const [pendingRole, setPendingRole] = useState(role);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setIsRoleDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDepartmentChange = (newDepartment) => {
        setPendingDepartment(newDepartment);
        setIsDropdownOpen(false);
    };

    const handleRoleChange = (newRole) => {
        setPendingRole(newRole);
        setIsRoleDropdownOpen(false);
    };

    const handleSaveChanges = () => {
        if (pendingDepartment !== department) {
            setSelectedDepartment(pendingDepartment);
            setDepartmentChanged(true);
            if (onDepartmentChange) {
                onDepartmentChange(id, pendingDepartment);
            }
            setTimeout(() => setDepartmentChanged(false), 2000);
        }

        if (pendingRole !== role) {
            setSelectedRole(pendingRole);
            setRoleChanged(true);
            if (onRoleChange) {
                onRoleChange(id, pendingRole);
            }
            setTimeout(() => setRoleChanged(false), 2000);
        }
        // supabase call to update the department and role
        const UpdateMember = async () => {
            try {
                const { data, error } = await supabase
                    .from('members')
                    .update({
                        department: pendingDepartment,
                        role: pendingRole
                    })
                    .eq('id', id);

                if (error) {
                    // console.error(error);
                    setUpdateError("Failed to Update member. Please try again.");
                } else {
                    // console.log(data);
                    if (onUpdateMember) {
                        onUpdateMember(id);
                    }
                }
            } catch (err) {
                // console.error(err);
                setUpdateError("An unexpected error occurred.");
            } finally {
                setIsRemoving(false);
            }
        };

    };

    const handleRemoveMember = () => {
        const removeMember = async () => {
            try {
                const { data, error } = await supabase
                    .from('members')
                    .delete()
                    .eq('id', id);

                if (error) {
                    // console.error(error);
                    setRemoveError("Failed to remove member. Please try again.");
                } else {
                    // console.log(data);
                    if (onRemoveMember) {
                        onRemoveMember(id);
                    }
                }
            } catch (err) {
                // console.error(err);
                setRemoveError("An unexpected error occurred.");
            } finally {
                setIsRemoving(false);
            }
        };

        removeMember();
    };

    const toggleDepartmentDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsRoleDropdownOpen(false); // Close the role dropdown
    };

    const toggleRoleDropdown = () => {
        setIsRoleDropdownOpen(!isRoleDropdownOpen);
        setIsDropdownOpen(false); // Close the department dropdown
    };



    const hasChanges = pendingDepartment !== department || pendingRole !== role;

    return (
        <motion.div
            className="relative m-8 w-96 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300  bg-white overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            ref={dropdownRef}
        >
            {/* Background SVGs */}
            <svg
                className="absolute top-0 left-0 h-full w-full pointer-events-none opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
            >
                <defs>
                    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="1000" height="1000" fill="url(#dots)" />
            </svg>
            {/* Top Section - Profile */}
            <div className="py-6 bg-gradient-to-br from-[#08258b] to-[#04113f] rounded-t-2xl">
                <div className="px-6 flex items-center space-x-4">
                    <Image
                        src={userPfp}
                        width={60}
                        height={60}
                        alt="Team Member Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                        <h3 className="text-xl font-semibold text-white">{name}</h3>
                        <p className="text-sm font-semibold text-orange-400">{role} - {department}</p>
                    </div>
                </div>
            </div>

            {/* Action Items - Department and Role change */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between py-1 relative">
                    <span className="text-sm font-medium text-gray-700">Department:</span>
                    <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${departmentChanged ? "text-green-600" : "text-gray-500"}`}>{departmentChangeEnabled ? pendingDepartment : department}</span>
                            {departmentChangeEnabled && (
                                <motion.button
                                    className="p-1 bg-secondary-800 hover:bg-secondary-600 rounded-full transition-colors duration-200 focus:outline-none"
                                    onClick={toggleDepartmentDropdown}
                                    variants={changeButtonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <IconPencil size={16} className=" text-white" />
                                </motion.button>
                            )}
                        </div>
                        {isDropdownOpen && departmentChangeEnabled && (

                            <motion.div
                                className="z-10 mt-1.5 w-full bg-white border rounded shadow-md absolute top-full right-0"
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {availableDepartments.map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => handleDepartmentChange(dept)}
                                        className="block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </motion.div>

                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between py-1 relative">
                    <span className="text-sm font-medium text-gray-700">Role:</span>
                    <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${roleChanged ? "text-green-600" : "text-gray-500"}`}>{roleChangeEnabled ? pendingRole : role}</span>
                            {roleChangeEnabled && (
                                <motion.button
                                    className="p-1 bg-secondary-800 hover:bg-secondary-600 rounded-full transition-colors duration-200 focus:outline-none"
                                    onClick={toggleRoleDropdown}
                                    variants={changeButtonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <IconPencil size={16} className="text-white" />
                                </motion.button>
                            )}
                        </div>
                        {isRoleDropdownOpen && roleChangeEnabled && (
                            <motion.div
                                className="z-10 mt-1.5 w-full bg-white border rounded shadow-md  absolute top-full right-0"
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {["Manager", "Co-Manager", "Member"].map((roleOption) => (
                                    <button
                                        key={roleOption}
                                        onClick={() => handleRoleChange(roleOption)}
                                        className="block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                                    >
                                        {roleOption}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons - Save and Kick */}
            <div className="flex overflow-hidden">

                <motion.button
                    // TODO swap red dark with red light
                    className={`w-1/2 py-3 px-4 text-sm font-medium text-white bg-red-700 transition-colors duration-200 focus:outline-none flex items-center justify-center space-x-2 border-t rounded-bl-2xl border-l`}
                    onClick={handleRemoveMember}
                    variants={kickButtonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                >
                    <span>Kick Member</span>
                    <IconUserX size={16} />
                </motion.button>


                <motion.button
                    className={`w-1/2 py-3 px-4 text-sm font-medium backgr transition-colors duration-200 focus:outline-none flex items-center justify-center space-x-2 border-t rounded-br-2xl ${hasChanges ? 'text-gray-700' : 'text-gray-500'}`}
                    onClick={hasChanges ? handleSaveChanges : undefined}
                    variants={saveButtonVariants}
                    initial={hasChanges ? "activeInitial" : "initial"}
                    whileHover={hasChanges ? "hover" : "initial"}
                    whileTap={hasChanges ? "tap" : "initial"}

                >
                    <span>Save Changes</span>
                    <IconCheck size={16} />
                </motion.button>

            </div>
        </motion.div>
    );
}