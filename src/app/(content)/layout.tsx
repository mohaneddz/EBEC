import Navbar from "@/layout/Navbar";
import Footer from '@/layout/Footer';

import { ReactNode } from 'react';

export const metadata = {
  title: "EBEC",
  description: "ENSIA's Business & Entrepreneurship Club",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Body({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}