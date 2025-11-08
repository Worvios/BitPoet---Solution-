import React from 'react';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

const titles: Record<Locale, { title: string; tagline: string }> = {
  en: {
    title: 'BitPoet',
    tagline: 'Software and Soul'
  },
  fr: {
    title: 'BitPoet',
    tagline: 'Logiciel et âme'
  },
  ar: {
    title: 'BitPoet',
    tagline: 'برمجيات بروح'
  }
};

function resolveLocale(param: string | null): Locale {
  if (param && isLocale(param)) {
    return param;
  }

  if (param) {
    const shorthand = param.split('-')[0];
    if (isLocale(shorthand)) {
      return shorthand;
    }
  }

  return defaultLocale;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get('locale'));
  const headline = searchParams.get('title')?.slice(0, 120) || `${titles[locale].title} — ${titles[locale].tagline}`;
  const subhead = searchParams.get('tagline')?.slice(0, 140) || titles[locale].tagline;

  const containerStyle: React.CSSProperties = {
    width: WIDTH,
    height: HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'radial-gradient(circle at 20% 20%, rgba(15, 255, 193, 0.28), transparent 55%), radial-gradient(circle at 80% 80%, rgba(93, 63, 211, 0.32), transparent 45%), #0d1220',
    color: '#f5f5ff',
    textAlign: 'center',
    border: '1px solid rgba(15, 255, 193, 0.18)',
    boxShadow: '0 40px 120px rgba(15, 255, 193, 0.18)',
    padding: 96,
    fontFamily: 'Inter, Segoe UI, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const gradientOverlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(135deg, rgba(93,63,211,0.16) 10%, rgba(15,255,193,0.08) 55%, rgba(12,10,24,0.75) 100%)'
  };

  const gridOverlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
    backgroundSize: '22px 22px',
    opacity: 0.18
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    maxWidth: 840
  };

  const eyebrowStyle: React.CSSProperties = {
    textTransform: 'uppercase',
    letterSpacing: '0.8rem',
    fontSize: 20,
    color: 'rgba(15, 255, 193, 0.85)'
  };

  const headlineStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 72,
    lineHeight: 1.05,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    textShadow: '0 0 18px rgba(15, 255, 193, 0.25)'
  };

  const taglineStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.4,
    color: 'rgba(245, 245, 255, 0.78)'
  };

  return new ImageResponse(
    React.createElement(
      'div',
      { style: containerStyle },
      React.createElement('div', { style: gradientOverlay }),
      React.createElement('div', { style: gridOverlay }),
      React.createElement(
        'div',
        { style: contentStyle },
        React.createElement('span', { style: eyebrowStyle }, 'BitPoet Studio'),
        React.createElement('h1', { style: headlineStyle }, headline),
        React.createElement('p', { style: taglineStyle }, subhead)
      )
    ),
    {
      width: WIDTH,
      height: HEIGHT
    }
  );
}
