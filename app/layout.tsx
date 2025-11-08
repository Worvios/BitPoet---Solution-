import './globals.css';

import type { ReactNode } from 'react';
import { Inter, Orbitron } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { getLocaleDirection, isLocale, type Locale } from '@/lib/i18n';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'BitPoet — Software and Soul',
    template: '%s | BitPoet'
  },
  description: 'BitPoet crafts software experiences with poetry in every pixel.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const detected = await getLocale();
  const locale: Locale = isLocale(detected) ? detected : 'en';
  const dir = getLocaleDirection(locale);

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/* Light-mode animated background overlay */}
        <div className="light-animated-bg pointer-events-none fixed inset-0 -z-10" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
