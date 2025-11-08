import type { SiteSettings } from '@/lib/sanity';
import { getSiteUrl } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';

export type OrganizationJsonLdInput = {
  locale: Locale;
  settings: SiteSettings;
};

export function buildOrganizationJsonLd({ locale, settings }: OrganizationJsonLdInput) {
  const siteUrl = getSiteUrl();
  const normalizedBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  const localizedUrl = `${normalizedBase}/${locale}`;
  const sameAs = (settings.socialLinks ?? []).map((link) => link.url).filter(Boolean);

  const contactPoint = settings.contactEmail
    ? [
        {
          '@type': 'ContactPoint',
          email: settings.contactEmail,
          contactType: 'sales',
          areaServed: locales,
          availableLanguage: locales
        }
      ]
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.title || 'BitPoet',
    description: settings.tagline || 'Software and Soul',
    url: localizedUrl,
    logo: `${siteUrl}/bitpoet-logo.png`,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint
  };
}
