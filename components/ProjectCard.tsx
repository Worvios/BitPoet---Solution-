'use client';

import { useCallback, type FocusEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';

import type { ProjectSummary } from '@/types/project';
import { urlForImage } from '@/lib/sanity-image';
import { type Locale } from '@/lib/i18n';

type ProjectCardCopy = {
  privateLabel: string;
  ctaLabel: string;
  ctaHref: string;
  privateCopy: string;
};

type ProjectCardProps = {
  project: ProjectSummary;
  locale: Locale;
  copy: ProjectCardCopy;
};

type RippleEventDetail =
  | { type: 'activate'; x: number; y: number; projectId: string }
  | { type: 'clear' };

export default function ProjectCard({ project, locale, copy }: ProjectCardProps) {
  const isPrivate = Boolean(project.private);
  const imageUrl = project.thumbnail ? urlForImage(project.thumbnail).width(720).height(440).url() : null;

  const normalizedHref = copy.ctaHref.startsWith('/') ? copy.ctaHref : `/${copy.ctaHref}`;
  const categoriesLabel = project.categories?.filter(Boolean).join(' · ') ?? '';

  const dispatchRipple = useCallback((detail: RippleEventDetail) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('project-card-ripple', { detail }));
  }, []);

  const handlePointerEvent = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      dispatchRipple({ type: 'activate', x, y, projectId: project.id });
    },
    [dispatchRipple, project.id],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      dispatchRipple({ type: 'activate', x, y, projectId: project.id });
    },
    [dispatchRipple, project.id],
  );

  const handlePointerLeave = useCallback(() => {
    dispatchRipple({ type: 'clear' });
  }, [dispatchRipple]);

  const handleBlur = useCallback(() => {
    dispatchRipple({ type: 'clear' });
  }, [dispatchRipple]);

  return (
    <article
      className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border glass-panel p-6 transition duration-300 hover:border-accent-1/70 hover:shadow-[0_24px_60px_-32px_rgba(93,63,211,0.65)]"
      onPointerEnter={handlePointerEvent}
      onPointerMove={handlePointerEvent}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="space-y-4">
        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/40">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-accent-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted">{project.summary}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.3em]">
        <span className="text-subtle">{categoriesLabel || '\u00A0'}</span>
        {isPrivate ? (
          <span className="text-accent-2">{copy.privateLabel}</span>
        ) : (
          <Link href={normalizedHref} className="text-accent-2 transition hover:text-accent-1">
            {copy.ctaLabel}
          </Link>
        )}
      </div>

      {isPrivate ? (
        <p className="mt-4 rounded-2xl border border-dashed border-accent-2/40 bg-accent-2/10 p-4 text-xs text-accent-2">
          {copy.privateCopy}
        </p>
      ) : null}
    </article>
  );
}
