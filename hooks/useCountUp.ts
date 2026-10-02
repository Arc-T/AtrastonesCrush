"use client";
import { useEffect, useRef, useState } from "react";

/** Animates a number toward `target`; `bumped` flips for a moment on change. */
export function useCountUp(target: number, ms = 650) {
  const [val, setVal] = useState(target);
  const [bumped, setBumped] = useState(false);
  const from = useRef(target);
  useEffect(() => {
    if (from.current === target) return;
    const start = from.current, t0 = performance.now();
    let raf = 0;
    setBumped(true);
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (target - start) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        from.current = target;
        setTimeout(() => setBumped(false), 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return { val, bumped };
}
