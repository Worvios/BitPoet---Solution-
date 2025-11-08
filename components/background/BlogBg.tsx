'use client';

import { motion } from 'framer-motion';
import { useRef, useMemo } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

const THREAD_PATHS = [
  { id: 'thread-1', d: 'M100 800 C 420 620 840 220 1320 140' },
  { id: 'thread-2', d: 'M80 120 C 420 320 860 720 1340 840' },
  { id: 'thread-3', d: 'M60 460 C 520 420 920 420 1360 460' },
  { id: 'thread-4', d: 'M40 320 C 380 160 940 160 1400 340' },
  { id: 'thread-5', d: 'M120 700 C 380 620 900 820 1360 700' },
  { id: 'thread-6', d: 'M160 540 C 500 420 960 560 1290 360' }
];

export function BlogBg() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerReactive(ref);

  const threads = useMemo(() => THREAD_PATHS, []);

  return (
    <motion.div
      ref={ref}
      className="bp-vroot"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="blog-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <linearGradient id="blog-canvas" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-gradient-start)" />
            <stop offset="100%" stopColor="var(--bg-gradient-mid)" />
          </linearGradient>
        </defs>

        <g className="bp-layer" style={{ transform: 'scale(1.01)' }}>
          <rect width="100%" height="100%" fill="url(#blog-canvas)" opacity="0.55" />
          <rect width="100%" height="100%" filter="url(#blog-noise)" opacity="0.035" />
        </g>

        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * -10px), calc(var(--my) * -10px), 0)' }}
        >
          <path d="M0 200 H1440" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.16" />
          <path d="M0 400 H1440" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.14" />
          <path d="M0 600 H1440" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.12" />
          <path d="M320 0 V900" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.15" />
          <path d="M720 0 V900" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.18" />
          <path d="M1120 0 V900" stroke="var(--grid-dot-color)" strokeWidth="0.5" opacity="0.12" />
        </g>

        <g
          className="bp-layer narrative-threads"
          style={{ transform: 'translate3d(calc(var(--mx) * 12px), calc(var(--my) * 12px), 0)' }}
        >
          {threads.map((thread, index) => (
            <path key={thread.id} id={thread.id} className={`narrative-thread narrative-thread-${index + 1}`} d={thread.d} />
          ))}
        </g>
      </svg>

      <style jsx>{`
        .narrative-thread {
          fill: none;
          stroke-width: 1.4;
          stroke: var(--accent-1);
          stroke-opacity: 0.14;
          transition: stroke-opacity 0.4s ease, transform 0.45s ease;
          animation: blog-thread-drift 38s ease-in-out infinite alternate;
        }

        .narrative-thread-2 {
          stroke: var(--accent-2);
          animation-duration: 46s;
        }

        .narrative-thread-3 {
          animation-duration: 52s;
          animation-direction: alternate-reverse;
        }

        .narrative-thread-4 {
          stroke-width: 1.2;
          animation-duration: 58s;
        }

        .narrative-thread-5 {
          animation-duration: 64s;
        }

        .narrative-thread-6 {
          stroke-width: 1.1;
          animation-duration: 68s;
        }

        .narrative-thread.is-active {
          stroke-opacity: 0.82;
          transform: scale3d(1.015, 1.015, 1);
        }

        @keyframes blog-thread-drift {
          from {
            transform: translateX(-24px);
          }
          to {
            transform: translateX(24px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .narrative-thread {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default BlogBg;
