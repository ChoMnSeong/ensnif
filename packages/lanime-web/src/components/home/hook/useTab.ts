import { useState } from "react";

const useTab = (initialTab: number, allTabs: React.ReactNode[]) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab);

  return [currentIndex, allTabs[currentIndex], setCurrentIndex] as [
    number,
    React.ReactNode,
    typeof setCurrentIndex,
  ];
};

export default useTab;
