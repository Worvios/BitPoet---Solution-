import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}>;

export default function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <article
      className={clsx(
        'group rounded-3xl border border-strong bg-surface/90 p-6 shadow-sm transition duration-300 hover:border-accent-1/70 hover:shadow-neon-glow',
        'backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur',
        className
      )}
    >
      {title ? (
        <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-accent-1">{title}</h3>
      ) : null}
      {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
      <div className={clsx((title || subtitle) && 'mt-4')}>{children}</div>
    </article>
  );
}
