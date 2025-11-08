'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import { usePointerReactive } from '@/lib/usePointerReactive';

type GridCell = {
  id: string;
  cx: number;
  cy: number;
  xNorm: number;
  yNorm: number;
};

type RippleEventDetail =
  | { type: 'activate'; x: number; y: number; projectId?: string }
  | { type: 'clear' };

const RIPPLE_EVENT = 'project-card-ripple';

export function ProjectsBg() {
  const ref = useRef<HTMLDivElement>(null);
  const [isEngaged, setIsEngaged] = useState(false);

  usePointerReactive(ref);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const detail = (event as CustomEvent<RippleEventDetail>).detail;
      if (!detail) {
        return;
      }

      if (detail.type === 'activate') {
        setIsEngaged(true);
        return;
      }

      setIsEngaged(false);
    };

    window.addEventListener(RIPPLE_EVENT, handleEvent as EventListener);
    return () => {
      window.removeEventListener(RIPPLE_EVENT, handleEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    root.style.setProperty('--alchemy-engaged', isEngaged ? '1' : '0');
  }, [isEngaged]);

  const cells = useMemo<GridCell[]>(() => {
    const rows = 7;
    const columns = 11;
    const width = 1440;
    const height = 900;
    const xGap = width / (columns + 1);
    const yGap = height / (rows + 1);

    const list: GridCell[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const cx = xGap * (column + 1);
        const cy = yGap * (row + 1);
        const xNorm = columns > 1 ? (column / (columns - 1)) * 2 - 1 : 0;
        const yNorm = rows > 1 ? (row / (rows - 1)) * 2 - 1 : 0;

        list.push({
          id: `${row}-${column}`,
          cx,
          cy,
          xNorm,
          yNorm,
        });
      }
    }
    return list;
  }, []);

  return (
    <motion.div
      ref={ref}
      className="bp-vroot"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="alchemy-glow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="var(--alchemy-cell-glow)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="bp-layer" style={{ opacity: 0.4 }}>
          <rect width="100%" height="100%" fill="url(#alchemy-glow)" />
        </g>

        <g
          className="bp-layer"
          style={{ transform: 'translate3d(calc(var(--mx) * 10px), calc(var(--my) * 12px), 0)' }}
        >
          {cells.map((cell) => {
            const size = 26;
            const points = [
              `${cell.cx},${cell.cy - size}`,
              `${cell.cx + size},${cell.cy}`,
              `${cell.cx},${cell.cy + size}`,
              `${cell.cx - size},${cell.cy}`,
            ].join(' ');

            const style = {
              '--cell-x': cell.xNorm.toFixed(3),
              '--cell-y': cell.yNorm.toFixed(3),
              transform:
                'translate3d(calc((var(--mx) - var(--cell-x)) * 12px), calc((var(--my) - var(--cell-y)) * 12px), 0)',
              opacity: isEngaged ? 0.92 : 0.6,
              transition: 'transform 0.18s ease-out, fill 0.6s ease, opacity 0.6s ease',
            } as CSSProperties & Record<string, string | number>;

            return (
              <polygon
                key={cell.id}
                points={points}
                style={style}
                fill={isEngaged ? 'var(--accent-1)' : 'var(--alchemy-cell-muted)'}
                stroke="var(--alchemy-cell-glow)"
                strokeWidth={0.4}
              />
            );
          })}
        </g>
      </svg>
    </motion.div>
  );
}

export default ProjectsBg;
