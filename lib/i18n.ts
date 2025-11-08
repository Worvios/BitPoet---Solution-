export const locales = ['en', 'fr', 'ar'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
};

export const rtlLocales: Locale[] = ['ar'];

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export function isLocale(candidate: string): candidate is Locale {
  return (locales as readonly string[]).includes(candidate);
}

const nextIntlConfig = {
  locales,
  defaultLocale,
  localePrefix: 'always'
};

export default nextIntlConfig;
