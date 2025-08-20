import { getAllPosts } from "@/lib/markdown";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://blog.farrel.id/p/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://blog.farrel.id",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://blog.farrel.id/privacy-policy",
      lastModified: new Date("2025-08-18"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...postEntries,
  ];
}
