import { redirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

type BlogSlugPageProps = {
  params: { slug: string };
};

export default function BlogSlugRedirect({ params }: BlogSlugPageProps) {
  redirect(`/${defaultLocale}/blog/${params.slug}`);
}
