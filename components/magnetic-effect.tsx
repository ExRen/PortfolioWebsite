"use client";

import { useEffect } from "react";

export function MagneticEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || !isLargeScreen || isReduced) return;

    let activeElem: HTMLElement | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        ".magnetic-btn, .magnetic-badge"
      ) as HTMLElement | null;

      if (activeElem && activeElem !== target) {
        activeElem.style.transform = "translate3d(0, 0, 0)";
        activeElem = null;
      }

      if (!target) return;

      activeElem = target;
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const factor = target.classList.contains("magnetic-badge") ? 0.18 : 0.35;
      const dx = (e.clientX - cx) * factor;
      const dy = (e.clientY - cy) * factor;

      target.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    };

    const onPointerLeave = () => {
      if (activeElem) {
        activeElem.style.transform = "translate3d(0, 0, 0)";
        activeElem = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      if (activeElem) {
        activeElem.style.transform = "translate3d(0, 0, 0)";
      }
    };
  }, []);

  return null;
}
