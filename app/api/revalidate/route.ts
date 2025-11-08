/*
  This is a Next.js API route handler for revalidating content on-demand.
  Create this file at `app/api/revalidate/route.ts`
  Secure it with a secret token.
*/
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  const body = await request.json();
  const { _type, slug } = body?.payload || {};

  if (!slug || !_type) {
    // If no slug or type is provided, we can revalidate the entire site
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, now: Date.now(), message: 'Revalidated all pages' });
  }

  // Define all possible paths for a given slug and type
  const pathsToRevalidate = [];
  const locales = ['en', 'fr', 'ar']; // From your i18n config

  switch (_type) {
    case 'blogPost':
      pathsToRevalidate.push('/blog');
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/blog`);
        if (slug?.current) {
          pathsToRevalidate.push(`/${locale}/blog/${slug.current}`);
        }
      });
      break;
    case 'project':
      pathsToRevalidate.push('/projects');
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/projects`);
      });
      break;
    case 'page':
      // Revalidate home, about, etc.
      locales.forEach(locale => {
        if (slug?.current) {
            pathsToRevalidate.push(`/${locale}/${slug.current}`);
        }
      });
      break;
    default:
      // For global changes like siteSettings, revalidate everything
      revalidatePath('/', 'layout');
      return NextResponse.json({ revalidated: true, now: Date.now(), message: 'Revalidated all pages' });
  }

  // Revalidate all collected paths
  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, now: Date.now(), paths: pathsToRevalidate });
}
