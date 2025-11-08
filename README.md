# BitPoet — Software and Soul

BitPoet is a multilingual, content-driven marketing site for a boutique studio that merges poetry and engineering. The project is built with Next.js 14, the App Router, TypeScript, Tailwind CSS, Sanity CMS, and next-intl.

## Tech Stack

- Next.js 14 (App Router, Edge-ready)
- TypeScript with strict mode
- Tailwind CSS + @tailwindcss/typography
- next-intl for i18n
- next-themes for dark/light modes
- Framer Motion for motion flourishes
- next-seo for SEO helpers
- Sanity (v3) headless CMS + sanity-ts type generation
- Zod for form validation
- SendGrid (or SMTP) for transactional emails

## Project Structure

```
app/
  [locale]/
    (site)/{page}/page.tsx  ← locale-aware route segments
  layout.tsx                ← shared providers + metadata
  globals.css               ← Tailwind base styles
components/                ← UI building blocks
lib/                       ← helpers (Sanity client, i18n)
locales/                   ← translation dictionaries
sanity/                    ← Studio configuration + schemas
scripts/seed.ts            ← Seed baseline content into Sanity
```

## Getting Started

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Environment variables**

   Create a `.env.local` file containing:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://bitpoet.dev
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-05-22
   SANITY_API_READ_TOKEN=with-viewer-or-editor-rights
      SANITY_API_WRITE_TOKEN=with-editor-rights
   SENDGRID_API_KEY=your-sendgrid-key
   SENDGRID_FROM_EMAIL=hello@bitpoet.studio
   SENDGRID_TO_EMAIL=hello@bitpoet.studio
   SENTRY_DSN=your-sentry-dsn
   SENTRY_ENVIRONMENT=development
   SENTRY_TRACES_SAMPLE_RATE=0.1
   SENTRY_PROFILES_SAMPLE_RATE=0
   SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0
   SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1
   ```

3. **Run the Next.js dev server**
   ```powershell
   npm run dev
   ```

4. **Open the Sanity Studio**
   ```powershell
   npm run sanity:dev
   ```
   This command will start the embedded Studio at `http://localhost:3333`. Deploy with `npm run sanity:deploy`.

5. **Seed starter content (optional)**
   ```powershell
   npm run seed
   ```
      The script requires `SANITY_API_WRITE_TOKEN` and upserts base entities.

## Commands

- `npm run dev` — Start Next.js with Turbopack
- `npm run build` — Create production build
- `npm run lint` — Run ESLint
- `npm run test` — Run Vitest suite (unit + accessibility smoke tests)
- `npm run test:coverage` — Collect coverage via Vitest
- `npm run format` — Format with Prettier
- `npm run sanity:dev` — Run Sanity Studio locally
- `npm run sanity:deploy` — Deploy Studio to Sanity hosting
- `npm run sanity:graphql` — Re-generate Sanity GraphQL API
- `npm run seed` — Seed baseline Sanity documents

## Localization

- Supported locales: `en`, `fr`, `ar`
- Locale detection handled by middleware + next-intl
- All content strings live in `locales/{locale}.json`
- RTL handling for Arabic is automatic via Tailwind + logical styles

## Contact Form

- Client-side validation via Zod
- POSTs to `/api/contact`
- Implement `app/api/contact/route.ts` to forward to SendGrid (pending)

## Sanity Content Model

- `siteSettings` — global navigation, footer, social links
- `page` — hero copy + modular sections
- `service` — offerings ordered by rank
- `project` — case studies (with private flag)
- `blogPost` — localized marketing content
- `author` — authors for posts
- `localeText` — localized string helper

## Deployment

- Designed for Vercel. Ensure environment variables are set and the Edge runtime is enabled when appropriate.
- Deploy Studio separately (`npm run sanity:deploy`) so CMS authors can manage content without touching the Next.js app.

## Testing & QA

- Automated coverage: `npm run test` (unit, schema validation, and accessibility smoke checks via axe).
- Suggested additions: integrate component-level tests for hero sections and Sanity data mocks.
- Critical manual tests: locale switching, dark/light toggles, Sanity-connected content, contact form submission, structured data validation.

## Observability

- Analytics: Vercel Analytics (`@vercel/analytics`) and Speed Insights are wired in `app/layout.tsx`.
- Monitoring: Sentry (`@sentry/nextjs`) initialized for server, client, and edge runtimes. Configure DSN + sample rates via environment variables before deployment.

## Roadmap

- Complete `/app/api/contact/route.ts`
- Add analytics integration (e.g., Vercel Web Analytics, PostHog)
- Expand schema with reusable callouts/metrics modules
- Build additional locale content and blog posts

---

Built with care to make poetry tangible in pixels. ✨
