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
        <div className="flex flex-col h-screen">
          <div className="flex-1 bg-gradient-to-br from-primary-dark to-primary-light">
            <div className="h-full py-20 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </Body>
    </>
  );
}