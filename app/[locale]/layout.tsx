// Location: app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations, getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import { getSiteSettings } from '@/lib/sanity';
import type { NavigationLink } from '@/types/navigation';
import { buildOrganizationJsonLd } from '@/lib/seo';

// Assuming your locales are defined somewhere like this
const locales = ['en', 'fr', 'ar'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: { locale: (typeof locales)[number] | string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  unstable_setRequestLocale(locale as (typeof locales)[number]);

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  const navLinks: NavigationLink[] = [
    { href: '/', label: tNav('home') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/about', label: tNav('about') },
    { href: '/blog', label: tNav('blog') },
    { href: '/contact', label: tNav('contact') }
  ];

  const settings = await getSiteSettings(locale as (typeof locales)[number]);
  const organizationJsonLd = buildOrganizationJsonLd({
    locale: locale as (typeof locales)[number],
    settings
  });

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
              />
              <Header locale={locale} navigation={navLinks} />
              <main className="flex-1">{children}</main>
              <Footer settings={settings} navigation={navLinks} />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
