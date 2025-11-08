'use client';

import { useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errors.global');

  useEffect(() => {
    console.error('Global error boundary triggered');
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
    <h2 className="font-display text-4xl text-accent-2">{t('title')}</h2>
    <p className="text-muted">{t('description')}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-accent-2/60 bg-accent-2/20 px-6 py-3 text-sm uppercase tracking-[0.3em] text-accent-2 transition hover:border-accent-2 hover:bg-accent-2/40"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border/50 px-6 py-3 text-sm uppercase tracking-[0.3em] text-foreground transition hover:border-accent-1 hover:text-accent-1"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
