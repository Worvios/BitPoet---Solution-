"use client";

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import type { SVGProps } from 'react';

import type { SiteSettings } from '@/lib/sanity';
import type { NavigationLink } from '@/types/navigation';

type FooterProps = {
  settings: SiteSettings;
  navigation: NavigationLink[];
};

export default function Footer({ settings, navigation }: FooterProps) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const navItems = navigation.slice(0, 5);
  type IconProps = { size?: number | string; strokeWidth?: number } & SVGProps<SVGSVGElement>;
  const MediumIcon = ({ size = 18, className }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 7.75c0-.37.12-.73.35-1.02L4.71 4a.75.75 0 0 1 1.18.16l3.64 6.54L13.73 3.5a.75.75 0 0 1 .66-.4h.11c.2 0 .4.08.54.22l4.49 4.49c.14.14.22.34.22.54v8.97a.75.75 0 0 1-1.05.69l-4.99-2.22-2.64 2.64a.75.75 0 0 1-1.06 0L3.07 9.06A1.75 1.75 0 0 1 2 7.75z"/>
    </svg>
  );
  const WhatsappIcon = ({ size = 18, className }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 20l1.7-4.7A8 8 0 1 1 12 20a8.2 8.2 0 0 1-3.7-.9L3 20z"/>
      <path d="M16.5 13.5c-.3.7-1.7 1.3-2.3 1.3-.6 0-1.2-.2-1.8-.6-.5-.3-1.2-.8-2-1.6-.8-.8-1.3-1.5-1.6-2-.4-.6-.6-1.2-.6-1.8 0-.6.6-2 1.3-2.3.3-.1.7 0 .9.2l1.1 1.1c.2.2.3.5.2.9-.1.3-.4.8-.5 1 .3.6.9 1.3 1.4 1.8.5.5 1.2 1.1 1.8 1.4.2-.1.7-.4 1-.5.4-.1.7 0 .9.2l1.1 1.1c.2.3.3.7.1 1z"/>
    </svg>
  );

  const iconMap: Record<string, (props: IconProps) => JSX.Element> = {
    github: (props) => <Github size={18} strokeWidth={1.75} {...props} />,
    'github.com': (props) => <Github size={18} strokeWidth={1.75} {...props} />,
    linkedin: (props) => <Linkedin size={18} strokeWidth={1.75} {...props} />,
    'linkedin.com': (props) => <Linkedin size={18} strokeWidth={1.75} {...props} />,
    twitter: (props) => <Twitter size={18} strokeWidth={1.75} {...props} />,
    'x.com': (props) => <Twitter size={18} strokeWidth={1.75} {...props} />,
    instagram: (props) => <Instagram size={18} strokeWidth={1.75} {...props} />,
    medium: (props) => <MediumIcon {...props} />,
    'medium.com': (props) => <MediumIcon {...props} />,
    whatsapp: (props) => <WhatsappIcon {...props} />,
    'wa.me': (props) => <WhatsappIcon {...props} />,
    'whatsapp.com': (props) => <WhatsappIcon {...props} />
  };

  const socialLinks = (settings.socialLinks ?? []).map((link) => {
    const normalized = `${(link._key ?? link.label ?? '').toLowerCase()} ${link.url?.toLowerCase() ?? ''}`;
    const matchedKey = Object.keys(iconMap).find((key) => normalized.includes(key));
    return { ...link, iconKey: matchedKey };
  });

  const iconLinks = socialLinks.filter(
    (link): link is (typeof socialLinks)[number] & { iconKey: keyof typeof iconMap } => Boolean(link.iconKey)
  );
  const textLinks = socialLinks.filter((link) => !link.iconKey);

  return (
    <footer className="border-t border-border/50 bg-surface/85 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 lg:px-16">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Link
              href={navigation[0]?.href ?? '/'}
              className="inline-flex items-center gap-3 text-foreground transition hover:text-accent-2"
              aria-label={t('homeLinkAria')}
            >
              <div className="inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-surface-muted p-2 shadow-neon-sm transition-transform hover:scale-105">
                <Image src="/bitpoet-logo.png" alt="BitPoet Logo" width={160} height={48} className="h-10 w-auto" />
              </div>
            </Link>
            <p className="text-sm text-muted">{settings.footerNote || t('taglineFallback')}</p>
            <p className="text-xs text-subtle">{t('rights', { year })}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <nav className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-accent-2/80">{t('navigation')}</p>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted transition hover:text-accent-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-accent-2/80">{t('connect')}</p>
              {iconLinks.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3 text-muted">
                  {iconLinks.map((link) => {
                    const Icon = iconMap[link.iconKey];
                    return (
                      <a
                        key={link._key ?? link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('socialAria', { label: link.label })}
                        className="rounded-full bg-surface/70 p-2 text-accent-2 transition-shadow duration-300 hover:shadow-neon-glow hover:text-accent-1"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              ) : null}
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="inline-flex text-accent-2 transition hover:text-accent-1"
                  aria-label={t('emailAria', { email: settings.contactEmail })}
                >
                  {settings.contactEmail}
                </a>
              ) : null}
              {textLinks.length > 0 ? (
                <ul className="space-y-2">
                  {textLinks.map((link) => (
                    <li key={link._key ?? link.url}>
                      <a
                        href={link.url}
                        className="text-muted transition hover:text-accent-1"
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('socialAria', { label: link.label })}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
