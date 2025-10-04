"use client";
import { Button } from "@/components/ui/button";

import Modal from "./Modal";
import { useState } from "react";

type PromoteUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (role: string) => void;
    onSubmit: (role: string) => void;
};

const roles = ["Manager", "Co-Manager", "President", "Vice-President", "SG", "Member"];

export default function PromoteUserModal({ isOpen, onClose, onSelect, onSubmit }: PromoteUserModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Promote User"
        >
            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => onSubmit(role)}
                        className="outline w-32 h-12 text-sm flex items-center justify-center px-2 cursor-pointer rounded-md text-center transition-colors duration-150 ease-in-out text-slate-400 hover:bg-secondary-400 hover:text-white"
                    >
                        {role}
                    </button>
                ))}
            </div>
        </Modal>
    );
}