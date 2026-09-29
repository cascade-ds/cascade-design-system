# ADR-007: Responsive breakpoints — CSS-in-JS media conditions, `@custom-media` as the escape hatch

## Status

Accepted

## Context

Consuming apps need to make their page layout responsive (collapse the
sidebar, reflow a dashboard grid) using the design system's breakpoints, so
every app changes layout at the same widths.

The breakpoints already existed as tokens (`semantic.layout.breakpoint.*`),
but the only way to reach them was as CSS custom properties, and those can't
be used in a media query:

```css
@media (min-width: var(--semantic-layout-breakpoint-md)) { … } /* invalid, never matches */
```

Custom properties resolve per element, and a media condition belongs to no
element, so browsers reject `var()` inside `@media` and `@container`
conditions. `theme.js` exposes every token as `var(--…)`, which means the
obvious `${semantic.layout.breakpoint.md}` inside a Linaria template compiles
into a query that never matches.

Other facts that shaped the decision:

- **Breakpoints are for consumers only.** Components don't use them. A
  component doesn't know how much of the viewport it gets (a Card in a 256px
  sidebar on a 1440px screen is still narrow), so any future component
  responsiveness would use container queries, not viewport breakpoints.
- **The stack is already CSS-in-JS.** Components are styled with Linaria
  ([ADR-002](./ADR-002-styling-library.md)), whose build step (wyw-in-js)
  evaluates imported JS values at build time. `theme.js` is consumed this way.
- **There's a precedent for "tokens as resolved JS values".** Motion can't
  read `var()` either, so `terrazzo.config.ts` already has an `emitMotion`
  plugin that writes resolved `semantic.motion.*` values to
  `@cascade-ds/styles/motion`.
- **Breakpoints were also used as widths.** `layout.container.*`,
  `layout.content.max-width` and `component.modal.width.*` pointed at the
  breakpoints, so changing a layout breakpoint would silently resize
  Container and Dialog.

## Decision

Keep the breakpoint tokens as the single source of truth and emit them at
build time as resolved media conditions. **The main output is a JS module for
CSS-in-JS. A `@custom-media` stylesheet is the escape hatch for apps that
write plain CSS.**

- **Tokens.** New `primitive.breakpoint.*` tokens hold the raw values;
  `semantic.layout.breakpoint.*` points at them. The width tokens
  (`layout.container.*`, `layout.content.max-width`, `modal.width.*`) point
  at new `primitive.size.*` steps instead of at the breakpoints. The values
  stay the same, but the two meanings are now separate tokens.
- **Generator.** An `emitMedia` Terrazzo plugin, modelled on `emitMotion`,
  reads the resolved breakpoints, sorts them by width, and writes:
  - `media.js` / `media.d.ts`, exported as `@cascade-ds/styles/media`, the
    main output:

    ```ts
    import { media } from '@cascade-ds/styles/media';
    css`@media ${media.md} { … }`; // media.md === '(min-width: 48em)'
    ```

  - `media.css`, exported as `@cascade-ds/styles/media.css`, the escape
    hatch: `@custom-media --cascade-md (min-width: 48em);`, used as
    `@media (--cascade-md)` through PostCSS.
- **Bare conditions, not full `@media` rules.** Each entry is just
  `(min-width: …)`, so one string works in a CSS-in-JS `@media`, in
  `window.matchMedia`, in `<source media>`, and negated (`not ${media.md}`).
- **Mobile-first `min-width` only.** "Below md" is `not ${media.md}`, so
  there's no second set of `max-width` conditions to keep in sync.
- **`em`, not `px`.** Media queries in `em` scale with the user's browser
  font-size setting (1em = 16px in a media query, regardless of the root font
  size). The plugin converts: 768px becomes 48em.

### Why CSS-in-JS is the main output

It needs nothing beyond what the system already depends on. Linaria and
wyw-in-js are already in the build, `@cascade-ds/styles` already ships JS
token modules, and `emitMotion` already proves the pattern. The JS module is
typed (`media.md` autocompletes, and a typo is a type error) and works
unchanged in any CSS-in-JS library that interpolates strings
(styled-components, emotion, vanilla-extract, Linaria).

### Why `@custom-media` is only the escape hatch

`@custom-media` is the standard CSS answer (Media Queries Level 5), but no
browser supports it natively yet. Using it takes a PostCSS setup the system
doesn't otherwise need: `postcss-custom-media`, plus
`@csstools/postcss-global-data` so every file can see the definitions. It's
worth generating because it costs one extra output file and unblocks
plain-CSS and CSS Modules apps, but it isn't the documented default.

### Alternatives considered

- **`var()` in media queries.** Invalid CSS; this is the problem, not an
  option.
- **Responsive props on components** (e.g. `<Stack direction={{ base:
  'column', md: 'row' }}>`). Out of scope: breakpoints are for page layout,
  and components shouldn't respond to the viewport. `cva` also can't
  generate the classes for every value × breakpoint, so it would need a
  custom-property design of its own. If components ever need to respond to
  their size, that's a separate decision, and it should use container
  queries.
- **A `useBreakpoint` hook for layout.** Layout stays in CSS. The hook exists
  for behaviour and choosing between subtrees; see
  [ADR-008](./ADR-008-use-breakpoint-hook.md).
- **Sass variables / mixins output.** No Sass consumers today. It's easy to
  add as another output of the same plugin if that changes.
- **Only publishing the numeric values** (e.g. `breakpoint.md = 768`).
  Every consumer would then rebuild the condition string themselves, and
  some would get the unit or the direction wrong.

## Consequences

- `@cascade-ds/styles` gains two public entry points, `./media` and
  `./media.css`. The breakpoint names and conditions are now public API:
  renaming or removing one is a breaking change for consuming apps.
- Changing a breakpoint value is a one-place token edit. The media outputs
  follow on the next `pnpm build:style`, and Container and Dialog widths
  don't move.
- The `--semantic-layout-breakpoint-*` custom properties still exist and
  are valid in properties (e.g. `max-width`), but never inside `@media`.
  The styles README says so, because it's the first thing a consumer will
  try.
- Apps on plain CSS or CSS Modules need a PostCSS setup to use the
  breakpoints. The styles README documents it; the system doesn't provide or
  test it.
- `emitMedia` reads `semantic.layout.breakpoint.*` by path prefix. Adding a
  breakpoint (e.g. `3xl`) needs only a token change; moving the group needs
  the prefix in `terrazzo.config.ts` updated too.
- Consumers rearrange a section by passing `className` with their own
  `@media ${media.md}` rule to Stack / Grid / Container. For that override
  to win reliably, all system CSS ships in cascade layers
  (`@layer cascade.tokens, cascade.components;`), which unlayered consumer
  CSS always beats. The trade-off is that unlayered global resets override
  components too, so consumers must put resets in a layer before `cascade`.
- If components later need to respond to their size, a new ADR decides
  that (container queries, with the same generator approach emitting
  `@container` conditions). This ADR doesn't cover it.
