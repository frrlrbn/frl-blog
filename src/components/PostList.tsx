"use client";
import { useMemo, useRef, useState } from "react";
import PostListItem from "@/components/PostListItem";

type Post = {
  title: string;
  slug: string;
  excerpt?: string;
  date: string | Date;
  thumbnail?: string;
  tags?: string[];
};

export default function PostList({ posts }: { posts: Post[] }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((p) => {
      const inTitle = p.title?.toLowerCase().includes(query);
      const inExcerpt = p.excerpt?.toLowerCase().includes(query);
      const inTags = (p.tags || []).some((t) => t.toLowerCase().includes(query));
      return inTitle || inExcerpt || inTags;
    });
  }, [q, posts]);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.2-3.2" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts by title, tags, or keywords..."
            aria-label="Search posts"
            className="search-input w-full h-11 pl-9 pr-10 rounded-md border border-black/15 dark:border-white/15 bg-transparent outline-none text-sm placeholder:opacity-60 focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
          />
          {q ? (
            <button
              type="button"
              onClick={() => { setQ(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              title="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                <path strokeLinecap="round" d="M7 7l10 10M17 7L7 17" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <div className="text-xs opacity-70">
        {q ? (
          <span>
            Showing {filtered.length} result{filtered.length === 1 ? "" : "s"} for “{q}”.
          </span>
        ) : (
          <span>All posts ({posts.length})</span>
        )}
      </div>

      {filtered.length ? (
        <div className="space-y-8">
          {filtered.map((p) => (
            <PostListItem key={p.slug} {...p} />
          ))}
        </div>
      ) : (
        <div className="text-sm opacity-70">No posts found. Try a different keyword.</div>
      )}
    </section>
  );
}
