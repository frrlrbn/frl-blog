import { getAllPosts } from "@/lib/markdown";
import PostList from "@/components/PostList";

export default function Home() {
  const posts = getAllPosts();
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-12">
      <section className="space-y-2 mb-10">
        <h1 className="text-4xl font-semibold">FARREL'S BLOG POSTS ✦</h1>
        <p className="text-sm text-black/70 dark:text-white/70">A place to share my thoughts, technical notes, and design ideas.</p>
      </section>
  <PostList posts={posts} />
    </main>
  );
}
