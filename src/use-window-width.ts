import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // TODO: make number-groups only as large as necessary
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWindowWidth);
    return (): void => {
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  return windowWidth;
}
