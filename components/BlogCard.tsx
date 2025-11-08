import Image from 'next/image';
import { Link } from '@/lib/navigation';

import type { BlogPost } from '@/lib/sanity';
import { urlForImage } from '@/lib/sanity-image';
import { type Locale } from '@/lib/i18n';

type BlogCardProps = {
  post: BlogPost;
  locale: Locale;
  labels: {
    readMore: string;
    unknownDate: string;
  };
  authorLabel?: string | null;
};

export default function BlogCard({ post, locale, labels, authorLabel }: BlogCardProps) {
  const imageUrl = post.coverImage ? urlForImage(post.coverImage).width(720).height(440).url() : null;
  const normalizedSlug = post.slug.startsWith('/') ? post.slug : `/blog/${post.slug}`;
  const href = normalizedSlug;

  const publishedAt = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(post.publishedAt))
    : labels.unknownDate;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border glass-panel transition duration-300 hover:border-accent-1/70 hover:shadow-[0_24px_60px_-32px_rgba(93,63,211,0.65)]">
      {imageUrl ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-2/70">{publishedAt}</p>
        <h3 className="font-display text-2xl text-foreground transition-colors hover:text-accent-1">
          {post.title}
        </h3>
        {authorLabel ? <p className="text-xs text-subtle">{authorLabel}</p> : null}
        <p className="text-sm text-muted">{post.excerpt}</p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-accent-2 transition hover:text-accent-1"
        >
          {labels.readMore}
        </Link>
      </div>
    </article>
  );
}
