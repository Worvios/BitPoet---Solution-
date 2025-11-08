'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

type ServicesBgProps = {
  activeSection?: number;
};

export function ServicesBg({ activeSection = -1 }: ServicesBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerReactive(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    root.style.setProperty('--services-active-index', activeSection >= 0 ? `${activeSection}` : '-1');
  }, [activeSection]);

  const nodes = useMemo(
    () =>
      [
        { cx: '12%', cy: '32%' },
        { cx: '24%', cy: '42%' },
        { cx: '36%', cy: '48%' },
        { cx: '48%', cy: '54%' },
        { cx: '60%', cy: '58%' },
        { cx: '72%', cy: '52%' },
        { cx: '84%', cy: '44%' },
        { cx: '92%', cy: '34%' },
      ],
    [],
  );

  return (
    <motion.div
      ref={ref}
      className="bp-vroot"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * -16px), calc(var(--my) * -10px), 0)' }}
        >
          <path
            d="M120 320 C 320 420 520 460 720 520 C 920 580 1120 540 1320 440"
            fill="none"
            stroke="var(--blueprint-line-color)"
            strokeWidth="1.4"
            strokeOpacity="var(--blueprint-opacity)"
            strokeDasharray="12 16"
            style={{ strokeDashoffset: 'calc(var(--scroll) * -160)' }}
          />
        </g>

        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * 8px), calc(var(--my) * 8px), 0)' }}
        >
          {nodes.map((node, index) => (
            <circle
              key={node.cx}
              className="bp-node"
              cx={node.cx}
              cy={node.cy}
              r={index === activeSection ? 6 : 4.5}
              fill={index === activeSection ? 'var(--accent-2)' : 'var(--blueprint-node-color)'}
              style={{
                animationDelay: `${index * 0.22}s`,
                opacity: index === activeSection ? 0.9 : 0.6,
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

export default ServicesBg;
