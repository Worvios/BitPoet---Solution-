import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/metadata';
import { locales, defaultLocale } from '@/lib/i18n';
import { getBlogPostSlugs } from '@/lib/sanity';

const STATIC_ROUTES = ['', 'services', 'projects', 'about', 'blog', 'contact'];

function buildLocalizedPath(locale: string, route: string): string {
  const trimmed = route.replace(/^\//, '').replace(/\/$/, '');
  const suffix = trimmed.length > 0 ? `/${trimmed}` : '';
  return `/${locale}${suffix}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const now = new Date();
  const blogSlugs = await getBlogPostSlugs();

  const entries: MetadataRoute.Sitemap = [];

  // Add root without locale for backwards compatibility.
  entries.push({
    url: normalizedBase,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1
  });

  for (const locale of locales) {
    for (const route of STATIC_ROUTES) {
      const path = buildLocalizedPath(locale, route);
      entries.push({
        url: `${normalizedBase}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' && locale === defaultLocale ? 1 : 0.7
      });
    }

    for (const slug of blogSlugs) {
      const path = buildLocalizedPath(locale, `blog/${slug}`);
      entries.push({
        url: `${normalizedBase}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6
      });
    }
  }

  return entries;
}
