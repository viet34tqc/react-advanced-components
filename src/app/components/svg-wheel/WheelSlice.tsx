'use client';

import { Star } from 'lucide-react';
import { WHEEL_CONFIGS } from './constants';
import { calculateSlicePath, deg2rad } from './utils';

const cx = WHEEL_CONFIGS.width / 2;
const cy = WHEEL_CONFIGS.height / 2;

interface WheelSliceProps {
  slice: {
    id: string;
    label: string;
    startAngle: number;
    endAngle: number;
    midAngle: number;
    classNames: string;
    color: string;
  };
  index: number;
  active: number | null;
  accumulatedRotation: number;
  onSliceClick: (index: number) => void;
}

export const WheelSlice = ({
  slice,
  index,
  active,
  accumulatedRotation,
  onSliceClick,
}: WheelSliceProps) => {
  const d = calculateSlicePath(
    WHEEL_CONFIGS.radius,
    WHEEL_CONFIGS.innerRadius,
    slice.startAngle,
    slice.endAngle,
    index === active
  );

  // The label is in the middle of outerRadius and innerRadius
  const labelRadius = (WHEEL_CONFIGS.radius + WHEEL_CONFIGS.innerRadius) / 2;
  const labelX = cx + Math.cos(deg2rad(slice.midAngle - 90)) * labelRadius;
  const labelY = cy + Math.sin(deg2rad(slice.midAngle - 90)) * labelRadius;

  return (
    <g>
      <path
        d={d}
        className={slice.classNames}
        fill={`url(#gradient-${slice.id})`}
        style={{
          transition: 'd 400ms cubic-bezier(.22,.9,.31,1)',
          opacity: active === null || index === active ? 1 : 0.3,
        }}
        onClick={() => onSliceClick(index)}
      />
      {/* foreignObject allows to write html inside svg */}
      <foreignObject
        x={labelX - 60}
        y={labelY - 20}
        width="120"
        height="40"
        transform={`rotate(${-accumulatedRotation} ${labelX} ${labelY})`}
        style={{
          transition: 'transform 600ms cubic-bezier(.22,.9,.31,1)',
        }}
      >
        <div className="flex items-center justify-center gap-2 text-slate-300 text-xs pointer-events-none">
          <Star />
          <span className="font-medium">{slice.label}</span>
        </div>
      </foreignObject>
    </g>
  );
};
