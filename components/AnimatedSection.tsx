"use client";

import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

type AnimatedSectionProps = PropsWithChildren<{
  className?: string;
  id?: string;
}>;

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={clsx(className)}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: '0px 0px -10% 0px' }}
      animate={prefersReducedMotion ? { opacity: 1 } : undefined}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
}
