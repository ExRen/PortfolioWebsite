"use client";

import { useEffect, useRef, useState } from "react";

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || !isLargeScreen || isReduced) return;

    setActive(true);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHovered = false;
    let rafId: number | null = null;
    let isVisible = false;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible && cursorRef.current) {
        isVisible = true;
        cursorRef.current.style.opacity = "1";
      }

      const target = e.target as HTMLElement | null;
      const magElem = target?.closest?.(".magnetic-btn, .magnetic-badge");
      isHovered = !!magElem;
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    const render = () => {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${isHovered ? 1.5 : 1})`;
        if (isHovered) {
          cursorRef.current.classList.add("border-orange-400", "bg-orange-500/25", "shadow-[0_0_15px_rgba(249,115,22,0.4)]");
          cursorRef.current.classList.remove("border-orange-500/60", "bg-orange-500/15");
        } else {
          cursorRef.current.classList.remove("border-orange-400", "bg-orange-500/25", "shadow-[0_0_15px_rgba(249,115,22,0.4)]");
          cursorRef.current.classList.add("border-orange-500/60", "bg-orange-500/15");
        }
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border transition-all duration-200 opacity-0 hidden lg:block"
    />
  );
}
