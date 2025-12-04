'use client';

import { useState } from 'react';
import { DetailPanel } from './DetailPanel';
import { useWheelNavigation } from './useWheelNavigation';
import { getSlicesWithAngle } from './utils';
import { WheelSvg } from './WheelSvg';

const slices = getSlicesWithAngle();

const SvgWheel = () => {
  const [active, setActive] = useState<number | null>(null);

  // Calculate the rotation angle for the wheel
  const targetRotation = active !== null ? -slices[active].midAngle - 90 : 0;

  const { accumulatedRotation, navigateToNextSlice, navigateToPrevSlice } =
    useWheelNavigation({
      slicesLength: slices.length,
      targetRotation,
      active,
      setActive,
    });

  const handleSliceClick = (index: number) => {
    setActive(index === active ? null : index);
  };

  return (
    <div className="size-[800px] overflow-hidden bg-slate-950 flex gap-10 items-center">
      <DetailPanel
        active={active}
        sliceLabel={active !== null ? slices[active].label : ''}
        onClose={() => setActive(null)}
        onNavigateNext={navigateToNextSlice}
        onNavigatePrev={navigateToPrevSlice}
      />

      {/* Wheel Container */}
      <div className="flex-1 flex items-center justify-center">
        <WheelSvg
          slices={slices}
          active={active}
          accumulatedRotation={accumulatedRotation}
          onSliceClick={handleSliceClick}
        />
      </div>
    </div>
  );
};

export default SvgWheel;
