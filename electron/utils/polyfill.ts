import { BrowserWindow, Rectangle } from 'electron';

const DEFAULT_DURATION = 100;

// ease out quint
const DEFAULT_EASING = (
  index: number,
  current: number,
  diff: number,
  duration: number,
) => (index === duration
  ? current + diff
  : diff * (1 - Math.pow(1 - (index / duration), 5)) + current
);

type BrowserWindowAnimateOptions = {
  duration?: number;
  easing?: typeof DEFAULT_EASING;
};

const originSetBounds = BrowserWindow.prototype.setBounds;
BrowserWindow.prototype.setBounds = function setBounds(
  this: BrowserWindow,
  targetBounds: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  animate?: boolean | BrowserWindowAnimateOptions,
) {
  if (!animate) {
    originSetBounds.apply(this, [targetBounds]);
    return;
  }
  const currentBounds = this.getBounds();

  const { duration = DEFAULT_DURATION, easing = DEFAULT_EASING } = typeof animate === 'object' ? animate : {};

  const updateBounds = (currentFrame: number) => {
    const eased = Object.keys(targetBounds).reduce((obj, k) => {
      const key = k as keyof Rectangle;
      const diff = obj[key] - currentBounds[key];
      if (!diff) {
        return obj;
      }
      return {
        ...obj,
        [key]: Math.round(easing(
          currentFrame,
          currentBounds[key],
          diff,
          duration,
        )),
      };
    }, targetBounds);
    originSetBounds.apply(this, [eased]);
    if (currentFrame < duration) setImmediate(updateBounds, currentFrame + 1);
  };
  setImmediate(updateBounds, 0);
};

declare module 'electron' {
  interface BrowserWindow {
    setBounds(bounds: Rectangle, animate?: boolean | BrowserWindowAnimateOptions): void;
  }
}
