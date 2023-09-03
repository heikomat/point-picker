const baseFontSize = 16;
export const scale = parseInt(getComputedStyle(document.body).fontSize) / baseFontSize;

export const pxToRem = (sizeInPx: number): number => {
  return sizeInPx / baseFontSize
}
