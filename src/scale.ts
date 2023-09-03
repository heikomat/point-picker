import { useEffect, useState } from "react";

const baseFontSize = 16;

const getScale = () => {
  return parseInt(getComputedStyle(document.body).fontSize) / baseFontSize;
}

export const useScale = () => {
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const updateWindowWidth = () => {
      requestAnimationFrame(() => {
        setScale(getScale());
      });
    };
    window.addEventListener('resize', updateWindowWidth);
    return (): void => {
      window.removeEventListener('resize', updateWindowWidth);
    }
  }, []);

  return scale;
}

export const pxToRem = (sizeInPx: number): number => {
  return sizeInPx / baseFontSize
}
