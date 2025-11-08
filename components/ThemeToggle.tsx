'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full border border-border/50 bg-surface/70" aria-hidden="true" />;
  }

  const currentTheme = resolvedTheme ?? 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-surface/70 transition hover:border-accent-2 hover:shadow-[0_0_20px_rgba(15,255,193,0.25)]"
      aria-label={t('toggleTheme')}
    >
      <span className="absolute inset-0 bg-gradient-to-br from-accent-1/20 to-accent-2/30 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative text-base text-foreground">
        {currentTheme === 'dark' ? '✦' : '☾'}
      </span>
    </button>
  );
}
