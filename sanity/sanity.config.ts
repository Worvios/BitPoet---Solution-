import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

import { schemaTypes } from './schemas';

const resolvedProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'if0cns25';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'bitpoet-studio',
  title: 'BitPoet Studio',
  projectId: resolvedProjectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes
  }
});
