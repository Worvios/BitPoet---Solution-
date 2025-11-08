import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Link } from '@/lib/navigation';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import ServiceCard from '@/components/ServiceCard';
import HomeBg from '@/components/background/HomeBg';
import { buildLocalizedMetadata } from '@/lib/metadata';
import { getBlogPosts, getHomePageContent, getPageContent, getProjects, getServices } from '@/lib/sanity';
import { isLocale, type Locale } from '@/lib/i18n';
import type { HomePageContent } from '@/lib/sanity';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    // Fallback minimal metadata if locale is invalid
    return { title: 'BitPoet', description: 'BitPoet' };
  }

  const typedLocale: Locale = locale;
  const [pageContent, t] = await Promise.all([
    getPageContent('home', typedLocale),
    getTranslations({ locale: typedLocale, namespace: 'home' })
  ]);

  const title = pageContent?.title ?? t('meta.title');
  const description = pageContent?.seoDescription ?? t('meta.description');

  return buildLocalizedMetadata({
    locale: typedLocale,
    title,
    description
  });
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base text-muted md:text-lg">{children}</p>,
    h3: ({ children }) => <h3 className="font-display text-2xl text-foreground">{children}</h3>
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-2 text-sm text-muted">{children}</ul>
  }
};

const normalizeHref = (href: string, fallback: string): string => {
  const trimmed = href.trim();
  if (!trimmed) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
  return normalized || fallback;
};

export default async function HomePage() {
  const locale = await getLocale();

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const [homeContent, projects, services, blogPosts, pageContent] = await Promise.all([
    getHomePageContent(typedLocale),
    getProjects(typedLocale),
    getServices(typedLocale),
    getBlogPosts(typedLocale),
    getPageContent('home', typedLocale)
  ]);

  const t = await getTranslations({ locale: typedLocale, namespace: 'home' });
  const contactT = await getTranslations({ locale: typedLocale, namespace: 'contact.form' });
  const blogT = await getTranslations({ locale: typedLocale, namespace: 'blog' });
  const projectCardCopy = await getTranslations({ locale: typedLocale, namespace: 'projects.card' });

  const heroContent: HomePageContent['hero'] = homeContent?.hero ?? {
    eyebrow: t('hero.eyebrow'),
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    primaryCta: { label: t('hero.primaryCta.label'), href: t('hero.primaryCta.href') },
    secondaryCta: { label: t('hero.secondaryCta.label'), href: t('hero.secondaryCta.href') },
    philosophy: {
      title: t('hero.philosophy.title'),
      copy: t('hero.philosophy.copy')
    }
  };
  const hasCraftContent = Boolean(homeContent?.craft?.title || homeContent?.craft?.subtitle);
  const manifestoBody = homeContent?.manifesto.body ?? [];
  const hasManifesto = manifestoBody.length > 0;
  const featuredProject = homeContent?.featuredProject ?? null;
  const footerCta = homeContent?.footerCta ?? null;
  const craftCopy = homeContent?.craft;

  const contactDictionary = {
    nameLabel: contactT('nameLabel'),
    emailLabel: contactT('emailLabel'),
    messageLabel: contactT('messageLabel'),
    submitLabel: contactT('submitLabel'),
    successHeading: contactT('successHeading'),
    successBody: contactT('successBody'),
    errorHeading: contactT('errorHeading'),
    errorBody: contactT('errorBody'),
    validation: {
      name: contactT('validation.name'),
      email: contactT('validation.email'),
      message: contactT('validation.message')
    }
  } as const;

  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <>
      <HomeBg />
      <Hero content={heroContent} />

      {hasCraftContent && craftCopy ? (
        <section className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-8 lg:px-16">
          <div className="glass-panel rounded-3xl border border-border/40 p-10 text-center sm:text-left">
            <span className="inline-flex items-center justify-center rounded-full border border-accent-2/40 bg-accent-2/10 px-4 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-accent-2/80">
              {craftCopy.badgeLabel}
            </span>
            <h2 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">{craftCopy.title}</h2>
            <p className="mt-4 text-base text-muted sm:text-lg">{craftCopy.subtitle}</p>
          </div>
        </section>
      ) : null}

      {hasManifesto ? (
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8 lg:px-16">
          <div className="rounded-3xl border border-border/40 bg-surface/80 p-10 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            {homeContent?.manifesto.title ? (
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                {homeContent.manifesto.title}
              </h2>
            ) : null}
            <div className="mt-6 space-y-6">
              <PortableText value={manifestoBody as never} components={portableTextComponents} />
            </div>
          </div>
        </section>
      ) : null}

      {featuredProject ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 lg:px-16">
          <div className="rounded-3xl border border-border/40 bg-surface/80 p-8 lg:flex lg:items-center lg:gap-10 lg:p-12">
            <div className="flex-1 space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-accent-2/80">
                {t('projects.eyebrow')}
              </span>
              <h2 className="font-display text-4xl text-foreground">{featuredProject.project.title}</h2>
              {featuredProject.tagline ? (
                <p className="text-base text-muted">{featuredProject.tagline}</p>
              ) : null}
              <Link
                href={normalizeHref(featuredProject.href, '/projects')}
                className="inline-flex items-center gap-2 rounded-full border border-accent-2/40 px-6 py-2 text-xs uppercase tracking-[0.3em] text-accent-2 transition hover:border-accent-2 hover:text-accent-1"
              >
                {featuredProject.ctaLabel}
              </Link>
            </div>

            <div className="mt-8 flex-1 lg:mt-0">
              <ProjectCard
                project={featuredProject.project}
                locale={typedLocale}
                copy={{
                  privateLabel: projectCardCopy('privateLabel'),
                  ctaLabel: featuredProject.ctaLabel,
                  ctaHref: featuredProject.href,
                  privateCopy: projectCardCopy('privateCopy')
                }}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 lg:px-16">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-accent-2/80">{t('services.eyebrow')}</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">{t('services.title')}</h2>
          </div>
          <Link href="/services" className="text-xs uppercase tracking-[0.32em] text-accent-2 transition hover:text-accent-1">
            {t('services.cta')}
          </Link>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} badge={t('services.pillar')} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 lg:px-16">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-accent-2/80">{t('projects.eyebrow')}</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">{t('projects.title')}</h2>
          </div>
          <Link href="/projects" className="text-xs uppercase tracking-[0.32em] text-accent-2 transition hover:text-accent-1">
            {t('projects.cta')}
          </Link>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={typedLocale}
              copy={{
                privateLabel: projectCardCopy('privateLabel'),
                ctaLabel: projectCardCopy('ctaLabel'),
                ctaHref: projectCardCopy('ctaHref'),
                privateCopy: projectCardCopy('privateCopy')
              }}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 lg:px-16">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-accent-2/80">{blogT('feed.eyebrow')}</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">{blogT('feed.title')}</h2>
          </div>
          <Link href="/blog" className="text-xs uppercase tracking-[0.32em] text-accent-2 transition hover:text-accent-1">
            {blogT('feed.cta')}
          </Link>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              locale={typedLocale}
              authorLabel={post.author ? blogT('byAuthor', { name: post.author.name }) : null}
              labels={{
                readMore: blogT('feed.readMore'),
                unknownDate: blogT('unknownDate')
              }}
            />
          ))}
        </div>
      </section>

      {footerCta ? (
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8 lg:px-16">
          <div className="rounded-3xl border border-border/40 bg-accent-1/5 p-10 text-center sm:text-left">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">{footerCta.title}</h2>
            <div className="mt-4 text-base text-muted">
              <PortableText value={footerCta.body as never} components={portableTextComponents} />
            </div>
            <Link
              href={normalizeHref(footerCta.buttonHref, '/contact')}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-6 py-2 text-xs uppercase tracking-[0.3em] text-accent-2 transition hover:border-accent-1 hover:text-accent-1"
            >
              {footerCta.buttonLabel}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 lg:px-16">
        <header className="mb-10 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{t('contact.eyebrow')}</p>
          <h2 className="mt-2 font-display text-4xl text-foreground">{t('contact.title')}</h2>
          <p className="mt-3 text-sm text-muted">{t('contact.subtitle')}</p>
        </header>
        <ContactForm dictionary={contactDictionary} />
      </section>
    </>
  );
}
