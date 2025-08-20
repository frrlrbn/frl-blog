import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Farrel Rabbani | Blog",
    short_name: "Muhammad Farrel Rabbani | Blog",
    description: "A place to share my thoughts, technical notes, and design ideas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["technology", "blog", "programming"],
    lang: "id",
  }
}
