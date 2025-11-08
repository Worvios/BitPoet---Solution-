import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import ServicesShowcase from '@/components/services/ServicesShowcase';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'services' });

  return buildLocalizedMetadata({
    locale: typedLocale,
    path: 'services',
    title: t('meta.title'),
    description: t('meta.description')
  });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'services' });
  const ts = await getTranslations({ locale: typedLocale, namespace: 'servicesPage' });

  const heroCopy = {
    eyebrow: t('eyebrow'),
    title: t('title'),
    description: t('description'),
  };

  const sections = [
    { title: ts('sections.software.title'), copy: ts('sections.software.copy') },
    { title: ts('sections.game.title'), copy: ts('sections.game.copy') },
    { title: ts('sections.art.title'), copy: ts('sections.art.copy') },
    { title: ts('sections.consulting.title'), copy: ts('sections.consulting.copy') },
  ];

  return <ServicesShowcase hero={heroCopy} sections={sections} />;
}
