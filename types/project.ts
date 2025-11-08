import type { PortableTextBlock, ProjectDocument, SanityImage } from '@/types/sanity';

export type ProjectSummary = {
  id: string;
  title: string;
  summary: string;
  slug?: string;
  thumbnail?: ProjectDocument['thumbnail'];
  private?: boolean;
  categories?: string[];
};

export type ProjectCaseStudy = {
  id: string;
  title: string;
  tagline: string;
  slug: string;
  heroImage?: SanityImage;
  overview: string;
  sections: {
    spark: PortableTextBlock[];
    poeticChoice: PortableTextBlock[];
    resultBeyondCode: PortableTextBlock[];
  };
  technologies: string[];
  testimonial?: string;
};
