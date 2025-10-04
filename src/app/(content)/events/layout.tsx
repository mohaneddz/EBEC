import Footer from '@/layout/Footer';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
};
