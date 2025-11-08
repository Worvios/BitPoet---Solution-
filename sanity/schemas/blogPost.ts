import { type SlugSourceFn, defineArrayMember, defineField, defineType } from 'sanity';

const slugFromEnglishTitle: SlugSourceFn = ({ document }) =>
  ((document as { title?: { en?: string } })?.title?.en ?? '').slice(0, 96);

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: slugFromEnglishTitle,
        maxLength: 96
      }
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localeText' }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localePortableText'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [defineField({ name: 'description', type: 'localeText', title: 'Description' })]
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'publishedAt',
      media: 'coverImage'
    }
  }
});
