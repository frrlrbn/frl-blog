"use client";
import { useEffect, useState } from "react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa6";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
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

  const item = "inline-flex items-center gap-2 px-3 py-1.5 border border-black/15 dark:border-white/15 rounded-full text-xs hover:bg-black/5 dark:hover:bg-white/10";

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
      <button className={item} onClick={copy}><FaLink /> Copy</button>
      <button className={item} onClick={shareNative}>Share</button>
    </div>
  );
}
