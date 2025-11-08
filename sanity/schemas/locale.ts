import { defineArrayMember, defineField, defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({ name: 'en', type: 'string', title: 'English' }),
    defineField({ name: 'fr', type: 'string', title: 'Français' }),
    defineField({ name: 'ar', type: 'string', title: 'العربية' })
  ]
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({ name: 'en', type: 'text', rows: 4, title: 'English' }),
    defineField({ name: 'fr', type: 'text', rows: 4, title: 'Français' }),
    defineField({ name: 'ar', type: 'text', rows: 4, title: 'العربية' })
  ]
});

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Localized Portable Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      type: 'array',
      title: 'English',
      of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'image' })]
    }),
    defineField({
      name: 'fr',
      type: 'array',
      title: 'Français',
      of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'image' })]
    }),
    defineField({
      name: 'ar',
      type: 'array',
      title: 'العربية',
      of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'image' })]
    })
  ]
});
