import { render } from '@testing-library/react';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';

import Footer from '@/components/Footer';
import type { SiteSettings } from '@/lib/sanity';
import type { NavigationLink } from '@/types/navigation';

describe('Footer accessibility', () => {
  const messages = {
    footer: {
      taglineFallback: 'Crafting soulful software for bold brands.',
      rights: '© {year} BitPoet. All rights reserved.',
      navigation: 'Navigate',
      connect: 'Connect',
      homeLinkAria: 'Return to BitPoet home',
      emailAria: 'Email {email}',
      socialAria: 'Open {label} in a new tab'
    }
  };

  const settings: SiteSettings = {
    id: 'site-settings',
    title: 'BitPoet',
    tagline: 'Software and Soul',
    footerNote: 'Crafting soulful software for bold brands.',
    contactEmail: 'hello@bitpoet.dev',
    socialLinks: [
      { _key: 'github', label: 'GitHub', url: 'https://github.com/bitpoet' },
      { _key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/company/bitpoet' },
      { _key: 'newsletter', label: 'Newsletter', url: 'https://bitpoet.dev/newsletter' }
    ]
  };

  const navigation: NavigationLink[] = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  it('renders without axe violations', async () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer navigation={navigation} settings={settings} />
      </NextIntlClientProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
