import { type SlugSourceFn, defineField, defineType } from 'sanity';

const slugFromEnglishTitle: SlugSourceFn = ({ document }) =>
  ((document as { title?: { en?: string } })?.title?.en ?? '').slice(0, 96);

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString' }),
    defineField({ name: 'summary', title: 'Summary', type: 'localeText' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: slugFromEnglishTitle,
        maxLength: 96
      }
    }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'private', title: 'Private / NDA', type: 'boolean' }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' })
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'thumbnail'
    }
  }
});
