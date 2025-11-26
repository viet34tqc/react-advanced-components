import { cn } from '@/lib/utils';
import { ReactNode, useRef, useState } from 'react';

type SliderProps = {
  stops: ReactNode[];
};
const clamp = (number: number, boundOne: number, boundTwo: number) => {
  if (!boundTwo) {
    return Math.max(number, boundOne) === boundOne ? number : boundOne;
  } else if (Math.min(number, boundOne) === number) {
    return boundOne;
  } else if (Math.max(number, boundTwo) === number) {
    return boundTwo;
  }
  return number;
};

const Slider = ({ stops }: SliderProps) => {
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [position, setPosition] = useState<number | null>(0);
  const [isDragging, setIsDragging] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);

  const updateSliderPosition = (clientX: number, shouldClamp = false) => {
    if (!container.current) return;

    const { left: containerLeft, width: containerWidth } =
      container.current.getBoundingClientRect();

    const segmentWidth = containerWidth / (stops.length - 1);
    const index = Math.round((clientX - containerLeft) / segmentWidth);
    // We only need clamp on pointer event because we can slide the thumb out of the container
    const clampedIndex = shouldClamp
      ? clamp(index, 0, stops.length - 1)
      : index;

    setPosition(clampedIndex * segmentWidth);
    setCurrentStopIndex(clampedIndex);
  };

  return (
    <div
      ref={container}
      className="relative z-0 w-full flex justify-center items-center touch-none max-w-3xl mx-auto mt-5"
    >
      <div
        className="w-full py-3 flex gap-1"
        onClick={e => updateSliderPosition(e.clientX)}
      >
        {Array.from({ length: stops.length - 1 }).map((_, i) => (
          <div
            key={i}
            className={cn('flex-1 h-2 sm:h-3 bg-[#efefef] w-2', {
              'rounded-l-md': i === 0, // first segment
              'rounded-r-md': i === stops.length - 2, // last segment
            })}
          />
        ))}
      </div>

      {/* thumb */}
      {position != null && (
        <div
          tabIndex={0}
          className={cn(
            'z-10 -translate-y-1/2 absolute left-0 top-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-medium hover:border-[#CFCFCF] border-2 shadow-[0px 4px 12px 0px #AB87FF1A] bg-white select-none cursor-ew-resize outline-offset-8 transition-colors',
            {
              'border-[#AB87FF] hover:border-[#AB87FF]': isDragging,
            }
          )}
          style={{ left: position - 14 }}
          onFocus={() => setIsDragging(true)}
          onBlur={() => setIsDragging(false)}
          onPointerDown={e => {
            const { ownerDocument } = e.currentTarget;
            setIsDragging(true);

            const onPointerMove = (e: PointerEvent) =>
              updateSliderPosition(e.clientX, true);

            const onPointerUp = () => {
              setIsDragging(false);
              ownerDocument.removeEventListener('pointermove', onPointerMove);
            };

            ownerDocument.addEventListener('pointermove', onPointerMove);
            ownerDocument.addEventListener('pointerup', onPointerUp);
          }}
        >
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 select-none">
            {stops[currentStopIndex]}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
