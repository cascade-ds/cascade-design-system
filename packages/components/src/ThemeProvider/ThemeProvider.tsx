import { useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { ThemeContext, type ThemeMode } from '../context/Theme/themeContext';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

// Paints the theme's surface so a nested provider's subtree actually looks
// like its theme, not just its tokens.
const themeRootCss = css`
  background-color: ${semantic.color.background.default};
  color: ${semantic.color.text.primary};
`;

export type ThemeProviderProps = {
  children: ReactNode;
  /**
   * Forces a theme from the first render. Omit it to follow the operating
   * system preference until `setTheme` is called.
   */
  initialMode?: ThemeMode;
};

function supportsMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function subscribeToSystemTheme(onChange: () => void) {
  if (!supportsMatchMedia()) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getSystemTheme(): ThemeMode {
  if (!supportsMatchMedia()) {
    return 'light';
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
}

// The server can't read the preference; React re-reads it on the client
// after hydration.
function getServerSystemTheme(): ThemeMode {
  return 'light';
}

export function ThemeProvider({ children, initialMode }: ThemeProviderProps) {
  const parentContext = useContext(ThemeContext);
  // An explicit choice (initialMode or setTheme) always wins over the system
  // preference, so an OS change never overrides what the user picked.
  const [explicitTheme, setExplicitTheme] = useState<ThemeMode | undefined>(initialMode);
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );

  // Without an explicit theme, a nested provider leaves `data-theme` unset and
  // so inherits its parent's tokens; report the parent's theme to match what
  // renders (portals read it to theme themselves).
  const theme = explicitTheme ?? parentContext?.theme ?? systemTheme;
  const contextValue = useMemo(() => ({ theme, setTheme: setExplicitTheme }), [theme]);

  // While following the system, leave `data-theme` unset so the
  // `prefers-color-scheme` media query styles the page with no flash.
  return (
    <ThemeContext.Provider value={contextValue}>
      <div data-theme={explicitTheme} className={themeRootCss}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
