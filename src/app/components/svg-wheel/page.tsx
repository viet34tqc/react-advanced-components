'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Router, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WHEEL_CONFIGS } from './constants';
import { calculateSlicePath, deg2rad, getSlicesWithAngle } from './utils';

const slices = getSlicesWithAngle();
const cx = WHEEL_CONFIGS.width / 2;
const cy = WHEEL_CONFIGS.height / 2;
const SvgWheel = () => {
  const [active, setActive] = useState<number | null>(null);
  const [accumulatedRotation, setAccumulatedRotation] = useState(0);

  // Calculate the rotation angle for the wheel
  const targetRotation = active !== null ? -slices[active].midAngle - 90 : 0;

  // Normalize rotation to take shortest path
  useEffect(() => {
    if (active !== null) {
      let diff = targetRotation - accumulatedRotation;
      // Normalize to -180 to 180 range (shortest path)
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      setAccumulatedRotation(accumulatedRotation + diff);
    } else {
      setAccumulatedRotation(0);
    }
  }, [accumulatedRotation, active, targetRotation]);

  const navigateToNextSlice = () => {
    setActive(prev => {
      if (prev === null) return 0;
      return (prev - 1 + slices.length) % slices.length;
    });
  };

  const navigateToPrevSlice = () => {
    setActive(prev => {
      if (prev === null) return 0;
      return (prev + 1) % slices.length;
    });
  };

  // Keyboard: ESC resets, UP/DOWN change active slice
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActive(null);
      }
      if (e.key === 'ArrowUp') {
        navigateToNextSlice();
      }
      if (e.key === 'ArrowDown') {
        navigateToPrevSlice();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="size-[800px] overflow-hidden bg-slate-950 flex gap-10  items-center">
      <div
        className={cn('h-full p-6 transition-all  duration-700 flex-shrink-0', {
          'w-[400px] opacity-100': active !== null,
          'w-0 opacity-0 p-0': active === null,
        })}
      >
        {active !== null && (
          // The content in this component is just for demo
          <div className="h-full flex flex-col w-[360px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100">
                {slices[active].label}
              </h2>
              <button
                onClick={() => setActive(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Router />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-1">
                    Router / 11:22:33:44:06:01
                  </div>
                  <div className="flex items-center gap-2 text-red-400 font-medium">
                    <span className="text-lg">×</span>
                    <span>Sehr instabil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex gap-2">
                <Button variant="outline" onClick={navigateToNextSlice}>
                  <ArrowUp />
                </Button>
                <Button variant="outline" onClick={navigateToPrevSlice}>
                  <ArrowDown />
                </Button>
              </div>
              <Button>ESC</Button>
            </div>
          </div>
        )}
      </div>

      {/* Wheel Container */}
      <div className="flex-1 flex items-center justify-center">
        <svg
          width={WHEEL_CONFIGS.width}
          height={WHEEL_CONFIGS.height}
          viewBox={`0 0 ${WHEEL_CONFIGS.width} ${WHEEL_CONFIGS.height}`}
        >
          <g
            transform={`rotate(${accumulatedRotation} ${cx} ${cy})`}
            style={{
              transition: 'transform 800ms cubic-bezier(.22,.9,.31,1)',
            }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={WHEEL_CONFIGS.radius + 20}
              className="fill-slate-900 stroke-slate-900 stroke stroke-1"
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
                    {/* foreignObject allows to write html inside svg */}
                    <foreignObject
                      x={labelX - 60}
                      y={labelY - 20}
                      width="120"
                      height="40"
                      transform={`rotate(${-accumulatedRotation} ${labelX} ${labelY})`}
                      style={{
                        transition:
                          'transform 600ms cubic-bezier(.22,.9,.31,1)',
                      }}
                    >
                      <div className="flex items-center justify-center gap-2 text-slate-300 text-xs pointer-events-none">
                        <Star />
                        <span className="font-medium">{slice.label}</span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })
            }
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SvgWheel;
