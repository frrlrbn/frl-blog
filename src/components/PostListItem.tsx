import Link from "next/link";
import BlurImage from "@/components/BlurImage";

export default function PostListItem({
  title,
  slug,
  excerpt,
  date,
  thumbnail,
  tags,
}: {
  title: string;
  slug: string;
  excerpt?: string;
  date: string | Date;
  thumbnail?: string;
  tags?: string[];
}) {
  const d = new Date(date);
  const formatted = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return (
    <article className="flex flex-col md:flex-row gap-3 md:gap-4">
      {thumbnail ? (
        <Link href={`/p/${slug}`} className="block">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md  md:w-48 md:h-38 md:aspect-auto">
            <BlurImage
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 160px"
              className="object-cover"
              priority={false}
            />
          </div>
        </Link>
      ) : null}
      <div className="space-y-1 min-w-0">
        <h2 className="text-lg font-semibold">
          <Link href={`/p/${slug}`} className="hover:underline underline-offset-4 line-clamp-1">
            {title}
          </Link>
        </h2>
        <p className="text-xs text-black/60 dark:text-white/60">{formatted}</p>
        {excerpt ? (
          <p className="text-sm leading-6 text-black/80 dark:text-white/80 line-clamp-2">{excerpt}</p>
        ) : null}
        {tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
