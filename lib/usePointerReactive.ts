'use client';

import { useEffect, type RefObject } from 'react';

const POINTER_FINE_QUERY = '(pointer: fine)';

export function usePointerReactive(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let frame = 0;
    const mediaQuery = window.matchMedia(POINTER_FINE_QUERY);

    const assignPointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const mx = (x / rect.width) * 2 - 1;
        const my = (y / rect.height) * 2 - 1;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;

        root.style.setProperty('--mx', mx.toFixed(3));
        root.style.setProperty('--my', my.toFixed(3));
        root.style.setProperty('--px', `${px.toFixed(2)}%`);
        root.style.setProperty('--py', `${py.toFixed(2)}%`);
      });
    };

    const handleScroll = () => {
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const ratio = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      root.style.setProperty('--scroll', Math.min(1, Math.max(0, ratio)).toFixed(3));
    };

    if (mediaQuery.matches) {
      root.addEventListener('pointermove', assignPointer);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      cancelAnimationFrame(frame);
      if (mediaQuery.matches) {
        root.removeEventListener('pointermove', assignPointer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [rootRef]);
}
