'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

import ServicesBg from '@/components/background/ServicesBg';
import AnimatedSection from '@/components/AnimatedSection';
import Card from '@/components/Card';

type ServiceSection = {
  title: string;
  copy: string;
};

type ServicesShowcaseProps = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  sections: ServiceSection[];
};

type SectionObserverProps = {
  index: number;
  onActive: (index: number) => void;
  children: ReactNode;
};

function SectionObserver({ index, onActive, children }: SectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.55,
    margin: '-25% 0px -25% 0px',
  });

  useEffect(() => {
    if (isInView) {
      onActive(index);
    }
  }, [index, isInView, onActive]);

  const handlePointer = useCallback(() => {
    onActive(index);
  }, [index, onActive]);

  return (
    <motion.div
      ref={ref}
      className="h-full"
      onPointerEnter={handlePointer}
      onFocusCapture={handlePointer}
      viewport={{ amount: 0.55, margin: '-25% 0px -25% 0px' }}
    >
      {children}
    </motion.div>
  );
}

export default function ServicesShowcase({ hero, sections }: ServicesShowcaseProps) {
  const [activeSection, setActiveSection] = useState(0);

  const handleActive = useCallback((index: number) => {
    setActiveSection((previous) => (previous === index ? previous : index));
  }, []);

  const safeSections = useMemo(() => sections ?? [], [sections]);

  useEffect(() => {
    if (safeSections.length > 0) {
      setActiveSection(0);
    }
  }, [safeSections.length]);

  return (
    <>
  <ServicesBg activeSection={activeSection} />

      <AnimatedSection className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 lg:px-16">
        <header className="mb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-accent-2/80">{hero.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">{hero.title}</h1>
          <p className="mt-4 text-base text-muted">{hero.description}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {safeSections.map((section, index) => (
            <SectionObserver key={section.title ?? index} index={index} onActive={handleActive}>
              <Card title={section.title} subtitle={section.copy} className="h-full" />
            </SectionObserver>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
