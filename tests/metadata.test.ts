import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildLocalizedMetadata } from '@/lib/metadata';

vi.mock('@/lib/sanity', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 'site-settings',
    title: 'BitPoet',
    tagline: 'Software and Soul',
    footerNote: 'Crafting soulful software for bold brands.',
    contactEmail: 'hello@bitpoet.dev',
    socialLinks: []
  })
}));

const toUrlString = (input: unknown): string | undefined => {
  if (!input) {
    return undefined;
  }

  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  if (typeof input === 'object' && 'url' in input) {
    const value = (input as { url?: unknown }).url;
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof URL) {
      return value.toString();
    }
  }

  return undefined;
};

describe('buildLocalizedMetadata', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://bitpoet.dev';
  });

  it('produces localized canonical and alternate URLs', async () => {
    const metadata = await buildLocalizedMetadata({
      locale: 'fr',
      path: 'about',
      title: 'À propos',
      description: 'Découvrez BitPoet'
    });

    expect(metadata.alternates?.canonical).toBe('https://bitpoet.dev/fr/about');
    expect(metadata.openGraph?.locale).toBe('fr');
    expect(metadata.openGraph?.alternateLocale).toContain('en');
  });

  it('falls back to generated OG image when none provided', async () => {
    const metadata = await buildLocalizedMetadata({
      locale: 'en',
      path: ''
    });

    const images = metadata.openGraph?.images;
    const ogImageUrl = Array.isArray(images) ? toUrlString(images[0]) : toUrlString(images);

    expect(ogImageUrl).toMatch(/\/api\/og\?locale=en/);
  });
});
