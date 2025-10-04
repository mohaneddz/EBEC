import { ReactNode } from "react";

export interface CardData {
    id: string;
    title: string;
    description: string;
    src?: string;
    date?: string;
    location?: string;
    open?: boolean;
}


export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    imageUrl?: string;
}


export interface GlareCardDemoProps {
    cards: CardData[];
}

export interface GlareCardProps {
    enabled?: boolean;
    className?: string;
    cardData: CardData;
    onClick: () => void;
}