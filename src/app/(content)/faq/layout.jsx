import Body from "@/layout/Body";
import Footer from "@/layout/Footer";

export const metadata = {
  title: "FAQ",
  description: "Answering your Questions!",
};

export default function FaqLayout({ children }) {
  return (
    <>
      <Body>
        <div className="flex flex-col min-h-min h-[calc(100vh-5rem)] overflow-x-hidden">
          <div className="flex-1 bg-gradient-to-br from-primary-dark to-primary-light">
            {children}
          </div>
        </div>
        <Footer />
      </Body>
    </>
  );
}