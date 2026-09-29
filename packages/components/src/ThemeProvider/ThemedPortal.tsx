import { useContext, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { ThemeContext } from '../context/Theme/themeContext';

// Only the text color: overlays paint their own surfaces, and a background here would show as a strip at the end of <body>.
const themedPortalCss = css`
  color: ${semantic.color.text.primary};
`;

/**
 * Internal. Props that theme a portal root: the nearest ThemeProvider's
 * `data-theme`, so the token cascade restarts there with the right values.
 * Outside any provider no theme is set and the root follows `:root`.
 *
 * Spread onto a headless library's own portal element (e.g. Base UI's
 * `Popover.Portal`, which renders a `<div>` into `<body>`), so the overlay
 * gets themed without an extra wrapper or a second portal.
 */
export function useThemedPortalProps() {
  const themeContext = useContext(ThemeContext);

  return { 'data-theme': themeContext?.theme, className: themedPortalCss };
}

export type ThemedPortalProps = {
  children: ReactNode;
  /** Where to mount. Defaults to `document.body`. */
  container?: Element | DocumentFragment;
};

function subscribeToNothing() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/**
 * Internal. Portals content out of the DOM tree (to escape clipping and
 * stacking) while keeping the theme of the React tree it came from, for
 * overlays not built on a headless library's portal.
 *
 * Every overlay (Dialog, Popover, Tooltip, Menu…) must be themed through
 * this or `useThemedPortalProps`.
 */
export function ThemedPortal({ children, container }: ThemedPortalProps) {
  const themedPortalProps = useThemedPortalProps();
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return createPortal(<div {...themedPortalProps}>{children}</div>, container ?? document.body);
}
