import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import ContactForm from '@/components/ContactForm';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/sanity';
import { isLocale, type Locale } from '@/lib/i18n';
import ContactBg from '@/components/background/ContactBg';

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'contact' });

  return buildLocalizedMetadata({
    locale: typedLocale,
    path: 'contact',
    title: t('meta.title'),
    description: t('meta.description')
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = await getTranslations({ locale: typedLocale, namespace: 'contact' });
  const formT = await getTranslations({ locale: typedLocale, namespace: 'contact.form' });

  const settings = await getSiteSettings(typedLocale);

  const formDictionary = {
    nameLabel: formT('nameLabel'),
    emailLabel: formT('emailLabel'),
    messageLabel: formT('messageLabel'),
    submitLabel: formT('submitLabel'),
    successHeading: formT('successHeading'),
    successBody: formT('successBody'),
    errorHeading: formT('errorHeading'),
    errorBody: formT('errorBody'),
    validation: {
      name: formT('validation.name'),
      email: formT('validation.email'),
      message: formT('validation.message')
    }
  } as const;

  return (
    <>
  <ContactBg />
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 lg:px-16">
        <header className="mb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{t('eyebrow')}</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-base text-muted">{t('description')}</p>
        </header>

        <div className="grid gap-12 md:grid-cols-[1.2fr,1fr]">
          <ContactForm dictionary={formDictionary} />
          <aside className="rounded-3xl border border-border/50 bg-surface/90 p-6 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-2/80">{t('sidebar.title')}</p>
            <p className="mt-4 text-sm text-muted">{t('sidebar.copy')}</p>
            {settings.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="mt-6 inline-block text-sm uppercase tracking-[0.3em] text-accent-2 transition hover:text-accent-1"
              >
                {settings.contactEmail}
              </a>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
