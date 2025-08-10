import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[72ch] px-4 py-10 text-center text-xs text-black/60 dark:text-white/60 border-t border-black/10 dark:border-white/10">
      <div className="flex flex-col items-center gap-2">
        <div>© {new Date().getFullYear()} frrlrbn — All rights reserved.</div>
        <div>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
