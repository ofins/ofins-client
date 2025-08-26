export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Toggles full-screen mode on the document.
 */
export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen().catch((err) => {
      console.error(
        `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
      );
    });
  }
};

/**
 * Ensures a function executes at most once every `wait` interval, no matter how many times it's triggered.
 * @param func Function to execute
 * @param wait Time duration
 * @returns
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
}

/**
 * Delays a function execution until after `wait` ms of inactivity.
 * Timer will reset on each call, where only the last one counts.
 * @param func Function to execute
 * @param wait Time duration
 * @returns
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
