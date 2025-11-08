import { type AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

const loaders: Record<Locale, () => Promise<{ default: unknown }>> = {
  en: () => import('@/locales/en.json'),
  fr: () => import('@/locales/fr.json'),
  ar: () => import('@/locales/ar.json')
};

export default getRequestConfig(async ({ requestLocale }) => {
  let targetLocale: Locale = defaultLocale;
  let resolvedLocale: string | undefined;

  try {
    resolvedLocale = await requestLocale;
  } catch {
    resolvedLocale = undefined;
  }

  if (resolvedLocale && isLocale(resolvedLocale)) {
    targetLocale = resolvedLocale;
  }
  const loader = loaders[targetLocale] ?? loaders[defaultLocale];
  const messages = (await loader()).default as AbstractIntlMessages;

  return {
    locale: targetLocale,
    messages
  };
});
