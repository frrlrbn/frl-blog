import Link from "next/link";
import RpsGame from "@/components/RpsGame";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10 text-center">
      <div className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-xs mb-6">
        404 — Not Found
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-black/70 dark:text-white/70">
        Feeling lost? Try your luck with a game of Rock, Paper, Scissors!
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm hover:opacity-90"
        >
          <span className="rotate-180 select-none">➔</span>
          <span>Back to Home</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-black/15 dark:border-white/15 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          View all posts
        </Link>
      </div>

      <div className="mt-12">
        <RpsGame />
      </div>
    </main>
  );
}
