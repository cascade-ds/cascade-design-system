import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { useTheme } from '#/hooks';
import { ThemeProvider } from './ThemeProvider';
import { ThemedPortal } from './ThemedPortal';

afterEach(() => {
  cleanup();
});

function portalRoot(text: string) {
  return screen.getByText(text).parentElement as HTMLElement;
}

describe('ThemedPortal', () => {
  it('renders into document.body, outside the provider element', () => {
    const { container } = render(
      <ThemeProvider initialMode="dark">
        <ThemedPortal>
          <p>Overlay</p>
        </ThemedPortal>
      </ThemeProvider>,
    );

    const root = portalRoot('Overlay');
    expect(root.parentElement).toBe(document.body);
    expect(container).not.toContainElement(root);
  });

  it('keeps a dark subtree dark inside a light page', () => {
    render(
      <ThemeProvider initialMode="light">
        <ThemeProvider initialMode="dark">
          <ThemedPortal>
            <p>Overlay</p>
          </ThemedPortal>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(portalRoot('Overlay')).toHaveAttribute('data-theme', 'dark');
  });

  it("uses the parent's theme inside a nested provider that follows the system", () => {
    render(
      <ThemeProvider initialMode="dark">
        <ThemeProvider>
          <ThemedPortal>
            <p>Overlay</p>
          </ThemedPortal>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(portalRoot('Overlay')).toHaveAttribute('data-theme', 'dark');
  });

  it('follows theme changes', async () => {
    const user = userEvent.setup();

    function SwitchToDark() {
      const { setTheme } = useTheme();
      return (
        <button type="button" onClick={() => setTheme('dark')}>
          Use dark
        </button>
      );
    }

    render(
      <ThemeProvider initialMode="light">
        <SwitchToDark />
        <ThemedPortal>
          <p>Overlay</p>
        </ThemedPortal>
      </ThemeProvider>,
    );

    expect(portalRoot('Overlay')).toHaveAttribute('data-theme', 'light');

    await user.click(screen.getByRole('button', { name: 'Use dark' }));
    expect(portalRoot('Overlay')).toHaveAttribute('data-theme', 'dark');
  });

  it('sets no theme outside any provider', () => {
    render(
      <ThemedPortal>
        <p>Overlay</p>
      </ThemedPortal>,
    );

    expect(portalRoot('Overlay')).not.toHaveAttribute('data-theme');
  });

  it('mounts into a custom container', () => {
    const target = document.createElement('div');
    document.body.append(target);

    render(
      <ThemedPortal container={target}>
        <p>Overlay</p>
      </ThemedPortal>,
    );

    expect(portalRoot('Overlay').parentElement).toBe(target);
    target.remove();
  });
});
