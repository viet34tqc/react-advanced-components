import { useRef, useEffect } from "react";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // By using savedCallback, we don't need to add it to the dependency array
  // Set up the interval and call the callback immediately.
  useEffect(() => {
    if (delay === null) {
      return;
    }

    // Call the callback immediately.
    savedCallback.current?.();

    function tick() {
      savedCallback.current?.();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
