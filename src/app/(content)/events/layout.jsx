import Footer from "@/layout/Footer";

export const metadata = {
  title: "EBEC",
  description: "ENSIA's Business & Entrepreneurship Club",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <div className="overflow-x-hidden">{children}<Footer /></div>

  )
}
