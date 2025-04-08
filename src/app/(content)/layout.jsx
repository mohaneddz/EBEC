import Navbar from "@/layout/Navbar";

{/* <Navbar /> */ }
{/* <Footer /> */ }

export const metadata = {
  title: "EBEC",
  description: "ENSIA's Business & Entrepreneurship Club",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Body({ children }) {
  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
}