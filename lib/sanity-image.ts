import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { sanityDataset, sanityProjectId } from '@/lib/sanity-config';

const builder = imageUrlBuilder({ projectId: sanityProjectId!, dataset: sanityDataset });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
