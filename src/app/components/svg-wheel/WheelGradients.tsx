'use client';

import { deg2rad } from './utils';

interface WheelGradientsProps {
  slices: Array<{
    id: string;
    midAngle: number;
    color: string;
  }>;
}

export const WheelGradients = ({ slices }: WheelGradientsProps) => {
  return (
    <defs>
      {slices.map(slice => {
        // Calculate gradient direction based on slice position
        // Gradient goes from center of the wheel outward along the slice's mid angle
        const angle = deg2rad(slice.midAngle - 90);
        // 50 means 50%
        const x1 = 50 - Math.cos(angle) * 30; // Start closer to center
        const y1 = 50 - Math.sin(angle) * 30;
        const x2 = 50 + Math.cos(angle) * 50; // End at outer edge
        const y2 = 50 + Math.sin(angle) * 50;

        return (
          <linearGradient
            key={`gradient-${slice.id}`}
            id={`gradient-${slice.id}`}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
          >
            <stop offset="0%" stopColor={slice.color} stopOpacity="1" />
            <stop offset="100%" stopColor={slice.color} stopOpacity="0.5" />
          </linearGradient>
        );
      })}
    </defs>
  );
};
