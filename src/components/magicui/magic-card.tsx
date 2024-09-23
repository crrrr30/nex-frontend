"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { useState, useRef } from "react";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = "",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  console.log("hovered", hovered);
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
          hovered ? "opacity-20" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
        <div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-2xl opacity-60 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${position.x - 128}px, ${
              position.y - 128
            }px)`,
          }}
        />
      </div>

      {/* Card content */}
      <div className={`relative z-10 h-full`}>{children}</div>
    </div>
  );
};
