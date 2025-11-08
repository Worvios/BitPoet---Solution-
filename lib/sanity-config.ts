export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

let hasWarned = false;

export type SanityClientConfig = {
  projectId: string;
  dataset: string;
};

export function getSanityClientConfig(): SanityClientConfig | null {
  if (!sanityProjectId) {
    if (!hasWarned && process.env.NODE_ENV !== 'production') {
      console.warn(
        'Sanity credentials are missing. Define NEXT_PUBLIC_SANITY_PROJECT_ID to enable CMS-backed content.'
      );
      hasWarned = true;
    }
    return null;
  }

  return {
    projectId: sanityProjectId,
    dataset: sanityDataset
  };
}
