"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

export function TiltWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
    }
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation based on cursor position
    const rY = ((mouseX / width) - 0.5) * 15; // Max 7.5 deg rotation
    const rX = ((mouseY / height) - 0.5) * -15;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX, 
        rotateY, 
        scale: rotateX || rotateY ? 1.02 : 1 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}