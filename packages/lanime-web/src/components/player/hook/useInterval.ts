import { useCallback, useEffect, useRef } from "react";

const useInterval = (): [
  (callback: () => void, delay: number, initialLoad?: boolean) => void,
  () => void,
] => {
  const intervalRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const set = useCallback(
    (callback: () => void, delay: number, initialLoad = false) => {
      if (initialLoad) {
        callback();
      }

      clear();
      intervalRef.current = window.setInterval(callback, delay);
    },
    [clear],
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return [set, clear];
};

export default useInterval;
