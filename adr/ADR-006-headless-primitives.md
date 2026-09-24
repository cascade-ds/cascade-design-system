# ADR-006: Headless primitives for interactive compound components

## Status

Proposed. The acceptance criterion is met: the Popover spike
(`packages/components/src/Molecules/Popover`) is built on Base UI and
confirms the portal integration below. Awaiting sign-off to move to
Accepted.

## Context

The next components are interactive compounds: Dialog, Popover, Tooltip,
Menu, Tabs, Select, Accordion. Their hard parts are behavior, not looks:
focus trapping and restoration, keyboard navigation, ARIA wiring, dismissal
on outside click or Escape, collision-aware positioning, and nested layers.
Getting these right by hand is slow and a common source of accessibility
bugs, so we want an unstyled ("headless") library to own the behavior while
Cascade DS owns the API and the styling.

The library has to fit how the system already works:

- **Styling is Linaria + tokens.** Components style state through CSS
  selectors (the Switch reads `:checked`), so the library should expose state
  as DOM attributes we can target, not require its own styling solution.
- **Theme switching is pure CSS.** JS only flips `data-theme`; the cascade
  does the rest. Enter/exit animation should follow the same idea and run
  on CSS and `semantic.motion.*` tokens.
- **Motion is optional.** `motion` is an optional peer, isolated in the
  `@cascade-ds/components/motion` entry. Core components can't depend on it,
  including for exit animations.
- **Compound API convention.** `function Dialog` with parts attached as
  `Dialog.Trigger = DialogTrigger`, never renamed to `DialogRoot`.
- **Tokens reach elements through DOM inheritance.** Overlays render
  through portals at the end of `<body>`, outside the ThemeProvider's
  `data-theme` element, so they would resolve tokens against `:root` and
  render in the wrong theme inside a dark or light subtree.

Options considered:

| | Radix Primitives | Base UI | React Aria Components |
|---|---|---|---|
| State for styling | `data-state="open"`, … | `data-open`, `data-disabled`, … | `data-*` + render props |
| Enter/exit animation | Exit needs `forceMount` and a JS animation library | CSS only, via `data-starting-style` / `data-ending-style` | CSS classes or `data-entering` / `data-exiting` |
| Element override | `asChild` | `render` prop | render props |
| Accessibility / i18n | Very good | Very good | Best in class, heavier API |

## Decision

1. **Build interactive compound components on Base UI**
   (`@base-ui/react`), wrapped behind Cascade DS's own API.
   - It exposes state as data attributes, so styling stays in Linaria with
     component tokens: `&[data-open] { … }`.
   - Enter and exit animations run in CSS through `data-starting-style` and
     `data-ending-style` with `semantic.motion.*` tokens, so core overlays
     never need Motion.
   - It is actively developed by the authors of Radix, MUI and Floating UI.
   - React Aria stays the fallback if a component needs localisation or
     right-to-left support Base UI can't provide.

2. **Wrap, never re-export.** Consumers only see Cascade DS components and
   props, never a Base UI type, so the library can be replaced without
   breaking changes. Each part is a styled wrapper following the compound
   convention (`Dialog.Trigger`, `Dialog.Content`, …).

3. **Every overlay portals through `ThemedPortal`**
   (`packages/components/src/ThemeProvider/ThemedPortal.tsx`). It portals
   to `<body>` and puts the nearest ThemeProvider's theme on the portal root
   as `data-theme`, so token values start over there with the right theme.
   We chose this over rendering a portal container inside the provider:
   content in such a container gets clipped by an ancestor's `overflow`,
   `transform` or `z-index`, which is the problem portals exist to solve.
   Supporting change: a nested ThemeProvider without its own theme now
   reports its parent's theme, so `useTheme()` and portals match what the
   subtree actually renders.

4. **Base UI is a regular dependency**, not an optional peer like Motion:
   core components can't work without it. Rollup already treats
   `dependencies` as external, and Base UI publishes ES modules, so apps
   only bundle the parts they use.

## Consequences

- `@base-ui/react` becomes a dependency of
  `@cascade-ds/components`.
- Base UI's portal parts (`Popover.Portal`, `Dialog.Portal`, …) render
  their own `<div>` into `<body>` and accept any `<div>` props. So overlays
  spread `useThemedPortalProps()` (from `ThemedPortal.tsx`) onto that
  element: it becomes the themed root, with no extra wrapper and no second
  portal. `ThemedPortal` itself stays for overlays that don't use a Base UI
  portal. The Popover spike confirmed this in a real browser: a popover
  opened from a dark section of a light page renders with the dark tokens.
- Overlay animations live in `*.style.ts` as CSS on Base UI's
  `data-starting-style` / `data-ending-style` attributes. Richer effects go
  in the `/motion` entry point.
- Behavior is unit-tested in jsdom. The Popover tests (open, dismiss,
  focus return, portal theming) needed no polyfills; components that drag
  or measure (Slider, ScrollArea) may still need `ResizeObserver` or
  pointer-capture stubs. Real-browser behavior stays covered by the
  Storybook accessibility tests (see [ADR-003](./ADR-003-a11y-testing.md)),
  which check `body` for overlay stories so portaled popups are included.
- Parts that act as buttons (`Popover.Trigger`, `Popover.Close`) render a
  Cascade `Button` through Base UI's `render` prop and take `ButtonProps`,
  so consumers style them with the usual `variant` and `size`.
- **Follow-up:** add a fitness function (see
  [ADR-005](./ADR-005-fitness-functions.md)) that fails when component code
  calls `createPortal` outside `ThemedPortal`, or renders a Base UI `Portal`
  without `useThemedPortalProps()`, so the theming rule doesn't depend on
  reviewers catching it.
