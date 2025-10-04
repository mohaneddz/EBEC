"use client";

import Modal from "./Modal";

type ConfirmDeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Delete"
            buttons={[
                { label: "Cancel", onClick: onClose },
                { label: "Delete", onClick: onConfirm, className: "bg-red-600 text-white hover:bg-red-700" }
            ]}
        >
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </Modal>
    );
}
