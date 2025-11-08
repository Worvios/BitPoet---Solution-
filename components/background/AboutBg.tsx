'use client';

import { motion } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

type AboutBgProps = {
  children: ReactNode;
};

export function AboutBg({ children }: AboutBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerReactive(ref);

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        className="bp-vroot"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="about-noise" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feGaussianBlur in="noise" stdDeviation="12" result="blur" />
              <feBlend in="SourceGraphic" in2="blur" mode="screen" />
            </filter>
          </defs>

          <g
            className="bp-layer"
            style={{ transform: 'translate3d(calc(var(--mx) * -6px), calc(var(--my) * -6px), 0)' }}
          >
            <path
              className="bp-blob"
              d="M260 300 C 420 140 740 160 910 320 C 1080 480 1020 720 820 780 C 620 840 360 700 280 540 C 200 380 100 460 260 300 Z"
              fill="var(--introspection-blob-color)"
              opacity="0.55"
            />
            <path
              className="bp-blob"
              d="M940 180 C 1140 200 1300 360 1340 520 C 1380 680 1250 820 1060 780 C 870 740 740 560 780 400 C 820 240 740 160 940 180 Z"
              fill="var(--introspection-blob-color)"
              opacity="0.45"
            />
          </g>

          <g
            className="bp-layer"
            style={{ transform: 'translate3d(calc(var(--mx) * 4px), calc(var(--my) * 3px), 0)' }}
          >
            <polyline
              className="bp-vein"
              points="320,360 440,300 600,360 720,420 860,400"
              fill="none"
              stroke="var(--introspection-vein-color)"
              strokeWidth="1.2"
              opacity="0.6"
            />
            <polyline
              className="bp-vein"
              points="880,520 960,460 1080,480 1180,560 1260,540"
              fill="none"
              stroke="var(--introspection-vein-color)"
              strokeWidth="1.1"
              opacity="0.5"
              style={{ animationDelay: '2s' }}
            />
          </g>
        </svg>
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AboutBg;
