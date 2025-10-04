"use client";

import Modal from "./Modal";

// Assuming departments is imported or defined elsewhere
const departments = ['IT' , 'Finance' , 'Media' , 'Design' , 'Relex' , 'Events' , 'Logistics', 'Executive', 'HR']; 

type ChangeDepartmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (department: string) => void;
};

export default function ChangeDepartmentModal({ isOpen, onClose, onSubmit }: ChangeDepartmentModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Department"
        >
            <div className="flex flex-wrap gap-2">
                {departments.map((department: string) => (
                    <button
                        key={department}
                        onClick={() => onSubmit(department)}
                        className="outline w-32 h-12 text-sm flex items-center justify-center px-2 cursor-pointer rounded-md text-center transition-colors duration-150 ease-in-out text-slate-400 hover:bg-secondary-400 hover:text-white"
                    >
                        {department}
                    </button>
                ))}
            </div>
        </Modal>
    );
}
