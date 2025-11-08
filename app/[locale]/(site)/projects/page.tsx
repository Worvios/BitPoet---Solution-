import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import AnimatedSection from '@/components/AnimatedSection';
import Card from '@/components/Card';
import ProjectsBg from '@/components/background/ProjectsBg';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'projects' });

  return buildLocalizedMetadata({
    locale: typedLocale,
    path: 'projects',
    title: t('meta.title'),
    description: t('meta.description')
  });
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'projects' });
  const tp = await getTranslations({ locale: typedLocale, namespace: 'projectsPage' });

  return (
    <>
  <ProjectsBg />
      <AnimatedSection className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 lg:px-16">
        <header className="mb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{t('eyebrow')}</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-base text-muted">{t('description')}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(['mindFragments', 'neonArchive', 'codeCanvas', 'loopWithin'] as const).map((key) => (
            <Card key={key} title={tp(`cards.${key}.title`)} subtitle={tp(`cards.${key}.desc`)}>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(tp.raw(`cards.${key}.tags`) as Record<string, string>).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-strong bg-surface-muted px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
