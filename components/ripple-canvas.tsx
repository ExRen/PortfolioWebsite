"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  op: number;
  hue: string;
}

export function RippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || !isLargeScreen || isReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let ripples: Ripple[] = [];
    let rafId: number | null = null;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.2;
        rp.op *= 0.96;
        if (rp.op <= 0.01 || rp.r >= rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rp.hue}, ${rp.op.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (ripples.length > 0) {
        rafId = requestAnimationFrame(draw);
      } else {
        rafId = null;
      }
    };

    const startLoopIfNeeded = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (Math.random() > 0.85) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 2,
          maxR: 120,
          op: 0.35,
          hue: Math.random() > 0.5 ? "249, 115, 22" : "56, 189, 248",
        });
        startLoopIfNeeded();
      }
    };

    const onClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: 220,
        op: 0.65,
        hue: "249, 115, 22",
      });
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 2,
        maxR: 160,
        op: 0.45,
        hue: "56, 189, 248",
      });
      startLoopIfNeeded();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full hidden lg:block"
    />
  );
}
