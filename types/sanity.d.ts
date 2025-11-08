/*
  -----------------------------------------------------------------------------
  Auto-generated Sanity types live here. Run `npm run sync-types` after editing
  the schema to refresh this file. The shapes below are intentionally minimal so
  the application can compile before the first sync.
  -----------------------------------------------------------------------------
*/

export type PortableTextBlock = Record<string, unknown>;

export type LocalizedString = {
  en?: string | null;
  fr?: string | null;
  ar?: string | null;
};

export type LocalizedPortableText = {
  en?: PortableTextBlock[] | null;
  fr?: PortableTextBlock[] | null;
  ar?: PortableTextBlock[] | null;
};

export type SanityImage = {
  _type: 'image';
  asset?: {
    _type: 'reference';
    _ref?: string;
  };
  alt?: LocalizedString;
};

export type SiteSettingsDocument = {
  _id: string;
  title?: LocalizedString;
  tagline?: LocalizedString;
  footerNote?: LocalizedString;
  contactEmail?: string;
  socialLinks?: Array<{
    _key: string;
    label: string;
    url: string;
  }>;
};

export type ServiceDocument = {
  _id: string;
  title?: LocalizedString;
  summary?: LocalizedString;
};

export type HomePageDocument = {
  _id: string;
  heroEyebrow?: LocalizedString;
  heroTitle?: LocalizedString;
  heroSubtitle?: LocalizedString;
  heroPrimaryCtaLabel?: LocalizedString;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaLabel?: LocalizedString;
  heroSecondaryCtaLink?: string;
  heroPhilosophyTitle?: LocalizedString;
  heroPhilosophyCopy?: LocalizedString;
  craftEyebrow?: LocalizedString;
  craftTitle?: LocalizedString;
  craftSubtitle?: LocalizedString;
  craftBadgeLabel?: LocalizedString;
  manifestoTitle?: LocalizedString;
  manifestoBody?: LocalizedPortableText;
  featuredProject?: {
    _ref?: string;
  };
  featuredProjectCtaLabel?: LocalizedString;
  footerCtaTitle?: LocalizedString;
  footerCtaBody?: LocalizedPortableText;
  footerCtaButtonLabel?: LocalizedString;
  footerCtaButtonLink?: string;
};

export type AboutPageDocument = {
  _id: string;
  heroEyebrow?: LocalizedString;
  heroTitle?: LocalizedString;
  heroSubtitle?: LocalizedString;
  sections?: Array<{
    _key: string;
    title?: LocalizedString;
    body?: LocalizedPortableText;
  }>;
  profileImage?: SanityImage;
};

export type PageDocument = {
  _id: string;
  title?: LocalizedString;
  slug?: { current?: string };
  heroEyebrow?: LocalizedString;
  heroTitle?: LocalizedString;
  heroSubtitle?: LocalizedString;
  sections?: Array<{
    _key: string;
    heading?: LocalizedString;
    body?: LocalizedPortableText;
  }>;
  seo?: {
    description?: LocalizedString;
  };
};

export type ProjectDocument = {
  _id: string;
  title?: LocalizedString;
  summary?: LocalizedString;
  tagline?: LocalizedString;
  slug?: { current?: string };
  thumbnail?: SanityImage;
  heroImage?: SanityImage;
  private?: boolean;
  categories?: string[];
  theSpark?: LocalizedPortableText;
  thePoeticChoice?: LocalizedPortableText;
  theResultBeyondCode?: LocalizedPortableText;
  technologies?: string[];
  testimonial?: LocalizedString;
  seo?: {
    description?: LocalizedString;
  };
};

export type PostDocument = {
  _id: string;
  title?: LocalizedString;
  slug?: { current?: string };
  excerpt?: LocalizedString;
  body?: LocalizedPortableText;
  coverImage?: SanityImage;
  publishedAt?: string;
  author?: AuthorDocument;
  seo?: {
    description?: LocalizedString;
  };
};

export type AuthorDocument = {
  _id: string;
  name: string;
  avatar?: SanityImage;
  role?: string;
};
