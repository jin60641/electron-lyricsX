import { BrowserWindow, Rectangle } from 'electron';

const DEFAULT_DURATION = 100;

/* Penner easing function
See: http://robertpenner.com/easing/ */
const DEFAULT_EASING = (
  index: number,
  current: number,
  diff: number,
  duration: number,
) => (index === duration
  ? current + diff
  : diff * (-(2 ** ((-10 * index) / duration)) + 1) + current
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
      const diff = targetBounds[key] - currentBounds[key];
      return {
        ...obj,
        [key]: diff ? Math.round(easing(
          currentFrame,
          currentBounds[key],
          diff,
          duration,
        )) : targetBounds[key],
      };
    }, {} as Rectangle);
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
