import { type SlugSourceFn, defineArrayMember, defineField, defineType } from 'sanity';

import { localePortableText, localeString } from './locale';

const slugFromEnglishTitle: SlugSourceFn = ({ document }) =>
  ((document as { title?: { en?: string } })?.title?.en ?? '').slice(0, 96);

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: slugFromEnglishTitle,
        maxLength: 96
      }
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'localeString'
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero subheadline',
      type: 'localeString'
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'section',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'localeString', title: 'Heading' }),
            defineField({ name: 'body', type: 'localePortableText', title: 'Body' })
          ],
          preview: {
            select: { title: 'heading.en' },
            prepare: ({ title }) => ({
              title: title || 'Section'
            })
          }
        })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'description', type: 'localeString', title: 'Description' })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.en'
    }
  }
});
