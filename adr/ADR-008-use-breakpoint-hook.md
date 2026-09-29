# ADR-008: `useBreakpoint`, a hook for behaviour and subtrees, with an honest `undefined` before hydration

## Status

Accepted

## Context

[ADR-007](./ADR-007-responsive-breakpoints.md) publishes the breakpoints as
media conditions (`media.md === '(min-width: 48em)'`) and keeps page layout
in CSS. That covers layout, but some responsive decisions can't be made in
CSS:

- **Choosing between subtrees.** A drawer instead of a sidebar, a compact
  table instead of a data grid. Rendering both and hiding one with CSS
  doubles the DOM, mounts effects and focus targets twice, and can leave
  duplicate landmarks or IDs.
- **Skipping heavy work.** A chart or map that shouldn't load or render on
  small screens at all.
- **Behaviour.** Keyboard handling, gestures, how many items to fetch.

Without a shared hook, every app writes its own `matchMedia` wrapper. Each
one hardcodes or re-derives the conditions and handles SSR differently, and
the usual mistake is to return `false` on the server, which renders the
mobile tree for everyone and then swaps it on desktop.

The hard constraint is server rendering. The server can't know the viewport,
and an SSR page paints the server HTML before hydration, so no JS value can
affect the first paint of an SSR app. The options for anything that depends
on the viewport are:

1. **CSS first.** Always correct at first paint; can't change which
   components render.
2. **Render both, hide one with CSS.** Correct at first paint, at the cost of
   rendering and mounting both trees.
3. **Server hints.** Guess the viewport per request from Client Hints
   (`Sec-CH-Viewport-Width`), a cookie holding the last width, or the
   User-Agent. Often right, never guaranteed, and request handling is
   framework-specific.
4. **Client-only with a placeholder.** Render a placeholder until the value
   is known. Honest, but the real content appears after hydration.
5. **Guess and correct.** Render a guess on the server, measure after
   hydration, and correct it. A right guess means no visible change; a wrong
   one means a jump.

## Decision

Ship `useBreakpoint(name, options?)` from `@cascade-ds/components` for
behaviour and choosing between subtrees. Layout stays in CSS, as ADR-007
decided.

- **Same conditions as CSS.** `name` is a key of `media` from
  `@cascade-ds/styles/media` (typed as `keyof typeof media`), and the hook
  calls `matchMedia(media[name])`. A breakpoint added to the tokens is
  available to the hook with no code change, and the hook and `@media` rules
  can't disagree.
- **`boolean | undefined`.** `true` when the viewport matches (mobile-first,
  `min-width`), `false` when it doesn't. "Below md" is
  `useBreakpoint('md') === false`.
- **An honest `undefined`.** On the server and during hydration the hook
  returns `undefined`, meaning "not measured yet", never a guessed `false`.
  Callers have to decide what the unknown state renders (option 4), instead
  of silently getting the mobile tree.
- **`serverValue` for guess-and-correct (options 3 + 5).** An SSR app that
  guesses the viewport passes `{ serverValue: guess }`. The hook renders it
  on the server and during hydration, so the markup matches, and then
  corrects it to the measured value. The hook doesn't read requests;
  producing the guess is the app's job, because it's framework-specific.
- **`useSyncExternalStore` over `matchMedia`**, the same pattern as
  `ThemeProvider`'s system theme: subscribe to the `MediaQueryList` `change`
  event, client snapshot `matchMedia(query).matches`, server snapshot
  `serverValue` (or `undefined`). React uses the server snapshot for the
  server render and for hydration, then re-renders with the client value,
  which gives the behaviour above without a hydration mismatch. A
  browser-only app (`createRoot`) never uses the server snapshot, so it gets
  the measured value on its first render. Environments without `matchMedia`
  keep the server value.
- **No general `useMediaQuery` export.** The hook uses one internally, but the
  public API is only the breakpoints. Arbitrary queries (`prefers-reduced-motion`,
  `hover`, orientation) aren't a design-system concern: motion preferences
  already go through CSS and `MotionProvider`. If a real need shows up, the
  generic hook can be exported later with the same `undefined` /
  `serverValue` semantics.

## Consequences

- Browser-only apps get the right value in the first render that affects
  paint. SSR apps paint the server HTML (with `undefined` or `serverValue`)
  until hydration, so anything the user sees immediately must still come
  from CSS (options 1 and 2). The hook's JSDoc and `API.md` say so.
- Callers must handle `undefined`. That's deliberate: treating "unknown" as
  "mobile" is the bug the hook exists to prevent.
- A wrong `serverValue` guess causes one re-render and a visible swap after
  hydration, never a hydration error.
- The main entry of `@cascade-ds/components` now imports
  `@cascade-ds/styles/media` at runtime (external in the Rollup build), so
  the hook always reads the installed breakpoints.
- Breakpoint names are now also part of the components API. Renaming or
  removing one is a breaking change for both packages.
- Components themselves still don't use breakpoints, as ADR-007 decided.
  The hook is for consuming apps.
