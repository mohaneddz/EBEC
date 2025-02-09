import Navbar from "@/layout/Navbar";

{/* <Navbar /> */ }
{/* <Footer /> */ }

export default function Body({ children }) {
  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
}