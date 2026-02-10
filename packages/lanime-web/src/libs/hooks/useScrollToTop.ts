import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window) window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
