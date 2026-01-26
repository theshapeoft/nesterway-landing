"use client";

import { useEffect, useState } from "react";

interface Shape {
  id: number;
  type: 'circle' | 'triangle' | 'square';
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  duration: number;
}

export function AnimatedBackground() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    // Generate random shapes
    const colors = ['#0E7490', '#F97316', '#F5F0E8'];
    const newShapes: Shape[] = [];

    for (let i = 0; i < 8; i++) {
      newShapes.push({
        id: i,
        type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as Shape['type'],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 50 + Math.random() * 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.2,
        duration: 15 + Math.random() * 20
      });
    }

    setShapes(newShapes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
        </defs>

        {shapes.map((shape) => {
          const style = {
            opacity: shape.opacity,
            animation: `float ${shape.duration}s ease-in-out infinite`
          };

          if (shape.type === 'circle') {
            return (
              <circle
                key={shape.id}
                cx={`${shape.x}%`}
                cy={`${shape.y}%`}
                r={shape.size}
                fill={shape.color}
                filter="url(#blur)"
                style={style}
              />
            );
          }

          if (shape.type === 'triangle') {
            const points = [
              [shape.x, shape.y - shape.size],
              [shape.x - shape.size * 0.866, shape.y + shape.size * 0.5],
              [shape.x + shape.size * 0.866, shape.y + shape.size * 0.5]
            ].map(p => `${p[0]}%,${p[1]}%`).join(' ');

            return (
              <polygon
                key={shape.id}
                points={points}
                fill={shape.color}
                filter="url(#blur)"
                style={style}
              />
            );
          }

          // Square
          return (
            <rect
              key={shape.id}
              x={`${shape.x}%`}
              y={`${shape.y}%`}
              width={shape.size}
              height={shape.size}
              fill={shape.color}
              filter="url(#blur)"
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}
