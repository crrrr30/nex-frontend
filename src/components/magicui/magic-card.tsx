"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientBlobSize?: number;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = "",
  gradientBlobSize = 256,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(className, "relative overflow-hidden")}
    >
      {/* Gradient blob */}
      <div
        className={cn(
          hovered ? "opacity-10" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-2xl"
          style={{
            width: gradientBlobSize,
            height: gradientBlobSize,
          }}
          animate={{
            translateX: position.x - gradientBlobSize / 2,
            translateY: position.y - gradientBlobSize / 2,
          }}
        />
      </div>
      {/* Card content */}
      <div className={`relative z-10 h-full`}>{children}</div>{" "}
    </div>
  );
};
