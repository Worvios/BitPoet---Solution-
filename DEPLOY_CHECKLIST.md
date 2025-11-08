# BitPoet Deployment Checklist

## Pre-flight
- [ ] `npm install` completes without errors.
- [ ] `npm run lint` passes (resolve missing type declarations and ESLint issues).
- [ ] `npm run test` passes (unit + accessibility smoke tests).
- [ ] `npm run build` succeeds locally.
- [ ] `.env.production` created with production credentials.
- [ ] Sanity project ID + dataset confirmed (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`).
- [ ] `SANITY_API_READ_TOKEN` has at least `viewer` access.
- [ ] `SANITY_API_WRITE_TOKEN` (if seeding) has `editor` access.
- [ ] SendGrid (or mail provider) credentials verified; sender domain authenticated.
- [ ] Sentry DSN + environment variables configured (`SENTRY_DSN`, sample rates as needed).

## Sanity CMS
- [ ] Schemas deployed (`npm run sanity:deploy`).
- [ ] Run `npm run seed` on first deployment or import existing dataset.
- [ ] Required documents published (`siteSettings`, `service`, `project`, `page`, `blogPost`).
- [ ] Localization fields filled for `en`, `fr`, `ar`.

## Next.js App
- [ ] `next.config.mjs` runtime + domains validated.
- [ ] `app/api/contact/route.ts` implemented with SendGrid handler.
- [ ] Structured data and metadata tested via [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Check locale middleware behaviour in dev by visiting `/fr`, `/ar`.
- [ ] Verify dark/light theme switch and persistence.
- [ ] Confirm fallback skeletons appear for slow Sanity responses.
- [ ] Validate analytics events in Vercel Analytics dashboard after production deployment.
- [ ] Confirm Sentry receives test error (trigger intentionally in preview environment).

## QA
- [ ] Manual pass on all locales: navigation, CTA links, forms.
- [ ] Contact form sends email and returns success toast.
- [ ] Cross-browser smoke test (Chrome, Firefox, Safari, Edge).
- [ ] Accessibility scan (e.g., Axe DevTools) with no serious violations.
- [ ] Performance audit (Lighthouse) scores 90+ on mobile.

## Deployment
- [ ] Vercel project connected and environment variables set.
- [ ] Domain configured and SSL active.
- [ ] Run `vercel --prod` (or merge to main) to trigger deployment.
- [ ] Monitor logs + analytics on first production run.

## Post-launch
- [ ] Set up error monitoring (Sentry or similar).
- [ ] Implement analytics (Vercel Analytics / PostHog / GA4).
- [ ] Schedule regular CMS backup exports.
- [ ] Document content editing workflow for the team.
