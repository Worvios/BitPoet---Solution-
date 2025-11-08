import type { Service } from '@/lib/sanity';

type ServiceCardProps = {
  service: Service;
  badge: string;
};

export default function ServiceCard({ service, badge }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-3xl border glass-panel p-8 transition duration-300 hover:border-accent-1/70 hover:shadow-[0_24px_60px_-32px_rgba(93,63,211,0.65)]">
      <span className="text-xs uppercase tracking-[0.3em] text-accent-2/80">{badge}</span>
      <h3 className="font-display text-3xl text-foreground transition-colors group-hover:text-accent-1">
        {service.title}
      </h3>
      <p className="text-sm text-muted">{service.summary}</p>
    </article>
  );
}
