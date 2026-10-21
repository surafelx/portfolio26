/**
 * Lets anything that makes sound tell the rest of the site, so the booth can always show a Stop button,
 * and lets the booth (or the Escape key) ask every sound to stop. Plain window events, no shared state.
 */
const PLAYING = "site-sound";
const STOP = "site-sound-stop";

export function announceSound(playing: boolean) {
  window.dispatchEvent(new CustomEvent(PLAYING, { detail: playing }));
}

export function stopAllSound() {
  window.dispatchEvent(new Event(STOP));
}

export function onSoundChange(fn: (playing: boolean) => void) {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(PLAYING, h);
  return () => window.removeEventListener(PLAYING, h);
}

export function onStopRequest(fn: () => void) {
  window.addEventListener(STOP, fn);
  return () => window.removeEventListener(STOP, fn);
}
