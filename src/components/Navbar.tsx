"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[radial-gradient(100%_100%_at_50%_-20%,rgba(255,255,255,0.7),rgba(255,255,255,0)_60%),radial-gradient(100%_100%_at_50%_120%,rgba(0,0,0,0.2),rgba(0,0,0,0)_60%)] dark:bg-[radial-gradient(100%_100%_at_50%_-20%,rgba(0,0,0,0.6),rgba(0,0,0,0)_60%),radial-gradient(100%_100%_at_50%_120%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)] border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto max-w-[72ch] px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Home" className="block select-none">
          <Image src="/images/logo.png" alt="Logo" width={96} height={24} className="h-6 w-auto" priority />
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            aria-label="Home"
            title="Home"
            className={`p-1.5 rounded-md inline-flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 ${
              pathname === "/" ? "opacity-100 ring-1 ring-black/10 dark:ring-white/10" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
