// js/utils.js
// Small helper utilities (debounce, sleep, logging).

/**
 * Debounce a function so it only runs after the user stops
 * calling it for a specified delay. Useful for volume slider,
 * resize events, etc.
 */
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Simple promise-based sleep for async flows.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Tiny logger wrapper that can be disabled centrally.
 */
export function log(...args) {
  if (window.__TV_SOUND_DEBUG__) {
    // eslint-disable-next-line no-console
    console.log('[TV SOUND]', ...args);
  }
}
