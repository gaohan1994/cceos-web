import React from 'react';

export interface CssAnimationReturn {
  stop: () => void;
}

export default function cssAnimation (
  el: any,
  animationName: string | object,
  callback: () => any
): CssAnimationReturn;