import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import sendgridMail from '@sendgrid/mail';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';
import { contactSchema, type ContactPayload } from './schema';

const localeMessages: Record<Locale, { success: string; error: string }> = {
  en: {
    success: 'Message received. We will reply shortly.',
    error: 'Something went wrong. Please try again or reach us directly.'
  },
  fr: {
    success: 'Message reçu. Nous reviendrons vers vous très vite.',
    error: 'Une erreur est survenue. Réessayez ou écrivez-nous directement.'
  },
  ar: {
    success: 'تم استلام رسالتك. سنعاود التواصل قريبًا.',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة.'
  }
};

const redis = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
})();

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      prefix: 'bitpoet:contact'
    })
  : null;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const SENDGRID_TO_EMAIL = process.env.SENDGRID_TO_EMAIL;

if (SENDGRID_API_KEY && SENDGRID_FROM_EMAIL && SENDGRID_TO_EMAIL) {
  sendgridMail.setApiKey(SENDGRID_API_KEY);
}

function resolveLocale(request: NextRequest): Locale {
  const header = request.headers.get('x-bitpoet-locale') ?? request.headers.get('accept-language');
  if (!header) {
    return defaultLocale;
  }

  const localesInHeader = header
    .split(',')
    .map((part) => part.trim().split(';')[0].toLowerCase())
    .filter(Boolean);

  for (const candidate of localesInHeader) {
    if (isLocale(candidate)) {
      return candidate;
    }
    const shorthand = candidate.split('-')[0];
    if (isLocale(shorthand)) {
      return shorthand;
    }
  }

  return defaultLocale;
}

async function assertRateLimit(request: NextRequest) {
  if (!ratelimit) {
    return { ok: true } as const;
  }

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const result = await ratelimit.limit(`contact:${ip}`);

  return result.success ? { ok: true } : { ok: false, reset: result.reset };
}

async function sendEmail(payload: ContactPayload) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !SENDGRID_TO_EMAIL) {
    throw new Error('Email transport not configured');
  }

  /*
    NOTE: Ensure SENDGRID_FROM_EMAIL domain has SPF + DKIM configured before production launch.
    Reference: https://docs.sendgrid.com/ui/sending-email/sender-authentication
  */

  const { name, email, message } = payload;

  await sendgridMail.send({
    to: SENDGRID_TO_EMAIL,
    from: SENDGRID_FROM_EMAIL,
    replyTo: email,
    subject: `New BitPoet inquiry from ${name}`,
    text: message,
    html: [
      '<p><strong>New contact form submission</strong></p>',
      `<p><strong>Name:</strong> ${name}</p>`,
      `<p><strong>Email:</strong> ${email}</p>`,
      '<p><strong>Message:</strong></p>',
      `<p>${message.replace(/\n/g, '<br/>')}</p>`
    ].join('')
  });
}

export async function POST(request: NextRequest) {
  const locale = resolveLocale(request);

  if (ratelimit) {
    const limit = await assertRateLimit(request);
    if (!limit.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            localeMessages[locale]?.error ?? localeMessages[defaultLocale].error,
          reason: 'rate_limited',
          retryAfter: limit.reset
        },
        {
          status: 429,
          headers: limit.reset ? { 'Retry-After': Math.ceil(limit.reset / 1000).toString() } : undefined
        }
      );
    }
  }

  let payload: ContactPayload;

  try {
    const body = await request.json();
    payload = contactSchema.parse(body);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: localeMessages[locale]?.error ?? localeMessages[defaultLocale].error,
        reason: 'invalid_payload'
      },
      { status: 400 }
    );
  }

  try {
    await sendEmail(payload);
  } catch (error) {
    console.error('Contact form send failed', error);
    return NextResponse.json(
      {
        success: false,
        message: localeMessages[locale]?.error ?? localeMessages[defaultLocale].error,
        reason: 'email_failed'
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: localeMessages[locale]?.success ?? localeMessages[defaultLocale].success
    },
    { status: 200 }
  );
}
