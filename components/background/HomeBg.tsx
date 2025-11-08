'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

export function HomeBg() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerReactive(ref);

  return (
    <motion.div
      ref={ref}
      className="bp-vroot"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="home-gradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="var(--bg-gradient-mid)" />
            <stop offset="100%" stopColor="var(--bg-gradient-start)" />
          </radialGradient>
        </defs>

        <g className="bp-layer" style={{ transform: 'scale(1.02)' }}>
          <rect width="100%" height="100%" fill="url(#home-gradient)" opacity="0.55" />
        </g>

        <g
          className="bp-layer"
          style={{
            transform:
              'translate3d(calc(var(--mx) * -12px), calc(var(--my) * -12px), 0) scale(calc(1 + var(--scroll) * 0.05))',
          }}
        >
          <circle cx="50%" cy="46%" r="220" fill="none" stroke="var(--accent-1-translucent-05)" strokeWidth="2.2" />
          <circle cx="50%" cy="46%" r="360" fill="none" stroke="var(--accent-2-translucent-05)" strokeWidth="1.6" />
          <circle cx="50%" cy="46%" r="540" fill="none" stroke="var(--accent-1-translucent-05)" strokeWidth="1.1" />
        </g>

        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * 8px), calc(var(--my) * 6px), 0)' }}
        >
          <circle cx="42%" cy="41%" r="3.4" fill="var(--accent-1)" opacity="0.9" />
          <circle cx="58%" cy="48%" r="2.6" fill="var(--accent-2)" opacity="0.8" />
          <circle cx="50%" cy="44%" r="1.8" fill="var(--accent-2-translucent-05)" opacity="0.9" />
        </g>
      </svg>
    </motion.div>
  );
}

export default HomeBg;
