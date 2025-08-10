import { getAllPosts, getPostBySlug, renderMarkdownToHtml } from "@/lib/markdown";
import ShareButtons from "@/components/ShareButtons";
import Comments from "@/components/Comments";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();
  const html = await renderMarkdownToHtml(post.content);
  const readingMinutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));
  const dateStr = new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "2-digit" });
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10">
      {/* Ad script: loaded after interactive to avoid blocking rendering */}
      <Script id="ad-network" src="https://jewelsobstructionerosion.com/66/9c/91/669c913da056274a9ef888b18b55cb88.js" strategy="afterInteractive" />
      <Script id="ad-network-2" src="https://jewelsobstructionerosion.com/e6/be/9f/e6be9f1e9ac11bd757d8d1b91fa7705b.js" strategy="afterInteractive" />
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
          <span className="rotate-180 select-none">➔</span>
          <span>Back to Home</span>
        </Link>
      </div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-black/70 dark:text-white/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/author.jpg" alt="Muhammad Farrel Rabbani" className="size-8 rounded-full" />
          <span className="font-medium">Muhammad Farrel Rabbani</span>
          <span>•</span>
          <time dateTime={new Date(post.date).toISOString()}>{dateStr}</time>
          <span>•</span>
          <span>{readingMinutes} min read</span>
        </div>
        {post.thumbnail ? (
          <div className="mt-4 sm:mt-6">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto rounded-xl border border-black/10 dark:border-white/10"
              priority
            />
          </div>
        ) : null}
        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 text-xs rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <article className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <div className="mt-8">
        <ShareButtons title={post.title} />
      </div>
      <div className="mt-10">
        <Comments slug={post.slug} />
      </div>
    </main>
  );
}
