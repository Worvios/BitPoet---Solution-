import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { getLocale, getTranslations } from 'next-intl/server';

import { buildLocalizedMetadata } from '@/lib/metadata';
import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/sanity';
import { urlForImage } from '@/lib/sanity-image';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 60;

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string; locale: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, locale } = params;
  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const post = await getBlogPostBySlug(slug, typedLocale);
  if (!post) {
    return { title: 'BitPoet — Blog', description: 'BitPoet' };
  }

  const ogImage = post.coverImage ? urlForImage(post.coverImage).width(1200).height(630).url() : undefined;
  const published = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;

  const baseMetadata = await buildLocalizedMetadata({
    locale: typedLocale,
    path: `blog/${post.slug}`,
    title: post.title,
    description: post.seoDescription || post.excerpt,
    ogImageUrl: ogImage,
    openGraphType: 'article'
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...(baseMetadata.openGraph ?? {}),
      type: 'article',
      publishedTime: published,
      authors: post.author?.name ? [post.author.name] : undefined
    }
  } satisfies Metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = await getLocale();
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const post = await getBlogPostBySlug(params.slug, typedLocale);

  if (!post) {
    notFound();
  }

  const postData = post as NonNullable<typeof post>;

  const t = await getTranslations({ locale: typedLocale, namespace: 'blog' });
  const ogImage = postData.coverImage ? urlForImage(postData.coverImage).width(1200).height(630).url() : undefined;
  const published = postData.publishedAt ? new Date(postData.publishedAt).toISOString() : undefined;

  const portableTextComponents: PortableTextComponents = {
    types: {
      image: ({ value }) => {
        const url = value ? urlForImage(value).width(960).fit('max').url() : null;
        if (!url) return null;
        return (
          <div className="relative my-8 aspect-video overflow-hidden rounded-3xl border border-border/40 shadow-lg">
            <Image src={url} alt={postData.title} fill className="object-cover" sizes="(min-width: 768px) 640px, 100vw" />
          </div>
        );
      }
    },
    marks: {
      link: ({ value, children }) => (
        <a
          href={typeof value?.href === 'string' ? value.href : '#'}
          className="text-accent-1 transition hover:text-accent-2"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      )
    },
    block: {
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="mt-12 font-display text-3xl text-foreground">{children}</h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="mt-8 font-display text-2xl text-foreground">{children}</h3>
      ),
      normal: ({ children }: { children?: ReactNode }) => (
        <p className="mt-4 text-base leading-7 text-muted">{children}</p>
      )
    }
  };

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-2/70">
          {published
            ? new Intl.DateTimeFormat(typedLocale, { dateStyle: 'medium' }).format(new Date(published))
            : t('unknownDate')}
        </p>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{postData.title}</h1>
        {postData.author?.name ? (
          <p className="mt-2 text-sm text-subtle">
            {t('byAuthor', { name: postData.author.name })}
          </p>
        ) : null}

        {ogImage ? (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl border border-border/40">
            <Image src={ogImage} alt={postData.title} fill className="object-cover" sizes="(min-width: 768px) 640px, 100vw" />
          </div>
        ) : null}

        <div className="prose prose-neutral mt-12 max-w-none text-foreground dark:prose-invert">
          {postData.body ? <PortableText value={postData.body as never} components={portableTextComponents} /> : null}
        </div>
      </article>
    </>
  );
}
