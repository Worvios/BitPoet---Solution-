'use client';

import { useCallback, useEffect, useMemo } from 'react';

import BlogCard from '@/components/BlogCard';
import { BlogBg } from '@/components/background/BlogBg';
import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/sanity';

const THREAD_IDS = ['thread-1', 'thread-2', 'thread-3', 'thread-4', 'thread-5', 'thread-6'] as const;

type BlogPostEntry = {
  post: BlogPost;
  authorLabel: string | null;
};

type BlogIndexClientProps = {
  posts: BlogPostEntry[];
  locale: Locale;
  labels: {
    readMore: string;
    unknownDate: string;
  };
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  hasError: boolean;
  errorMessage: string;
};

export function BlogIndexClient({
  posts,
  locale,
  labels,
  header,
  hasError,
  errorMessage,
}: BlogIndexClientProps) {
  const threadSequence = useMemo(() => THREAD_IDS, []);

  const activateThread = useCallback((threadId: string | undefined) => {
    if (!threadId) {
      return;
    }

    document.querySelectorAll('.narrative-thread.is-active').forEach((node) => {
      node.classList.remove('is-active');
    });

    document.getElementById(threadId)?.classList.add('is-active');
  }, []);

  const deactivateThreads = useCallback(() => {
    document.querySelectorAll('.narrative-thread.is-active').forEach((node) => {
      node.classList.remove('is-active');
    });
  }, []);

  useEffect(() => () => {
    deactivateThreads();
  }, [deactivateThreads]);

  return (
    <>
      <BlogBg />
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 lg:px-16">
        <header className="mb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{header.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">{header.title}</h1>
          <p className="mt-4 text-base text-muted">{header.description}</p>
        </header>

        {hasError ? (
          <p className="rounded-3xl border border-danger/50 bg-danger/10 p-6 text-center text-sm text-danger">
            {errorMessage}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((entry, index) => {
              const threadId = threadSequence[index % threadSequence.length];

              const handleEnter = () => activateThread(threadId);
              const handleLeave = () => deactivateThreads();

              return (
                <div
                  key={entry.post.id}
                  onPointerEnter={handleEnter}
                  onPointerLeave={handleLeave}
                  onFocusCapture={handleEnter}
                  onBlurCapture={handleLeave}
                >
                  <BlogCard
                    post={entry.post}
                    locale={locale}
                    authorLabel={entry.authorLabel}
                    labels={labels}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default BlogIndexClient;
