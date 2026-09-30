# @cascade-ds/generator

Generates the design system's CSS custom properties and TypeScript theme
object from the token source files in `packages/tokens`, using
[Terrazzo](https://terrazzo.app/).

See [ADR-001](../../adr/ADR-001-generator.md) for why Terrazzo was chosen
over Style Dictionary and the earlier hand-rolled generator.

## Tokens structure

Token sources live in `packages/tokens`:

```
packages/tokens/
├── design-system.resolver.json   # composes the sets/modifiers below
├── foundation/
│   ├── primitive.tokens.json     # raw values: color scales, sizes, font stacks…
│   ├── semantic.tokens.json      # semantic aliases over primitives
│   └── component.tokens.json     # component-level aliases (e.g. button.*)
└── themes/
    ├── color-light.tokens.json   # light theme color overrides
    └── color-dark.tokens.json    # dark theme color overrides
```

`design-system.resolver.json` is a [DTCG resolver](https://www.designtokens.org/schemas/2025.10/resolver.json)
that ties these files together:

- the `foundation` set always applies (primitives, semantics, components),
- the `theme` modifier layers `themes/color-light.tokens.json` or
  `themes/color-dark.tokens.json` on top, depending on context (`light` is
  the default).

Resolving tokens through this file — rather than pointing the generator at
the token files directly — validates the set/mode composition up front and
serves as the readable spec for how the layers combine.

## Configuration

`terrazzo.config.ts` points Terrazzo at the resolver and configures two
plugins, both writing into `packages/styles`:

- `@terrazzo/plugin-css` — emits CSS custom properties, once for each theme
  permutation: `light` under `:root`, `dark` under
  `@media (prefers-color-scheme: dark)`. The dark blocks redeclare only the
  tokens whose value depends on the theme (`theme-overrides.ts`); the rest
  inherit from `:root`.
- `@terrazzo/plugin-css-in-js` — emits a typed `theme.js` / `theme.d.ts` pair
  for referencing tokens from component styles (e.g.
  `semantic.font.family.body`).

Output: `packages/styles/index.css`, `packages/styles/theme.js`,
`packages/styles/theme.d.ts`.

## Building

From this package:

```sh
pnpm build
```

which runs the package's `build` script, `tz build` — the Terrazzo CLI
reading `terrazzo.config.ts`.

Or from the repo root:

```sh
pnpm style-build
```

which runs this package's build and then formats the generated `theme.js`.
