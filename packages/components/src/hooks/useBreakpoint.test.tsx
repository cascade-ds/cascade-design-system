import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { media } from '@cascade-ds/styles/media';
import { useBreakpoint, type BreakpointName, type UseBreakpointOptions } from './useBreakpoint';

type ChangeListener = (event: MediaQueryListEvent) => void;

let matchingQueries = new Set<string>();
let listeners = new Map<string, ChangeListener[]>();

function listenersFor(query: string) {
  return listeners.get(query) ?? [];
}

function setViewport(queries: string[]) {
  matchingQueries = new Set(queries);
  act(() => {
    listeners.forEach((queryListeners, query) =>
      queryListeners.forEach((listener) =>
        listener({ matches: matchingQueries.has(query), media: query } as MediaQueryListEvent),
      ),
    );
  });
}

beforeEach(() => {
  matchingQueries = new Set();
  listeners = new Map();
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return matchingQueries.has(query);
      },
      media: query,
      addEventListener: (_: string, listener: ChangeListener) =>
        listeners.set(query, [...listenersFor(query), listener]),
      removeEventListener: (_: string, listener: ChangeListener) =>
        listeners.set(
          query,
          listenersFor(query).filter((current) => current !== listener),
        ),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

function Probe({
  name = 'md',
  options,
  onRender,
}: {
  name?: BreakpointName;
  options?: UseBreakpointOptions;
  onRender?: (value: boolean | undefined) => void;
}) {
  const value = useBreakpoint(name, options);
  onRender?.(value);
  return <p>Matches: {String(value)}</p>;
}

describe('useBreakpoint', () => {
  it('returns true when the breakpoint matches', () => {
    matchingQueries = new Set([media.md]);
    render(<Probe name="md" />);

    expect(screen.getByText('Matches: true')).toBeInTheDocument();
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 48em)');
  });

  it("returns false when the breakpoint doesn't match", () => {
    matchingQueries = new Set([media.sm]);
    render(<Probe name="md" />);

    expect(screen.getByText('Matches: false')).toBeInTheDocument();
  });

  it('ignores serverValue in a browser-only render', () => {
    render(<Probe name="md" options={{ serverValue: true }} />);

    expect(screen.getByText('Matches: false')).toBeInTheDocument();
  });

  it('updates when the viewport crosses the breakpoint', () => {
    render(<Probe name="lg" />);
    expect(screen.getByText('Matches: false')).toBeInTheDocument();

    setViewport([media.sm, media.md, media.lg]);
    expect(screen.getByText('Matches: true')).toBeInTheDocument();

    setViewport([media.sm]);
    expect(screen.getByText('Matches: false')).toBeInTheDocument();
  });

  it('follows a change of breakpoint name', () => {
    matchingQueries = new Set([media.sm]);
    const { rerender } = render(<Probe name="sm" />);
    expect(screen.getByText('Matches: true')).toBeInTheDocument();

    rerender(<Probe name="xl" />);
    expect(screen.getByText('Matches: false')).toBeInTheDocument();
    expect(listenersFor(media.sm)).toHaveLength(0);
    expect(listenersFor(media.xl)).toHaveLength(1);
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = render(<Probe name="md" />);
    expect(listenersFor(media.md)).toHaveLength(1);

    unmount();
    expect(listenersFor(media.md)).toHaveLength(0);
  });

  it('falls back to serverValue when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);

    const { unmount } = render(<Probe name="md" />);
    expect(screen.getByText('Matches: undefined')).toBeInTheDocument();
    unmount();

    render(<Probe name="md" options={{ serverValue: true }} />);
    expect(screen.getByText('Matches: true')).toBeInTheDocument();
  });

  describe('server rendering', () => {
    it('renders undefined on the server', () => {
      matchingQueries = new Set([media.md]);
      const html = renderToString(<Probe name="md" />);

      expect(html).toContain('Matches: <!-- -->undefined');
    });

    it('renders serverValue on the server', () => {
      const html = renderToString(<Probe name="md" options={{ serverValue: true }} />);

      expect(html).toContain('Matches: <!-- -->true');
    });
  });

  describe('hydration', () => {
    async function hydrate(element: React.ReactElement, onRender: (value: unknown) => void) {
      const container = document.createElement('div');
      container.innerHTML = renderToString(element);
      document.body.append(container);

      const onRecoverableError = vi.fn();
      const consoleError = vi.spyOn(console, 'error');
      onRender('hydration-start');

      let root: ReturnType<typeof hydrateRoot> | undefined;
      await act(async () => {
        root = hydrateRoot(container, element, { onRecoverableError });
      });

      return { container, onRecoverableError, consoleError, unmount: () => root?.unmount() };
    }

    it('hydrates with undefined, then corrects to the measured value', async () => {
      matchingQueries = new Set([media.md]);
      const renders: unknown[] = [];
      const onRender = (value: unknown) => renders.push(value);

      const { container, onRecoverableError, consoleError, unmount } = await hydrate(
        <Probe name="md" onRender={onRender} />,
        onRender,
      );

      const hydrationRenders = renders.slice(renders.indexOf('hydration-start') + 1);
      expect(renders[0]).toBeUndefined();
      expect(hydrationRenders[0]).toBeUndefined();
      expect(hydrationRenders.at(-1)).toBe(true);
      expect(container).toHaveTextContent('Matches: true');
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      unmount();
    });

    it('hydrates with serverValue, then corrects to the measured value', async () => {
      const renders: unknown[] = [];
      const onRender = (value: unknown) => renders.push(value);

      const { container, onRecoverableError, consoleError, unmount } = await hydrate(
        <Probe name="md" options={{ serverValue: true }} onRender={onRender} />,
        onRender,
      );

      const hydrationRenders = renders.slice(renders.indexOf('hydration-start') + 1);
      expect(renders[0]).toBe(true);
      expect(hydrationRenders[0]).toBe(true);
      expect(hydrationRenders.at(-1)).toBe(false);
      expect(container).toHaveTextContent('Matches: false');
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      unmount();
    });

    it('keeps listening for viewport changes after hydration', async () => {
      const { container, unmount } = await hydrate(<Probe name="md" />, () => {});

      expect(container).toHaveTextContent('Matches: false');
      setViewport([media.sm, media.md]);
      expect(container).toHaveTextContent('Matches: true');
      unmount();
    });
  });
});
