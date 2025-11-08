import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn: dsn || undefined,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? '0.0'),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  enabled: Boolean(dsn)
});
