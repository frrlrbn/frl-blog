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
  metadataBase: new URL("https://blog.farrel.id"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Muhammad Farrel Rabbani", url: "https://blog.farrel.id" }],
  creator: "Muhammad Farrel Rabbani",
  publisher: "Muhammad Farrel Rabbani",
  category: "Technology",
  keywords: ["blog", "technology", "programming", "web development", "tutorial", "anime", "farrel", "rabbani"],
  openGraph: {
    type: "website",
    url: "https://blog.farrel.id/",
    siteName: "Muhammad Farrel Rabbani | Blog",
    title: "Muhammad Farrel Rabbani | Blog",
    description: "A place to share my thoughts, technical notes, and design ideas.",
    images: [{ url: "/images/author.jpg", width: 1200, height: 630, alt: "Muhammad Farrel Rabbani" }],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    site: "@frrlrbn",
    creator: "@frrlrbn",
    title: "Muhammad Farrel Rabbani | Blog",
    description: "A place to share my thoughts, technical notes, and design ideas.",
    images: ["/images/author.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Replace with actual code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Critical page performance optimizations
              (function() {
                // Preload critical resources
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.href = '/fonts/Montserrat-VariableFont_wght.ttf';
                preloadLink.as = 'font';
                preloadLink.type = 'font/ttf';
                preloadLink.crossOrigin = 'anonymous';
                document.head.appendChild(preloadLink);
                
                // Image blur loading for markdown images
                document.addEventListener('DOMContentLoaded', function() {
                  const images = document.querySelectorAll('.prose img');
                  images.forEach(img => {
                    if (img.complete) {
                      img.style.filter = 'blur(0)';
                    } else {
                      img.addEventListener('load', function() {
                        this.style.filter = 'blur(0)';
                      });
                    }
                  });
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${montserrat.className} ${montserrat.variable} ${bitcount.variable} antialiased min-h-screen bg-white text-black dark:bg-black dark:text-white`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
