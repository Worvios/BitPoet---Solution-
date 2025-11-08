import { defineField, defineType } from 'sanity';


// schemas/siteSettings.ts

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // --- Existing Fields (You already have these) ---
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'localeString', // Assumes you have a 'localeString' type
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'localeText', // Assumes you have a 'localeText' type for longer text
    }),
    
    // --- NEW FIELDS TO ADD ---
    defineField({
      name: 'manifestoTitle',
      title: 'Manifesto Title',
      description: 'The title for the "Against the Soulless Web" section on the homepage.',
      type: 'localeString',
      group: 'manifesto', // This helps organize fields into tabs
    }),
    defineField({
      name: 'manifestoBody',
      title: 'Manifesto Body',
      description: 'The main text for the manifesto section.',
      type: 'localePortableText', // Assumes a type for rich text
      group: 'manifesto',
    }),
    defineField({
        name: 'ctaTitle',
        title: 'Footer CTA Title',
        description: 'The title for the final Call to Action section, e.g., "Have a creative idea?"',
        type: 'localeString',
        group: 'footerCta',
    }),
    defineField({
        name: 'ctaButtonText',
        title: 'Footer CTA Button Text',
        description: 'The text for the button, e.g., "Start a Conversation"',
        type: 'localeString',
        group: 'footerCta',
    }),
defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'url', type: 'url', title: 'URL' })
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' }
          }
        })
      ]
    }),
    // --- Your Existing Footer Note ---
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'localeString', // Or 'localeText' if it's longer
    }),
  ],
  // This creates tabs in the Sanity Studio UI for better organization
  groups: [
    { name: 'manifesto', title: 'Manifesto Section' },
    { name: 'footerCta', title: 'Footer CTA Section' },
  ],
})