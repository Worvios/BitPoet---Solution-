"use client";

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import type { NavigationLink } from '@/types/navigation';
import { locales, type Locale } from '@/lib/i18n';

type HeaderProps = {
  locale: string;
  navigation: NavigationLink[];
};

export default function Header({ locale, navigation }: HeaderProps) {
  const normalizedLocale = (locales.includes(locale as Locale) ? (locale as Locale) : 'en') as Locale;
  const homeHref = navigation[0]?.href ?? '/';
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-surface/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex h-[--header-height] w-full max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-16">
        <Link
          href={homeHref}
          aria-label="BitPoet home"
          className="flex items-center gap-3 text-foreground transition-colors hover:text-accent-2"
        >
          <div className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-surface-muted p-2 shadow-neon-sm transition-transform hover:scale-105">
            <Image src="/bitpoet-logo.png" alt="BitPoet Logo" width={160} height={48} className="h-10 w-auto" priority />
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/80 transition-colors hover:text-accent-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border/60 bg-surface/80 p-2 text-muted transition hover:text-accent-1 hover:shadow-neon-sm md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -100 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-8 lg:px-16">
              <ul className="space-y-2 rounded-3xl border border-border/50 bg-surface/90 p-4 shadow-neon-sm">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-start text-sm font-semibold uppercase tracking-[0.28em] text-foreground transition hover:bg-accent/10 hover:text-accent-1"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
