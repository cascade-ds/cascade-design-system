# How to Contribute

## Creating Components

All components live under `packages/components/src/<ComponentName>/`, one
folder per component, `PascalCase` named to match the component itself
(e.g. `Button`, `Stack`).

Every component folder **must** contain these four files, plus a story in
`packages/storybook/stories/`:

```
packages/components/src/<ComponentName>/
├── <ComponentName>.style.ts     # base CSS + variants, exports a cva()
├── <ComponentName>.test.tsx     # RTL: variant + behaviour tests
├── <ComponentName>.tsx          # the component itself
└── index.ts                     # exports the component + its Props type

packages/storybook/stories/
└── <ComponentName>.stories.tsx  # Storybook stories
```

`<ComponentName>.style.ts` can be skipped if the component has no visual
variants to solve for (e.g. a purely structural/layout component) — in
that case style the component inline or via a plain `css` tag in
`<ComponentName>.tsx` instead.

### `<ComponentName>.style.ts`

- Define the base styles with Linaria's `css` tag.
- Define each variant axis (`variant`, `size`, etc.) as its own `css`
  block, then combine them with `cva()` from
  `class-variance-authority`, exporting the result.
- Only consume **semantic** (or `component`) tokens from
  `@cascade-ds/styles` — never raw primitives or hardcoded values. See
  the [token model in the README](./README.md#token-model-primitive--semantic--component).
- Set sensible `defaultVariants` so the component renders correctly with
  no props.

```ts
// Button.style.ts
import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseButtonCss = css`
  font-family: ${semantic.font.family.body};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const variants = {
  primary: css`
    background: ${component.button.color.primary.background.default};
  `,
  secondary: css`
    background: ${component.button.color.secondary.background.default};
  `,
};

export const buttonVariant = cva(baseButtonCss, {
  variants: { variant: variants },
  defaultVariants: { variant: 'primary' },
});
```

### `<ComponentName>.tsx`

- A single default-exported function component.
- Derive the props type from the `cva()` return via
  `VariantProps<typeof xVariant>`, intersected with the relevant native
  HTML attributes.
- Apply the computed class name with `cx` from `linaria`.
- Compose on top of `Box` (`#/Box`) rather than raw DOM elements where
  possible, so layout/polymorphism stays consistent across components.

```tsx
// Button.tsx
import Box from '#/Box';
import { buttonVariant } from './Button.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

type ButtonProps = VariantProps<typeof buttonVariant> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {
  const { variant, children, ...restProps } = props;
  return (
    <Box as="button" className={cx(buttonVariant({ variant }))} {...restProps}>
      {children}
    </Box>
  );
}

export default Button;
```

### `<ComponentName>.test.tsx`

- Vitest + React Testing Library (jsdom). Query by role/accessible name,
  not test ids or class names.
- Cover, at minimum:
  - **Rendering** — the component renders with correct semantics
    (role, tag).
  - **Variants** — each variant/size prop applies the class the
    corresponding `cva()` call would produce (compare against the
    exported variant function, not hardcoded class strings, so tests
    don't rot when styles change).
  - **Behaviour** — interactions (`userEvent`), e.g. `onClick` firing.
- `afterEach(cleanup)` at the top of the file.

### `<ComponentName>.stories.tsx`

- Lives in `packages/storybook/stories/`, named after the component. Import
  the component through the `#/` alias (`import Button from '#/Atoms/Button/Button'`),
  which points at `packages/components/src`.
- One `Meta` per component, `title: 'CascadeDS/Components/<Category>/<ComponentName>'`
  (e.g. `Atom`, `Molecule`), `tags: ['autodocs']`.
- Set `args` to sensible defaults so the `Default` story renders
  meaningfully out of the box.
- Document each variant prop's purpose via `argTypes[...].description`
  where it isn't self-evident.
- Add one named story per meaningfully distinct state (sizes, variants,
  disabled, etc.) — not a cross product of every prop combination.
- Storybook's `addon-a11y` (via `addon-vitest`) runs accessibility
  checks against every story, so a broken story is also an a11y test
  failure — see [ADR-003](./adr/ADR-003-a11y-testing.md).

### `index.ts`

- Re-export the component as a named export and re-export its props
  type, nothing else:

```ts
// index.ts
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```

- Add the same re-export to `packages/components/src/index.ts` so the
  component is part of the package's public surface.
- Document it in [`packages/components/API.md`](./packages/components/API.md):
  props, variant values with defaults, parts, and one example. Add a row to
  its "Choosing a component" table when the component covers a new need.

### Before opening a PR

```sh
pnpm --filter @cascade-ds/components test        # unit tests
pnpm --filter @cascade-ds/components typecheck
pnpm --filter @cascade-ds/components lint
pnpm test:storybook                               # a11y checks
pnpm changeset                                    # record the version bump
```
