import 'server-only';

import { createClient } from '@sanity/client';
import groq from 'groq';
import { unstable_cache } from 'next/cache';

import type {
  AboutPageDocument,
  AuthorDocument,
  HomePageDocument,
  LocalizedPortableText,
  LocalizedString,
  PageDocument,
  PortableTextBlock,
  PostDocument,
  ProjectDocument,
  ServiceDocument,
  SiteSettingsDocument
} from '@/types/sanity';
import type { ProjectCaseStudy, ProjectSummary } from '@/types/project';
import { defaultLocale, type Locale } from './i18n';
import { getSanityClientConfig } from './sanity-config';

export { urlForImage } from './sanity-image';

const SANITY_API_VERSION = '2024-05-22';

const config = getSanityClientConfig();

export const sanityClient = config
  ? createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: SANITY_API_VERSION,
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published'
    })
  : null;

function requireSanityClient() {
  if (!sanityClient) {
    throw new Error(
      'Sanity client is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID (and related tokens) to enable content fetching.'
    );
  }

  return sanityClient;
}

type PortableTextValue = PortableTextBlock[];

function resolveLocalizedString(
  value: LocalizedString | null | undefined,
  locale: Locale,
  fallback = ''
): string {
  const localizedValue = value?.[locale] ?? value?.[defaultLocale];
  if (typeof localizedValue === 'string' && localizedValue.trim().length > 0) {
    return localizedValue.trim();
  }
  return fallback;
}

function resolvePortableText(
  value: LocalizedPortableText | null | undefined,
  locale: Locale
): PortableTextValue {
  const localizedValue = value?.[locale] ?? value?.[defaultLocale];
  return Array.isArray(localizedValue) ? localizedValue : [];
}

function normalizeInternalLink(raw: string | null | undefined, fallback: string): string {
  const input = raw?.trim();
  if (!input) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(input) || input.startsWith('mailto:') || input.startsWith('tel:')) {
    return input;
  }

  return input.startsWith('/') ? input : `/${input}`;
}

function mapProjectSummary(project: ProjectDocument, locale: Locale): ProjectSummary {
  return {
    id: project._id,
    title: resolveLocalizedString(project.title, locale),
    summary: resolveLocalizedString(project.summary, locale),
    slug: project.slug?.current,
    thumbnail: project.thumbnail,
    private: project.private,
    categories: project.categories ?? []
  };
}

function mapProjectCaseStudy(project: ProjectDocument, locale: Locale): ProjectCaseStudy | null {
  const slug = project.slug?.current;
  if (!slug) {
    return null;
  }

  const testimonial = resolveLocalizedString(project.testimonial, locale).trim();

  return {
    id: project._id,
    title: resolveLocalizedString(project.title, locale),
    tagline: resolveLocalizedString(project.tagline, locale),
    slug,
    heroImage: project.heroImage ?? project.thumbnail,
    overview: resolveLocalizedString(project.summary, locale),
    sections: {
      spark: resolvePortableText(project.theSpark, locale),
      poeticChoice: resolvePortableText(project.thePoeticChoice, locale),
      resultBeyondCode: resolvePortableText(project.theResultBeyondCode, locale)
    },
    technologies: project.technologies ?? [],
    testimonial: testimonial.length > 0 ? testimonial : undefined
  };
}

const projectSummarySelection = `
  _id,
  title,
  summary,
  slug,
  thumbnail,
  private,
  categories
`;

const projectDetailSelection = `
  _id,
  title,
  summary,
  tagline,
  slug,
  thumbnail,
  heroImage,
  private,
  categories,
  theSpark,
  thePoeticChoice,
  theResultBeyondCode,
  technologies,
  testimonial,
  seo
`;

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  _id,
  title,
  tagline,
  footerNote,
  contactEmail,
  socialLinks
}`;

const servicesQuery = groq`*[_type == "service" && !(_id in path('drafts.**'))]|order(orderRank asc){
  _id,
  title,
  summary
}`;

const projectsQuery = groq`*[_type == "project" && !(_id in path('drafts.**'))]|order(orderRank asc){
  ${projectSummarySelection}
}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug && !(_id in path('drafts.**'))][0]{
  ${projectDetailSelection}
}`;

const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`;

const homePageQuery = groq`*[_type == "homePage"][0]{
  _id,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroPrimaryCtaLink,
  heroSecondaryCtaLabel,
  heroSecondaryCtaLink,
  heroPhilosophyTitle,
  heroPhilosophyCopy,
  craftEyebrow,
  craftTitle,
  craftSubtitle,
  craftBadgeLabel,
  manifestoTitle,
  manifestoBody,
  featuredProject->{${projectDetailSelection}},
  featuredProjectCtaLabel,
  footerCtaTitle,
  footerCtaBody,
  footerCtaButtonLabel,
  footerCtaButtonLink
}`;

const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  _id,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  sections,
  profileImage
}`;

const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  sections,
  seo
}`;

const postsQuery = groq`*[_type == "blogPost" && !(_id in path('drafts.**')) && defined(slug.current)]|order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  body,
  coverImage,
  publishedAt,
  author->{_id, name, avatar, role},
  seo
}`;

const postBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug && !(_id in path('drafts.**'))][0]{
  _id,
  title,
  slug,
  excerpt,
  body,
  coverImage,
  publishedAt,
  author->{_id, name, avatar, role},
  seo
}`;

const postSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`;

export type SiteSettings = {
  id: string;
  title: string;
  tagline: string;
  footerNote: string;
  contactEmail?: string;
  socialLinks: Array<{ _key: string; label: string; url: string }>;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
};

export type InsightPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: PortableTextValue;
  coverImage?: PostDocument['coverImage'];
  publishedAt?: string;
  seoDescription: string;
  author?: {
    id: string;
    name: string;
    role?: string;
    avatar?: AuthorDocument['avatar'];
  };
};

export type BlogPost = InsightPost;

export type HomePageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    philosophy: { title: string; copy: string };
  };
  craft: {
    eyebrow: string;
    title: string;
    subtitle: string;
    badgeLabel: string;
  };
  manifesto: {
    title: string;
    body: PortableTextValue;
  };
  featuredProject: {
    project: ProjectSummary;
    tagline: string;
    image?: ProjectDocument['heroImage'];
    ctaLabel: string;
    href: string;
  } | null;
  footerCta: {
    title: string;
    body: PortableTextValue;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type AboutPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  sections: Array<{
    key: string;
    title: string;
    body: PortableTextValue;
  }>;
  profileImage?: AboutPageDocument['profileImage'];
};

export type PageContent = {
  id: string;
  title: string;
  slug: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  sections: Array<{
    key: string;
    heading: string;
    body: PortableTextValue;
  }>;
  seoDescription: string;
};

const fetchSiteSettings = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const raw = (await client.fetch(siteSettingsQuery)) as SiteSettingsDocument | null;

    return {
      id: raw?._id ?? 'site-settings',
      title: resolveLocalizedString(raw?.title, locale, 'BitPoet'),
      tagline: resolveLocalizedString(raw?.tagline, locale, 'Software with a Soul'),
      footerNote: resolveLocalizedString(raw?.footerNote, locale),
      contactEmail: raw?.contactEmail ?? '',
      socialLinks: raw?.socialLinks ?? []
    } satisfies SiteSettings;
  },
  ['sanity-site-settings'],
  { revalidate: 300, tags: ['sanity:site-settings'] }
);

const fetchServices = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const data = (await client.fetch(servicesQuery)) as ServiceDocument[];
    return data.map((item) => ({
      id: item._id,
      title: resolveLocalizedString(item.title, locale),
      summary: resolveLocalizedString(item.summary, locale)
    }));
  },
  ['sanity-services'],
  { revalidate: 300, tags: ['sanity:services'] }
);

const fetchProjects = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const data = (await client.fetch(projectsQuery)) as ProjectDocument[];
    return data.map((project) => mapProjectSummary(project, locale));
  },
  ['sanity-projects'],
  { revalidate: 300, tags: ['sanity:projects'] }
);

const fetchProjectBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const client = requireSanityClient();
    const project = (await client.fetch(projectBySlugQuery, { slug })) as ProjectDocument | null;
    if (!project) {
      return null;
    }
    return mapProjectCaseStudy(project, locale);
  },
  ['sanity-project-by-slug'],
  { revalidate: 300, tags: ['sanity:projects'] }
);

const fetchProjectSlugs = unstable_cache(
  async () => {
    const client = requireSanityClient();
    const slugs = (await client.fetch(projectSlugsQuery)) as Array<{ slug?: string }>;
    return slugs.map((entry) => entry.slug).filter((slug): slug is string => Boolean(slug));
  },
  ['sanity-project-slugs'],
  { revalidate: 300, tags: ['sanity:projects'] }
);

const fetchHomePage = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const raw = (await client.fetch(homePageQuery)) as (HomePageDocument & {
      featuredProject?: ProjectDocument | null;
    }) | null;

    if (!raw) {
      return null;
    }

    const primaryCtaLabel = resolveLocalizedString(raw.heroPrimaryCtaLabel, locale, 'Start a Conversation');
    const secondaryCtaLabel = resolveLocalizedString(raw.heroSecondaryCtaLabel, locale);

    let featuredProject: HomePageContent['featuredProject'] = null;
    if (raw.featuredProject) {
      const summary = mapProjectSummary(raw.featuredProject, locale);
      const slug = summary.slug ?? '';
      const tagline = resolveLocalizedString(raw.featuredProject.tagline, locale);
      const ctaLabel = resolveLocalizedString(raw.featuredProjectCtaLabel, locale, 'Read the Full Case Study');
      featuredProject = {
        project: summary,
        tagline,
        image: raw.featuredProject.heroImage ?? raw.featuredProject.thumbnail,
        ctaLabel,
        href: slug ? `/projects/${slug}` : '/projects'
      };
    }

    return {
      hero: {
        eyebrow: resolveLocalizedString(raw.heroEyebrow, locale),
        title: resolveLocalizedString(raw.heroTitle, locale),
        subtitle: resolveLocalizedString(raw.heroSubtitle, locale),
        primaryCta: {
          label: primaryCtaLabel,
          href: normalizeInternalLink(raw.heroPrimaryCtaLink, '/contact')
        },
        secondaryCta: secondaryCtaLabel
          ? {
              label: secondaryCtaLabel,
              href: normalizeInternalLink(raw.heroSecondaryCtaLink, '/projects')
            }
          : undefined,
        philosophy: {
          title: resolveLocalizedString(raw.heroPhilosophyTitle, locale),
          copy: resolveLocalizedString(raw.heroPhilosophyCopy, locale)
        }
      },
      craft: {
        eyebrow: resolveLocalizedString(raw.craftEyebrow, locale),
        title: resolveLocalizedString(raw.craftTitle, locale),
        subtitle: resolveLocalizedString(raw.craftSubtitle, locale),
        badgeLabel: resolveLocalizedString(raw.craftBadgeLabel, locale, 'Signature Craft')
      },
      manifesto: {
        title: resolveLocalizedString(raw.manifestoTitle, locale, 'Against the Soulless Web.'),
        body: resolvePortableText(raw.manifestoBody, locale)
      },
      featuredProject,
      footerCta: {
        title: resolveLocalizedString(raw.footerCtaTitle, locale),
        body: resolvePortableText(raw.footerCtaBody, locale),
        buttonLabel: resolveLocalizedString(raw.footerCtaButtonLabel, locale, 'Start a Conversation'),
        buttonHref: normalizeInternalLink(raw.footerCtaButtonLink, '/contact')
      }
    } satisfies HomePageContent;
  },
  ['sanity-home-page'],
  { revalidate: 300, tags: ['sanity:home-page'] }
);

const fetchAboutPage = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const raw = (await client.fetch(aboutPageQuery)) as AboutPageDocument | null;
    if (!raw) {
      return null;
    }

    return {
      hero: {
        eyebrow: resolveLocalizedString(raw.heroEyebrow, locale),
        title: resolveLocalizedString(raw.heroTitle, locale),
        subtitle: resolveLocalizedString(raw.heroSubtitle, locale)
      },
      sections:
        raw.sections?.map((section) => ({
          key: section._key,
          title: resolveLocalizedString(section.title, locale),
          body: resolvePortableText(section.body, locale)
        })) ?? [],
      profileImage: raw.profileImage
    } satisfies AboutPageContent;
  },
  ['sanity-about-page'],
  { revalidate: 300, tags: ['sanity:about-page'] }
);

const fetchPageBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const client = requireSanityClient();
    const page = (await client.fetch(pageBySlugQuery, { slug })) as PageDocument | null;
    if (!page || !page.slug?.current) {
      return null;
    }

    return {
      id: page._id,
      title: resolveLocalizedString(page.title, locale),
      slug: page.slug.current,
      hero: {
        eyebrow: resolveLocalizedString(page.heroEyebrow, locale),
        title: resolveLocalizedString(page.heroTitle, locale),
        subtitle: resolveLocalizedString(page.heroSubtitle, locale)
      },
      sections:
        page.sections?.map((section) => ({
          key: section._key,
          heading: resolveLocalizedString(section.heading, locale),
          body: resolvePortableText(section.body, locale)
        })) ?? [],
      seoDescription: resolveLocalizedString(page.seo?.description, locale)
    } satisfies PageContent;
  },
  ['sanity-page-by-slug'],
  { revalidate: 300, tags: ['sanity:pages'] }
);

const fetchPosts = unstable_cache(
  async (locale: Locale) => {
    const client = requireSanityClient();
    const data = (await client.fetch(postsQuery)) as PostDocument[];

    return data
      .filter((item) => Boolean(item.slug?.current))
      .map((item) => ({
        id: item._id,
        title: resolveLocalizedString(item.title, locale),
        slug: item.slug!.current!,
        excerpt: resolveLocalizedString(item.excerpt, locale),
        body: resolvePortableText(item.body, locale),
        coverImage: item.coverImage,
        publishedAt: item.publishedAt,
        seoDescription: resolveLocalizedString(item.seo?.description, locale),
        author: item.author
          ? {
              id: item.author._id,
              name: item.author.name ?? '',
              role: item.author.role ?? undefined,
              avatar: item.author.avatar
            }
          : undefined
      })) as InsightPost[];
  },
  ['sanity-posts'],
  { revalidate: 180, tags: ['sanity:posts'] }
);

const fetchPostBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const client = requireSanityClient();
    const item = (await client.fetch(postBySlugQuery, { slug })) as PostDocument | null;
    if (!item || !item.slug?.current) {
      return null;
    }

    return {
      id: item._id,
      title: resolveLocalizedString(item.title, locale),
      slug: item.slug.current,
      excerpt: resolveLocalizedString(item.excerpt, locale),
      body: resolvePortableText(item.body, locale),
      coverImage: item.coverImage,
      publishedAt: item.publishedAt,
      seoDescription: resolveLocalizedString(item.seo?.description, locale),
      author: item.author
        ? {
            id: item.author._id,
            name: item.author.name ?? '',
            role: item.author.role ?? undefined,
            avatar: item.author.avatar
          }
        : undefined
    } satisfies InsightPost;
  },
  ['sanity-post-by-slug'],
  { revalidate: 180, tags: ['sanity:posts'] }
);

const fetchPostSlugs = unstable_cache(
  async () => {
    const client = requireSanityClient();
    const slugs = (await client.fetch(postSlugsQuery)) as Array<{ slug?: string }>;
    return slugs.map((entry) => entry.slug).filter((slug): slug is string => Boolean(slug));
  },
  ['sanity-post-slugs'],
  { revalidate: 180, tags: ['sanity:posts'] }
);

export const getSiteSettings = fetchSiteSettings;
export const getServices = fetchServices;
export const getProjects = fetchProjects;
export const getProjectCaseStudy = fetchProjectBySlug;
export const getProjectBySlug = fetchProjectBySlug;
export const getProjectSlugs = fetchProjectSlugs;
export const getHomePageContent = fetchHomePage;
export const getAboutPageContent = fetchAboutPage;
export const getPageContent = fetchPageBySlug;
export const getBlogPosts = fetchPosts;
export const getBlogPostBySlug = fetchPostBySlug;
export const getBlogPostSlugs = fetchPostSlugs;

