import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString' }),
    defineField({ name: 'summary', title: 'Summary', type: 'localeText' }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' })
  ],
  preview: {
    select: {
      title: 'title.en'
    }
  }
});
