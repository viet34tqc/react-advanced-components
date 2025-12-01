'use client';

import { useEffect, useState } from 'react';
import { WHEEL_CONFIGS } from './constants';
import { calculateSlicePath, deg2rad, getSlicesWithAngle } from './utils';

const slices = getSlicesWithAngle();
const cx = WHEEL_CONFIGS.width / 2;
const cy = WHEEL_CONFIGS.height / 2;
const SvgWheel = () => {
  const [active, setActive] = useState<number | null>(null);

  // Calculate the rotation angle for the wheel
  const wheelRotation = active !== null ? -slices[active].midAngle - 90 : 0;

  // Keyboard: ESC resets, UP/DOWN change active slice
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActive(null);
      }
      if (e.key === 'ArrowUp') {
        setActive(prev => {
          if (prev === null) return 0;
          return (prev - 1 + slices.length) % slices.length;
        });
      }
      if (e.key === 'ArrowDown') {
        setActive(prev => {
          if (prev === null) return 0;
          return (prev + 1) % slices.length;
        });
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="size-[800px] border grid place-items-center">
      <svg
        width={WHEEL_CONFIGS.width}
        height={WHEEL_CONFIGS.height}
        viewBox={`0 0 ${WHEEL_CONFIGS.width} ${WHEEL_CONFIGS.height}`}
      >
        <g
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: 'transform 600ms cubic-bezier(.22,.9,.31,1)',
            transformOrigin: `${cx}px ${cy}px`,
          }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={WHEEL_CONFIGS.radius}
            className="fill-slate-700 stroke-slate-900"
          />
          {
            /* Display slices */
            slices.map((slice, idx) => {
              const d = calculateSlicePath(
                WHEEL_CONFIGS.radius,
                WHEEL_CONFIGS.innerRadius,
                slice.startAngle,
                slice.endAngle
              );

              // The label is in the middle of outerRadius and innerRadius
              const labelRadius =
                (WHEEL_CONFIGS.radius + WHEEL_CONFIGS.innerRadius) / 2;
              const labelX =
                cx + Math.cos(deg2rad(slice.midAngle - 90)) * labelRadius;
              const labelY =
                cy + Math.sin(deg2rad(slice.midAngle - 90)) * labelRadius;
              return (
                <g key={slice.label}>
                  <path
                    key={slice.id}
                    d={d}
                    className={slice.classNames}
                    onClick={() => setActive(idx === active ? null : idx)}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill="#cbd5e1"
                    // Rotate the text in the opposite direction of the wheel (-wheelRotation), keeping all labels horizontal and readable regardless of wheel rotation.
                    style={{
                      transform: `rotate(${-wheelRotation}deg)`,
                      transition: 'transform 600ms cubic-bezier(.22,.9,.31,1)',
                      transformOrigin: `${labelX}px ${labelY}px`,
                    }}
                  >
                    {slice.label}
                  </text>
                </g>
              );
            })
          }
          <circle
            cx={WHEEL_CONFIGS.width / 2}
            cy={WHEEL_CONFIGS.height / 2}
            r={WHEEL_CONFIGS.innerRadius}
            className="fill-slate-700 stroke-slate-900"
          />
        </g>
      </svg>
    </div>
  );
};

export default SvgWheel;
