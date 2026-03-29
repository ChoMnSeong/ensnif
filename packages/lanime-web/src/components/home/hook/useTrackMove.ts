import { useState, useEffect } from "react";

export const useAnimeCardTrack = (length: number) => {
  const [state, setState] = useState(0);
  const maxIndex = Math.ceil(length);

  useEffect(() => {
    setState(0);
  }, [maxIndex]);

  const onNext = () => {
    setState((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const onPrev = () => {
    setState((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return {
    state,
    onNext,
    onPrev,
    hasPrev: state > 0,
    hasNext: state < maxIndex,
  };
};
