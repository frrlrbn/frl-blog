import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

export type PostFrontMatter = {
  title: string;
  slug: string;
  excerpt?: string;
  date: string | Date;
  tags?: string[];
  thumbnail?: string;
};

export type Post = PostFrontMatter & { content: string };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | null {
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts: Post[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as Partial<PostFrontMatter>;
    const title = fm.title ?? file.replace(/\.md$/, "");
    const slug = fm.slug ?? slugify(title);
    const date = fm.date ?? new Date().toISOString();
    const excerpt = fm.excerpt ?? content.slice(0, 180).replace(/\n/g, " ") + "…";
  const thumbnail = fm.thumbnail ?? "/images/placeholder.png";
  return { title, slug, date, excerpt, tags: fm.tags ?? [], content, thumbnail } as Post;
  });
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function renderMarkdownToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFootnotes, { inlineNotes: true })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
