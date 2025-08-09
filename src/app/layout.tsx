import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

const bitcount = localFont({
  src: [
    { path: "../../public/fonts/BitcountGridSingle.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/Montserrat-VariableFont_wght.ttf", weight: "100 900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Farrel Rabbani | Blog",
  description: "A place to share my thoughts, technical notes, and design ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body className={`${montserrat.className} ${montserrat.variable} ${bitcount.variable} antialiased min-h-screen bg-white text-black dark:bg-black dark:text-white`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
