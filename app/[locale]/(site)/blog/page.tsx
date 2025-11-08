import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { getBlogPosts } from '@/lib/sanity';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'blog' });

  return buildLocalizedMetadata({
    locale: typedLocale,
    path: 'blog',
    title: t('meta.title'),
    description: t('meta.description')
  });
}

export default async function BlogPage() {
  const locale = await getLocale();
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'blog' });

  let posts = [] as Awaited<ReturnType<typeof getBlogPosts>>;
  let hasError = false;

  try {
    posts = await getBlogPosts(typedLocale);
  } catch (error) {
    console.error('Failed to load blog posts', error);
    hasError = true;
  }

  const postEntries = posts.map((post) => ({
    post,
    authorLabel: post.author ? t('byAuthor', { name: post.author.name }) : null,
  }));

  return (
    <BlogIndexClient
      posts={postEntries}
      locale={typedLocale}
      labels={{
        readMore: t('readMore'),
        unknownDate: t('unknownDate'),
      }}
      header={{
        eyebrow: t('eyebrow'),
        title: t('title'),
        description: t('description'),
      }}
      hasError={hasError}
      errorMessage={t('error')}
    />
  );
}
