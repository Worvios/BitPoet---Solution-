import Image from 'next/image';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import AboutBg from '@/components/background/AboutBg';
import AnimatedSection from '@/components/AnimatedSection';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { getAboutPageContent } from '@/lib/sanity';
import { urlForImage } from '@/lib/sanity-image';
import { isLocale, type Locale } from '@/lib/i18n';

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-relaxed text-muted md:text-lg">{children}</p>,
    h3: ({ children }) => <h3 className="font-display text-2xl text-foreground">{children}</h3>
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-2 text-sm text-muted">{children}</ul>
  }
};

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'about' });

  return buildLocalizedMetadata({
    locale: typedLocale,
    path: 'about',
    title: t('meta.title'),
    description: t('meta.description'),
  });
}

export default async function AboutPage() {
  const locale = await getLocale();

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'about' });
  const aboutContent = await getAboutPageContent(typedLocale);
  const paragraphs = (t.raw('paragraphs') as string[] | undefined) ?? [];
  const highlights = (t.raw('highlights') as Array<{ title: string; items: string[] }> | undefined) ?? [];

  const hero = {
    eyebrow: aboutContent?.hero.eyebrow || t('eyebrow'),
    title: aboutContent?.hero.title || t('title'),
    subtitle: aboutContent?.hero.subtitle || t('description')
  };

  const sections = aboutContent?.sections ?? [];
  const hasSanitySections = sections.some((section) => section.body.length > 0 || section.title.trim().length > 0);
  const profileImageUrl = aboutContent?.profileImage
    ? urlForImage(aboutContent.profileImage).width(720).height(720).url()
    : null;

  return (
    <AboutBg>
      <AnimatedSection className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-8 lg:px-12">
        <header className="mb-16 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{hero.title}</h1>
          <p className="mt-6 text-base text-muted md:text-lg">{hero.subtitle}</p>
        </header>

        {profileImageUrl ? (
          <div className="mx-auto mb-16 flex justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border border-border/60 shadow-[0_20px_60px_-30px_rgba(93,63,211,0.45)]">
              <Image src={profileImageUrl} alt={hero.title} fill className="object-cover" />
            </div>
          </div>
        ) : null}

        {hasSanitySections ? (
          <section className="space-y-10 text-base leading-relaxed text-muted">
            {sections.map((section) => (
              <article key={section.key} className="rounded-3xl border border-border/40 bg-surface/80 p-8 backdrop-blur">
                {section.title ? (
                  <h2 className="font-display text-2xl text-foreground">{section.title}</h2>
                ) : null}
                {section.body.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    <PortableText value={section.body as never} components={portableTextComponents} />
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : (
          <>
            <div className="space-y-10 text-base leading-relaxed text-muted">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="max-w-3xl text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>

            <section className="mt-20 grid gap-8 rounded-3xl border border-border/40 bg-surface/80 p-8 backdrop-blur supports-[backdrop-filter]:backdrop-blur md:grid-cols-3">
              {highlights.map((highlight) => (
                <div key={highlight.title}>
                  <h2 className="text-xs uppercase tracking-[0.34em] text-accent-2/80">{highlight.title}</h2>
                  <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                    {highlight.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </>
        )}
      </AnimatedSection>
    </AboutBg>
  );
}
