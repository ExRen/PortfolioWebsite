"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: string;
}

export function Counter({ value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    // Detect numeric prefix; keep non-digits intact
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    // Handle "3.93" — treat as single number with the dot preserved literally
    const isDecimal = numStr.includes(".");
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }

    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            animate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);

    function animate() {
      const duration = 1200;
      const startTime = performance.now();
      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        const formatted = isDecimal
          ? current.toFixed(numStr.split(".")[1]?.length ?? 0)
          : Math.floor(current).toLocaleString();
        setDisplay(`${prefix}${formatted}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      }
      requestAnimationFrame(tick);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="stat-v">
      {display}
    </span>
  );
}
