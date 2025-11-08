import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '@/lib/i18n';

export const { Link, useRouter, usePathname } = createSharedPathnamesNavigation({ locales });
