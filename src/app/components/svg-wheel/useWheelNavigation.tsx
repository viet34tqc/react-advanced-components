import { useCallback, useEffect, useState } from 'react';

interface UseWheelNavigationProps {
  slicesLength: number;
  targetRotation: number;
  active: number | null;
  setActive: (value: number | null) => void;
}

export const useWheelNavigation = ({
  slicesLength,
  targetRotation,
  active,
  setActive,
}: UseWheelNavigationProps) => {
  const [accumulatedRotation, setAccumulatedRotation] = useState(0);

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

  const navigateToNextSlice = useCallback(() => {
    setActive(active === null ? 0 : (active - 1 + slicesLength) % slicesLength);
  }, [active, slicesLength, setActive]);

  const navigateToPrevSlice = useCallback(() => {
    setActive(active === null ? 0 : (active + 1) % slicesLength);
  }, [active, slicesLength, setActive]);

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
  }, [navigateToNextSlice, navigateToPrevSlice, setActive]);

  return {
    accumulatedRotation,
    navigateToNextSlice,
    navigateToPrevSlice,
  };
};
