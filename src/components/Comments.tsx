"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import BlurAvatar from "@/components/BlurAvatar";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import type { Session } from "next-auth";

type CommentItem = {
  _id?: string;
  slug: string;
  content: string;
  createdAt: string;
  author: { id: string; name?: string | null; image?: string | null };
  parentId?: string;
};

const MAX_LEN = 500;

export default function Comments({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; open: boolean } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const fetchComments = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const json = await res.json();
      setComments(json.comments ?? []);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchComments(); }, [slug]);

  const submit = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        await fetchComments();
      }
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (parentId: string) => {
    const replyText = (replyTextMap[parentId] ?? "").trim();
    if (!replyText) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: replyText, parentId }),
      });
      if (res.ok) {
        setReplyTextMap((m) => ({ ...m, [parentId]: "" }));
        setReplyTo(null);
        await fetchComments();
      }
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    const res = await fetch(`/api/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await fetchComments();
    }
  };

  const relativeTime = (iso: string) => {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = (then - now) / 1000; // seconds (negative in past)
    const abs = Math.abs(diff);
    if (abs < 45) return "Just now";
    if (abs < 90) return rtf.format(Math.round(diff / 60), "minute");
    const mins = Math.round(diff / 60);
    if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
    const hours = Math.round(diff / 3600);
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    const days = Math.round(diff / 86400);
    if (Math.abs(days) < 7) return rtf.format(days, "day");
    const weeks = Math.round(diff / 604800);
    if (Math.abs(weeks) < 5) return rtf.format(weeks, "week");
    const months = Math.round(diff / (2629800)); // ~1 month
    if (Math.abs(months) < 12) return rtf.format(months, "month");
    const years = Math.round(diff / (31557600));
    return rtf.format(years, "year");
  };

  // Build tree of comments (parent -> replies) with memo to keep subtree stable
  const { roots, childrenMap } = useMemo(() => {
    const r = comments.filter((c) => !c.parentId);
    const map = new Map<string, CommentItem[]>();
    for (const c of comments) {
      if (c.parentId) {
        const arr = map.get(c.parentId) ?? [];
        arr.push(c);
        map.set(c.parentId, arr);
      }
    }
    return { roots: r, childrenMap: map };
  }, [comments]);

  const canDelete = (c: CommentItem) => {
    const sid = (session?.user as any)?.id || session?.user?.email;
    return !!sid && sid === c.author?.id;
  };

  const ReplyBox = ({ parentId }: { parentId: string }) => {
    const taRef = useRef<HTMLTextAreaElement | null>(null);
    const value = replyTextMap[parentId] ?? "";

    const autoResize = () => {
      const ta = taRef.current;
      if (!ta) return;
      ta.style.height = "0px";
      ta.style.height = Math.min(200, ta.scrollHeight) + "px"; // cap growth for UX
    };

    useEffect(() => {
      autoResize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <div className="mt-2 pl-8">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setReplyTextMap((m) => ({ ...m, [parentId]: e.target.value }))}
          onInput={autoResize}
          placeholder="Write a reply..."
          aria-label="Write a reply"
          inputMode="text"
          autoComplete="off"
          spellCheck
          maxLength={MAX_LEN}
          className="w-full min-h-24 sm:h-20 p-4 sm:p-3 text-base sm:text-sm leading-7 sm:leading-6 rounded-lg resize-none overflow-hidden border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
        <div className="mt-1 text-xs text-left sm:text-right">
          <span
            className={(() => {
              const len = value.length;
              return len >= MAX_LEN
                ? "text-red-500"
                : len >= 450
                ? "text-yellow-600 dark:text-yellow-400"
                : "opacity-60";
            })()}
          >
            {value.length}/{MAX_LEN}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            disabled={
              loading ||
              !value.trim() ||
              value.trim().length > MAX_LEN
            }
            onClick={() => { submitReply(parentId); }}
            className="text-sm px-3 py-2 sm:py-1.5 rounded-md border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
          >
            Reply
          </button>
          <button
            onClick={() => { setReplyTo(null); setReplyTextMap((m) => ({ ...m, [parentId]: "" })); }}
            className="text-sm px-3 py-2 sm:py-1.5 rounded-md border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold">Comments</h3>

      {session ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            {session.user?.image ? (
              <BlurAvatar src={session.user.image} alt="avatar" className="size-6 rounded-full" />
            ) : null}
            <span className="opacity-70">{session.user?.name ?? session.user?.email}</span>
            <button onClick={() => signOut()} className="ml-auto underline opacity-70 hover:opacity-100">Sign out</button>
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            maxLength={MAX_LEN}
            className="w-full h-24 p-3 text-sm rounded-md resize-none border border-black/15 dark:border-white/15 bg-transparent outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <div className="text-xs text-right mt-1">
            <span className={commentText.length >= MAX_LEN ? "text-red-500" : commentText.length >= 450 ? "text-yellow-600 dark:text-yellow-400" : "opacity-60"}>
              {commentText.length}/{MAX_LEN}
            </span>
          </div>
          <button
            disabled={loading || !commentText.trim() || commentText.trim().length > MAX_LEN}
            onClick={submit}
            className="text-sm px-4 py-2 rounded-md border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <div className="text-sm">
          <p className="opacity-70">Sign in to comment</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium border border-black/15 dark:border-white/15 bg-white text-neutral-900 hover:bg-neutral-50 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-white dark:text-neutral-900"
            >
              <FaGoogle className="text-[#000000]" />
              Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium border border-black/15 dark:border-white/15 bg-neutral-900 text-white hover:bg-black shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              <FaGithub />
              GitHub
            </button>
          </div>
        </div>
      )}

      {fetching ? (
        <div className="rounded-md border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] p-6 flex items-center justify-center min-h-24">
          <PixelDotsLoader />
        </div>
      ) : (
        <ul className="space-y-4">
          {roots.map((c) => (
          <li key={c._id} className="text-sm">
            <div className="flex items-center gap-2">
              {c.author?.image ? (
                <BlurAvatar src={c.author.image!} alt="avatar" className="size-6 rounded-full" />
              ) : null}
              <span className="font-medium">{c.author?.name ?? "Anon"}</span>
              <span className="opacity-60">{relativeTime(c.createdAt)}</span>
              <div className="ml-auto flex items-center gap-1.5">
                {session ? (
                  <button
                    aria-label="Reply"
                    title="Reply"
                    onClick={() => setReplyTo(replyTo === c._id ? null : c._id!)}
                    className="p-1 rounded opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l-4 4m0 0l4 4M3 11h10a7 7 0 017 7v0" />
                    </svg>
                    <span className="sr-only">Reply</span>
                  </button>
                ) : null}
                {canDelete(c) ? (
                  <button
                    aria-label="Delete"
                    title="Delete"
                    onClick={() => setConfirmDelete({ id: c._id!, open: true })}
                    className="p-1 rounded opacity-60 hover:opacity-100 hover:bg-red-500/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
                    </svg>
                    <span className="sr-only">Delete</span>
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-1 leading-6 whitespace-pre-wrap">{c.content}</p>
            {replyTo === c._id ? <ReplyBox key={`reply-${c._id}`} parentId={c._id!} /> : null}
            {/* Replies toggle and list */}
            {(() => {
              const replies = childrenMap.get(c._id!) ?? [];
              if (!replies.length) return null;
              const isOpen = !!expandedReplies[c._id!];
              return (
                <div className="mt-2">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedReplies((m) => ({ ...m, [c._id!]: !m[c._id!] }))}
                    className="text-xs opacity-70 hover:opacity-100 underline"
                  >
                    {isOpen ? "Hide Replies" : `Show Replies (${replies.length})`}
                  </button>
                  {isOpen ? (
                    <ul className="mt-3 space-y-3">
                      {replies.map((r) => (
                  <li key={r._id} className="relative pl-12">
                    {/* Curved thread line */}
                    <svg
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 h-full w-10 text-black/20 dark:text-white/20"
                      viewBox="0 0 40 100"
                      preserveAspectRatio="none"
                    >
                      <path d="M 12 0 v 24 q 0 8 8 8 h 12" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <div className="rounded-md border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2">
                        {r.author?.image ? (
                          <BlurAvatar src={r.author.image!} alt="avatar" className="size-5 rounded-full" />
                        ) : null}
                        <span className="font-medium">{r.author?.name ?? "Anon"}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70">↳ to {c.author?.name ?? "Anon"}</span>
                        <span className="opacity-60">{relativeTime(r.createdAt)}</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          {/* Disable replying to replies: no Reply button here */}
                          {canDelete(r) ? (
                            <button
                              aria-label="Delete"
                              title="Delete"
                              onClick={() => setConfirmDelete({ id: r._id!, open: true })}
                              className="p-1 rounded opacity-60 hover:opacity-100 hover:bg-red-500/10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
                              </svg>
                              <span className="sr-only">Delete</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-2 leading-6 whitespace-pre-wrap">{r.content}</p>
                      {/* No reply box for replies */}
                    </div>
                  </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })()}
          </li>
          ))}
        </ul>
      )}

      {/* Confirm delete modal */}
      {confirmDelete?.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-white/15 bg-neutral-900 p-5 text-white shadow-xl">
            <h4 className="text-sm font-semibold mb-2">Hapus komentar?</h4>
            <p className="text-xs opacity-80">Komentar akan dihapus permanen beserta balasannya.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-sm rounded-md border border-white/20 hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={async () => { await del(confirmDelete.id); setConfirmDelete(null); }}
                className="text-sm px-3 py-1.5 rounded-md border border-red-500/50 text-red-300 hover:bg-red-500/10"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PixelDotsLoader() {
  const dots = Array.from({ length: 32 });
  return (
    <div className="text-black/70 dark:text-white" aria-label="Loading comments" role="status">
      <div
        className="grid grid-cols-8 gap-1"
        style={{ imageRendering: "pixelated" as any }}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="block"
            style={{
              width: 8,
              height: 8,
              background: "currentColor",
              animation: `pixelPulse 1.1s ease-in-out ${i * 0.05}s infinite` as any,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes pixelPulse {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 0.9; transform: translateY(-1px); }
        }
      `}</style>
    </div>
  );
}
