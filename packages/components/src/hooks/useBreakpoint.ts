import { useCallback, useSyncExternalStore } from 'react';
import { media } from '@cascade-ds/styles/media';

/** A breakpoint name from `@cascade-ds/styles/media`: `'sm' | 'md' | 'lg' | 'xl' | '2xl'`. */
export type BreakpointName = keyof typeof media;

export type UseBreakpointOptions = {
  /**
   * The value to render on the server and during hydration, for SSR apps
   * that guess the viewport per request (Client Hints such as
   * `Sec-CH-Viewport-Width`, a cookie holding the last width, the
   * User-Agent). The hook corrects it to the measured value right after
   * hydration, so a right guess means no visible change. Omit it to get
   * `undefined` ("not measured yet") instead.
   */
  serverValue?: boolean;
};

function supportsMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/**
 * Whether the viewport is at least as wide as a breakpoint, for choosing
 * behaviour or between subtrees (a drawer instead of a sidebar, skipping a
 * heavy chart on small screens). It is not a layout tool: layout that CSS
 * can express belongs in CSS, `@media ${media.md} { … }` with `media` from
 * `@cascade-ds/styles/media`.
 *
 * Returns `true` when `media[name]` matches (mobile-first, `min-width`),
 * `false` when it doesn't, and `undefined` while the viewport hasn't been
 * measured: on the server and during hydration, unless `serverValue` is
 * given. It re-renders when the viewport crosses the breakpoint. "Below md"
 * is `useBreakpoint('md') === false`.
 *
 * - **Browser-only apps** (`createRoot`) get the measured value on the first
 *   render, so the first paint is already right.
 * - **SSR apps** paint the server HTML, rendered with `undefined` or
 *   `serverValue`, until hydration finishes, and only then switch to the
 *   measured value. Anything the user sees immediately must therefore come
 *   from CSS; use the hook for behaviour and for subtrees that are too heavy
 *   to render and hide.
 *
 * @example
 * const isDesktop = useBreakpoint('md');
 * if (isDesktop === undefined) return <NavPlaceholder />;
 * return isDesktop ? <Sidebar /> : <Drawer />;
 */
export function useBreakpoint(
  name: BreakpointName,
  options?: UseBreakpointOptions,
): boolean | undefined {
  const query = media[name];
  const serverValue = options?.serverValue;

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!supportsMatchMedia()) {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query],
  );

  // The server can't measure the viewport, so it renders the caller's guess
  // or `undefined`; hydration reuses it so the markup matches, then React
  // re-reads the client snapshot. A browser without `matchMedia` keeps the
  // server value rather than inventing one.
  const getServerSnapshot = () => serverValue;
  const getSnapshot = () =>
    supportsMatchMedia() ? window.matchMedia(query).matches : serverValue;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
