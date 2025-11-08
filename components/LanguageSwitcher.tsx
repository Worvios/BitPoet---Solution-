"use client";

import clsx from 'clsx';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Globe } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

import { locales, localeLabels } from '@/lib/i18n';

const { usePathname, useRouter } = createSharedPathnamesNavigation({ locales });

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLanguageChange = (nextLocale: (typeof locales)[number]) => {
    startTransition(() => {
      router.replace(pathname ?? '/', { locale: nextLocale });
      setOpen(false);
    });
  };

  // Use requested flags: EN: 🇬🇧 (gb), FR: 🇫🇷 (fr), AR: 🇲🇦 (ma)
  const localeToFlag: Record<(typeof locales)[number], string> = {
    en: 'gb',
    fr: 'fr',
    ar: 'ma'
  };

  return (
    <div className="relative" ref={popRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change language, current ${localeLabels[currentLocale as keyof typeof localeLabels]}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full bg-surface/70 p-2 text-muted transition hover:shadow-neon-glow"
      >
        <span
          className={clsx(
            'fi fis rounded-full',
            `fi-${localeToFlag[currentLocale as (typeof locales)[number]]}`
          )}
          style={{ fontSize: 24 }}
          data-testid="active-flag"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            role="menu"
            className="absolute end-0 z-50 mt-2 w-48 rounded-2xl border border-border/60 bg-surface/95 p-1 shadow-neon-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur"
          >
            {locales.map((code) => {
              const isActive = currentLocale === code;
              return (
                <button
                  key={code}
                  role="menuitemradio"
                  aria-checked={isActive}
                  disabled={isActive || isPending}
                  onClick={() => handleLanguageChange(code)}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60',
                    isActive
                      ? 'bg-accent/20 text-accent-2 shadow-[0_0_18px_rgba(15,255,193,0.25)]'
                      : 'text-subtle hover:bg-accent/10 hover:text-accent-1'
                  )}
                  aria-label={localeLabels[code]}
                >
                  <span className="flex items-center gap-2">
                    <span className={clsx('fi fis rounded-full', `fi-${localeToFlag[code]}`)} aria-hidden="true" />
                    <span>{localeLabels[code]}</span>
                  </span>
                  <span className="text-xs uppercase tracking-[0.28em] opacity-70">{code}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
