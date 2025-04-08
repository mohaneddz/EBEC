import localFont from "next/font/local";
import "@/app/globals.css";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "EBEC",
  description: "ENSIA's Business & Entrepreneurship Club",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head className="h-full">
        <title>EBEC</title>
        <link rel="icon" href="data:,"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
