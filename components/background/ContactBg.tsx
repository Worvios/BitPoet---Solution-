'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

export function ContactBg() {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  usePointerReactive(ref);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-contact-form="true"]')) {
        setIsFocused(true);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const related = (event.relatedTarget as HTMLElement | null) ?? document.activeElement;
      if (!related || !related.closest('[data-contact-form="true"]')) {
        setIsFocused(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    root.style.setProperty('--bridge-focus', isFocused ? '1' : '0');
  }, [isFocused]);

  return (
    <motion.div
      ref={ref}
      className="bp-vroot"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.95, ease: 'easeOut' }}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="contact-gradient" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="var(--accent-2-translucent-05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <g className="bp-layer" style={{ opacity: 0.35 }}>
          <rect width="100%" height="100%" fill="url(#contact-gradient)" />
        </g>

        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * 10px), calc(var(--my) * 8px), 0)' }}
        >
          <path
            className={`bp-arc${isFocused ? ' is-active' : ''}`}
            d="M-80 520 C 220 420 520 360 820 420 C 1020 460 1180 520 1500 620"
          />
          <path
            className={`bp-arc${isFocused ? ' is-active' : ''}`}
            d="M-120 420 C 240 300 520 280 900 360 C 1120 404 1290 460 1520 540"
            style={{ animationDelay: '0.18s' }}
          />
          <path
            className={`bp-arc${isFocused ? ' is-active' : ''}`}
            d="M-60 640 C 260 560 540 520 820 520 C 1080 520 1260 580 1500 700"
            style={{ animationDelay: '0.32s' }}
          />
        </g>
      </svg>
    </motion.div>
  );
}

export default ContactBg;
