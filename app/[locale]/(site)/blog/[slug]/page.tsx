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
        const url = value ? urlForImage(value).width(1200).fit('max').url() : null;
        if (!url) return null;
        return (
          <figure className="my-12 -mx-6 md:mx-0">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/20 shadow-2xl shadow-black/5">
              <Image 
                src={url} 
                alt={postData.title} 
                fill 
                className="object-cover" 
                sizes="(min-width: 768px) 768px, 100vw" 
              />
            </div>
          </figure>
        );
      }
    },
    marks: {
      link: ({ value, children }) => (
        <a
          href={typeof value?.href === 'string' ? value.href : '#'}
          className="font-medium text-accent-1 underline decoration-accent-1/30 underline-offset-4 transition-all hover:decoration-accent-1 hover:text-accent-2"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      ),
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em className="italic text-foreground/90">{children}</em>
      ),
      code: ({ children }: { children?: ReactNode }) => (
        <code className="rounded bg-muted/30 px-1.5 py-0.5 font-mono text-sm text-foreground/90">{children}</code>
      )
    },
    block: {
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="mt-16 mb-6 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl" dir="auto">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="mt-12 mb-4 font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl" dir="auto">
          {children}
        </h3>
      ),
      h4: ({ children }: { children?: ReactNode }) => (
        <h4 className="mt-8 mb-3 font-display text-xl font-semibold text-foreground md:text-2xl" dir="auto">
          {children}
        </h4>
      ),
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="my-8 border-l-4 border-accent-1/30 pl-6 italic text-lg text-foreground/80" dir="auto">
          {children}
        </blockquote>
      ),
      normal: ({ children }: { children?: ReactNode }) => (
        <p className="mb-6 text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed" dir="auto">
          {children}
        </p>
      )
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className="my-6 space-y-2 pl-6 text-lg text-muted md:text-xl" dir="auto">
          {children}
        </ul>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <ol className="my-6 space-y-2 pl-6 text-lg text-muted md:text-xl" dir="auto">
          {children}
        </ol>
      )
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <li className="pl-2" dir="auto">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-1/60 mr-3 -ml-5 align-middle" />
          {children}
        </li>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <li className="pl-2" dir="auto">{children}</li>
      )
    }
  };

  return (
    <>
      <article className="mx-auto w-full max-w-4xl px-6 py-16 md:py-24">
        {/* Header section with elegant spacing */}
        <header className="mb-12 md:mb-16">
          <p className="text-xs font-medium uppercase tracking-wider text-accent-2/60">
            {published
              ? new Intl.DateTimeFormat(typedLocale, { dateStyle: 'long' }).format(new Date(published))
              : t('unknownDate')}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl" dir="auto">
            {postData.title}
          </h1>
          {postData.excerpt ? (
            <p className="mt-6 text-xl leading-relaxed text-muted/90 md:text-2xl" dir="auto">
              {postData.excerpt}
            </p>
          ) : null}
          {postData.author?.name ? (
            <div className="mt-8 flex items-center gap-3">
              {postData.author.avatar ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-border/40">
                  <Image 
                    src={urlForImage(postData.author.avatar).width(96).height(96).url()} 
                    alt={postData.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {postData.author.name}
                </p>
                <p className="text-xs text-muted">
                  {t('byAuthor', { name: '' }).replace(postData.author.name, '').trim()}
                </p>
              </div>
            </div>
          ) : null}
        </header>

        {/* Cover image with elegant presentation */}
        {ogImage ? (
          <div className="relative mb-16 -mx-6 aspect-[21/9] overflow-hidden rounded-2xl border border-border/20 shadow-2xl shadow-black/5 md:mx-0 md:rounded-3xl">
            <Image 
              src={ogImage} 
              alt={postData.title} 
              fill 
              className="object-cover" 
              sizes="(min-width: 768px) 896px, 100vw"
              priority
            />
          </div>
        ) : null}

        {/* Content with refined typography */}
        <div className="prose-custom max-w-none">
          {postData.body ? <PortableText value={postData.body as never} components={portableTextComponents} /> : null}
        </div>
      </article>
    </>
  );
}
