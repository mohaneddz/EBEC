"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

import Modal from "@/components/others/UpcomingEventsModal";
import Button from "@/components/global/Button";
import Toast, { ToastVariant } from "@/components/global/Toast";

import { GlareCard } from '@/components/events/GlareCard';
import { createClient } from '@/utils/supabase/client';

import type { CardData, GlareCardDemoProps } from '@/types/glareCard';


export function GlareCardDemo({ cards }: GlareCardDemoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [toasts, setToasts] = useState<{ id: number; message: string; variant: ToastVariant; }[]>([]);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const openModal = (card: CardData) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const addToast = (message: string, variant: ToastVariant = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts(current => current.filter(toast => toast.id !== id));
        }, duration);
    };

    const forward = () => {
        if (user?.id) {
            router.push(`/form/${selectedCard?.id}`);
        } else {
            addToast("Please login to register.", "error");
        }
    };

    return (
        <>
            <div className="grid max-w-7xl grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-3">
                {cards.map((card) => (
                    <GlareCard
                        enabled={card.title !== ""}
                        key={card.id}
                        className="w-full"
                        isOpen={card.open}
                        cardData={card}
                        onClick={() => openModal(card)}
                    />
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedCard?.title || "Card Details"}
                imageUrl={selectedCard?.src}
            >
                {selectedCard && (
                    <>
                        <div className="space-y-2">
                            <p className="text-gray-700">{selectedCard.description}</p>
                            <p className="text-sm text-gray-600">
                                <strong className='text-primary-light'>Date:</strong> {selectedCard.date || "TBD"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong className='text-primary-light'>Location:</strong> {selectedCard.location || "TBD"}
                            </p>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button 
                                onClick={forward} 
                                disabled={!selectedCard.open} 
                                color1="#FDA916" 
                                text={!selectedCard.open ? 'Soon' : (user?.id ? 'Register' : 'Login')} 
                            />
                        </div>
                    </>
                )}
            </Modal>
            
            <div className="fixed top-4 right-4 z-[100] space-y-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} variant={toast.variant} />
                ))}
            </div>
        </>
    );
}