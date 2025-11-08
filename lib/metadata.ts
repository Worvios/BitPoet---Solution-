import type { Metadata } from 'next';

import { defaultLocale, locales, type Locale } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/sanity';

const FALLBACK_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  try {
    return new URL(envUrl).toString().replace(/\/$/, '');
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_SITE_URL value. Falling back to localhost.', error);
    return FALLBACK_SITE_URL;
  }
}

function buildNormalizedPath(locale: Locale, path: string): string {
  const trimmed = path.replace(/^\//, '').replace(/\/$/, '');
  const suffix = trimmed.length > 0 ? `/${trimmed}` : '';
  return `/${locale}${suffix}`;
}

type MetadataInput = {
  locale: Locale;
  path?: string;
  title?: string | null;
  description?: string | null;
  ogImagePath?: string | null;
  ogImageUrl?: string | null;
  openGraphType?: 'website' | 'article';
};

export async function buildLocalizedMetadata({
  locale,
  path = '',
  title,
  description,
  ogImagePath,
  ogImageUrl,
  openGraphType = 'website'
}: MetadataInput): Promise<Metadata> {
  const [settings] = await Promise.all([getSiteSettings(locale)]);

  const resolvedTitle = title?.trim() || settings.title || 'BitPoet';
  const resolvedDescription = description?.trim() || settings.tagline || 'Software and Soul';

  const baseUrl = getSiteUrl();
  const localizedPath = buildNormalizedPath(locale, path);
  const canonical = `${baseUrl}${localizedPath}`;

  const languages: Record<string, string> = locales.reduce((acc, currentLocale) => {
    acc[currentLocale] = `${baseUrl}${buildNormalizedPath(currentLocale, path)}`;
    return acc;
  }, {} as Record<string, string>);

  languages['x-default'] = `${baseUrl}${buildNormalizedPath(defaultLocale, path)}`;

  const normalizedOgUrl = ogImageUrl
    ? ogImageUrl.startsWith('http')
      ? ogImageUrl
      : `${baseUrl}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
    : undefined;

  const normalizedOgPath = ogImagePath
    ? `${baseUrl}${ogImagePath.startsWith('/') ? '' : '/'}${ogImagePath}`
    : undefined;

  const fallbackOgImage = `${baseUrl}/api/og?locale=${locale}&title=${encodeURIComponent(resolvedTitle)}`;

  const ogImage = normalizedOgUrl ?? normalizedOgPath ?? fallbackOgImage;

  return {
    metadataBase: new URL(baseUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      type: openGraphType,
      locale,
      alternateLocale: locales.filter((item) => item !== locale),
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${resolvedTitle} — BitPoet`
              }
            ]
          }
        : {})
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      ...(ogImage ? { images: [ogImage] } : {})
    }
  } satisfies Metadata;
}
