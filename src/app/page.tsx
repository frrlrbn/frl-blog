import { getAllPosts } from "@/lib/markdown";
import PostList from "@/components/PostList";
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function Home() {
  const posts = getAllPosts();
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-12">
      <section className="space-y-2 mb-10">
        <h1 className="text-4xl font-semibold">FARREL'S BLOG POSTS</h1>
        <p className="text-sm text-black/70 dark:text-white/70">A place to share my thoughts, technical notes, and design ideas.</p>
        {/* Social and website icons (react-icons) — update hrefs to your profiles as needed */}
        <div className="flex items-center gap-3 pt-1">
          <a
            href="https://github.com/frrlrbn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition text-white hover:text-white/80"
          >
            <FaGithub className="size-5 sm:size-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/frrlverse"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition text-white hover:text-white/80"
          >
            <FaLinkedin className="size-5 sm:size-6" />
          </a>
          <a
            href="https://instagram.com/frrlrbn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition text-white hover:text-white/80"
          >
            <FaInstagram className="size-5 sm:size-6" />
          </a>
          <a
            href="mailto:farrelrabbani88@gmail.com"
            aria-label="Email"
            className="transition text-white hover:text-white/80"
          >
            <MdOutlineEmail className="size-5 sm:size-6" />
          </a>
          <a
            href="https://frl.blue"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            className="transition text-white hover:text-white/80"
          >
            <FaGlobe className="size-5 sm:size-6" />
          </a>
        </div>
      </section>
  <PostList posts={posts} />
    </main>
  );
}
