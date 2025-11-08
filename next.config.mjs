import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/if0cns25/production/**',
      },
    ]
  }
};

const withIntl = withNextIntl(nextConfig);

export default withSentryConfig(
  withIntl,
  {
    silent: true
  },
  {
    hideSourcemaps: true
  }
);
