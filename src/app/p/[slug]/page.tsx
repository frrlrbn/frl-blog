import { getAllPosts, getPostBySlug, renderMarkdownToHtml } from "@/lib/markdown";
import ShareButtons from "@/components/ShareButtons";
import Comments from "@/components/Comments";
import type { Metadata } from "next";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import BlurAvatar from "@/components/BlurAvatar";
import Script from "next/script";
import { notFound } from "next/navigation";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Blog";
  const description = post?.excerpt ?? "";
  const url = `https://blog.farrel.id/p/${slug}`;
  const ogImage = post?.thumbnail ?? "/images/placeholder.png";
  const publishedTime = post ? new Date(post.date).toISOString() : undefined;
  const tags = post?.tags ?? [];
  return {
    title,
    description,
    alternates: { canonical: url },
  keywords: tags,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Farrel's Blog",
      publishedTime,
      authors: ["Muhammad Farrel Rabbani"],
      tags,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@frrlrbn",
      site: "@frrlrbn",
    },
    robots: { index: true, follow: true },
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
      {/* JSON-LD Article schema for SEO */}
      <Script id="ld-article" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.thumbnail,
          keywords: (post.tags ?? []).join(", "),
          about: (post.tags ?? []).map((t: string) => ({ "@type": "Thing", name: t })),
          datePublished: new Date(post.date).toISOString(),
          dateModified: new Date(post.date).toISOString(),
          author: {
            "@type": "Person",
            name: "Muhammad Farrel Rabbani",
          },
          publisher: {
            "@type": "Organization",
            name: "Farrel's Blog",
            logo: {
              "@type": "ImageObject",
              url: "https://blog.farrel.id/images/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://blog.farrel.id/p/${slug}`,
          },
        })}
      </Script>
      {/* Ad script: loaded after interactive to avoid blocking rendering */}
      <Script id="ad-network" src="https://jewelsobstructionerosion.com/e6/be/9f/e6be9f1e9ac11bd757d8d1b91fa7705b.js" strategy="afterInteractive" />
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
          <span className="inline-flex items-center gap-1.5">
            <FaRegCalendarAlt className="size-4 opacity-70" aria-hidden />
            <time dateTime={new Date(post.date).toISOString()}>{dateStr}</time>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <FaRegClock className="size-4 opacity-70" aria-hidden />
            <span>{readingMinutes} min read</span>
          </span>
        </div>
        {post.thumbnail ? (
          <div className="mt-4 sm:mt-6">
            <BlurImage
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
