import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '../hooks';
import { ThemeProvider } from './ThemeProvider';

type ChangeListener = (event: MediaQueryListEvent) => void;

let systemPrefersDark = false;
let listeners: ChangeListener[] = [];

function setSystemPreference(dark: boolean) {
  systemPrefersDark = dark;
  act(() => {
    listeners.forEach((listener) => listener({ matches: dark } as MediaQueryListEvent));
  });
}

beforeEach(() => {
  systemPrefersDark = false;
  listeners = [];
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return systemPrefersDark;
      },
      media: query,
      addEventListener: (_: string, listener: ChangeListener) => listeners.push(listener),
      removeEventListener: (_: string, listener: ChangeListener) => {
        listeners = listeners.filter((current) => current !== listener);
      },
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function ThemeConsumer() {
  const { theme, setTheme } = useTheme();

  return (
    <div data-testid="consumer">
      <p>Theme: {theme}</p>
      <button type="button" onClick={() => setTheme('dark')}>
        Use dark
      </button>
      <button type="button" onClick={() => setTheme('light')}>
        Use light
      </button>
    </div>
  );
}

function themeRoot() {
  // The provider's wrapper is the consumer's parent element.
  return screen.getByTestId('consumer').parentElement as HTMLElement;
}

describe('ThemeProvider', () => {
  it('follows the system preference on first render when no mode is given', () => {
    systemPrefersDark = true;

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
  });

  it('leaves data-theme unset while following the system', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(themeRoot()).not.toHaveAttribute('data-theme');
  });

  it('tracks system preference changes while no theme has been chosen', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    setSystemPreference(true);

    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
  });

  it('uses initialMode over the system preference', () => {
    systemPrefersDark = true;

    render(
      <ThemeProvider initialMode="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme: light')).toBeInTheDocument();
    expect(themeRoot()).toHaveAttribute('data-theme', 'light');
  });

  it('keeps initialMode when the system preference changes', () => {
    render(
      <ThemeProvider initialMode="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    setSystemPreference(true);

    expect(screen.getByText('Theme: light')).toBeInTheDocument();
  });

  it('applies a theme chosen with setTheme', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Use dark' }));

    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
    expect(themeRoot()).toHaveAttribute('data-theme', 'dark');
  });

  it('keeps a theme chosen with setTheme when the system preference changes', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Use light' }));
    setSystemPreference(true);

    expect(screen.getByText('Theme: light')).toBeInTheDocument();
    expect(themeRoot()).toHaveAttribute('data-theme', 'light');
  });

  it('stops listening to the system preference on unmount', () => {
    const { unmount } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    unmount();

    expect(listeners).toHaveLength(0);
  });

  it('falls back to light when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme: light')).toBeInTheDocument();
  });

  it("reports the parent's theme when nested without a theme of its own", () => {
    systemPrefersDark = false;

    render(
      <ThemeProvider initialMode="dark">
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
  });

  it('reports its own theme once a nested provider chooses one', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider initialMode="dark">
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Use light' }));
    expect(screen.getByText('Theme: light')).toBeInTheDocument();
  });
});
