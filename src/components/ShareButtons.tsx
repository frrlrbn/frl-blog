"use client";
import { useEffect, useRef, useState } from "react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaLink, FaCheck } from "react-icons/fa6";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    setUrl(window.location.href);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copy = async () => {
    const link = url || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(link);
      if (navigator.vibrate) navigator.vibrate(15);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      copy();
    }
  };

  const item = "inline-flex items-center gap-2 px-3 py-1.5 border border-black/15 dark:border-white/15 rounded-full text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/10";

  return (
    <div className="flex flex-wrap gap-2">
      <a className={item} href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`} target="_blank" rel="noopener noreferrer">
        <FaXTwitter /> X
      </a>
      <a className={item} href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noopener noreferrer">
        <FaFacebook /> Facebook
      </a>
      <a className={item} href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}`} target="_blank" rel="noopener noreferrer">
        <FaLinkedin /> LinkedIn
      </a>
      <button
        className={[
          item,
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 animate-pulse"
            : "",
        ].join(" ")}
        onClick={copy}
        aria-live="polite"
      >
        {copied ? <FaCheck /> : <FaLink />}
        {copied ? "Copied" : "Copy"}
        <span className="sr-only">{copied ? "Link copied to clipboard" : "Copy link to clipboard"}</span>
      </button>
      <button className={item} onClick={shareNative}>Share</button>
    </div>
  );
}
