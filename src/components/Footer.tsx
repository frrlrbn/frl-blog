export default function Footer() {
  return (
    <footer className="mx-auto max-w-[72ch] px-4 py-10 text-center text-xs text-black/60 dark:text-white/60 border-t border-black/10 dark:border-white/10">
      © {new Date().getFullYear()} frrlrbn — All rights reserved.
    </footer>
  );
}
