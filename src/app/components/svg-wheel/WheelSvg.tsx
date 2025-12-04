'use client';

import { OUTER_CIRCLE_OFFSET, WHEEL_CONFIGS } from './constants';
import { WheelGradients } from './WheelGradients';
import { WheelSlice } from './WheelSlice';

const cx = WHEEL_CONFIGS.width / 2;
const cy = WHEEL_CONFIGS.height / 2;

interface WheelSvgProps {
  slices: Array<{
    id: string;
    label: string;
    startAngle: number;
    endAngle: number;
    midAngle: number;
    classNames: string;
    color: string;
  }>;
  active: number | null;
  accumulatedRotation: number;
  onSliceClick: (index: number) => void;
}

export const WheelSvg = ({
  slices,
  active,
  accumulatedRotation,
  onSliceClick,
}: WheelSvgProps) => {
  return (
    <svg
      width={WHEEL_CONFIGS.width}
      height={WHEEL_CONFIGS.height}
      viewBox={`0 0 ${WHEEL_CONFIGS.width} ${WHEEL_CONFIGS.height}`}
    >
      <WheelGradients slices={slices} />
      <g
        transform={`rotate(${accumulatedRotation} ${cx} ${cy})`}
        style={{
          transition: 'transform 800ms cubic-bezier(.22,.9,.31,1)',
        }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={WHEEL_CONFIGS.radius + OUTER_CIRCLE_OFFSET}
          className="fill-slate-900 stroke-slate-900 stroke stroke-1"
        />
        {/* Display slices */}
        {slices.map((slice, idx) => (
          <WheelSlice
            key={slice.id}
            slice={slice}
            index={idx}
            active={active}
            accumulatedRotation={accumulatedRotation}
            onSliceClick={onSliceClick}
          />
        ))}
      </g>
    </svg>
  );
};
