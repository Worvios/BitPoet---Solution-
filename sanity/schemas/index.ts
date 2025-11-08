import author from './author';
import blogPost from './blogPost';
import page from './page';
import project from './project';
import service from './service';
import siteSettings from './siteSettings';
import { localePortableText, localeString, localeText } from './locale';

export const schemaTypes = [
  localeString,
  localeText,
  localePortableText,
  siteSettings,
  page,
  service,
  project,
  blogPost,
  author
];
