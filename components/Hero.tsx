'use client';

import { Link } from '@/lib/navigation';
import { motion } from 'framer-motion';

import type { HomePageContent } from '@/lib/sanity';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

type HeroProps = {
  content: HomePageContent['hero'];
};

const normalizeHref = (href: string): string => {
  const trimmed = href.trim();
  if (!trimmed) {
    return '/';
  }

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
};

export default function Hero({ content }: HeroProps) {
  const primaryHref = normalizeHref(content.primaryCta.href);
  const secondaryHref = content.secondaryCta ? normalizeHref(content.secondaryCta.href) : null;

  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 gradient-bg opacity-60" aria-hidden />
      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 text-center sm:px-8 lg:px-16"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="text-xs uppercase tracking-[0.6em] text-accent-2">
          {content.eyebrow}
        </motion.p>
        <motion.h1 variants={item} className="font-display text-5xl leading-tight md:text-6xl">
          {content.title}
        </motion.h1>
        <motion.p variants={item} className="max-w-3xl text-lg text-muted">
          {content.subtitle}
        </motion.p>
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="group relative inline-flex items-center gap-2 rounded-full border border-accent-2/60 bg-accent-2/15 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-accent-2 transition-transform duration-200 hover:scale-105 hover:border-accent-2 hover:bg-accent-2/30 hover:shadow-[0_0_35px_rgba(15,255,193,0.35)]"
          >
            <span className="absolute inset-0 rounded-full bg-accent-2/20 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative">{content.primaryCta.label}</span>
          </Link>
          {content.secondaryCta && secondaryHref ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-foreground transition-transform duration-200 hover:scale-105 hover:border-accent-1 hover:text-accent-1 hover:shadow-[0_0_30px_rgba(93,63,211,0.28)]"
            >
              <span className="relative">{content.secondaryCta.label}</span>
            </Link>
          ) : null}
        </motion.div>

        <motion.div
          variants={item}
          className="neon-border w-full max-w-4xl overflow-hidden rounded-3xl border border-border/50 bg-surface/70 p-8 backdrop-blur"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-accent-2/80">{content.philosophy.title}</p>
          <p className="mt-4 text-base text-muted md:text-lg">{content.philosophy.copy}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
