# @cascade-ds/components

React components for the design system, styled with linaria + `class-variance-authority` and themed via [`@cascade-ds/styles`](../styles/README.md).

Props, variants and usage for every component: [`API.md`](./API.md).

## Testing

Tests run on [Vitest](https://vitest.dev/) with a `jsdom` environment and
[React Testing Library](https://testing-library.com/react). Config lives in
[`vitest.config.ts`](./vitest.config.ts) — it also loads `@wyw-in-js/vite`,
which is required, not optional: any `*.style.ts` file uses linaria's `css`
tag, and without that plugin it throws at runtime instead of compiling
("Using the `css` tag in runtime is not supported").

Run tests:

```sh
pnpm --filter @cascade-ds/components test
# or, from the repo root:
pnpm test
```

### Conventions

- Colocate tests next to the component: `Button/Button.test.tsx` beside
  `Button/Button.tsx`.
- Import `'@testing-library/jest-dom/vitest'` once per test file to get the
  `toBeInTheDocument` / `toHaveClass` / etc. matchers — it self-registers on
  import, no setup file needed.
- `test.globals` is off, so Testing Library's automatic DOM cleanup between
  tests (which relies on a global `afterEach`) never registers itself. Add
  it explicitly at the top of the file:

  ```tsx
  import { afterEach } from 'vitest';
  import { cleanup } from '@testing-library/react';

  afterEach(() => {
    cleanup();
  });
  ```

### Testing styling: assert against the variant function, not hardcoded classes

Every component's classes come from a `class-variance-authority` (`cva`)
function exported by its `*.style.ts` file (e.g. `buttonVariant` from
`Button.style.ts`). Because linaria compiles those classes to hashed,
generated names (`p1vjrfcw`, `s1a2e8xb`, …), a test that hardcodes an
expected class string is checking today's hash, not the component's actual
styling logic — it breaks on every unrelated rebuild and proves nothing
about correctness.

Instead, call the same variant function the component uses, with the same
props, and assert its output is on the rendered element:

```tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';
import { buttonVariant } from './Button.style';

it('applies the class for the given size and variant', () => {
  render(
    <Button.Root size="medium" variant="secondary">
      Submit
    </Button.Root>,
  );

  const button = screen.getByRole('button', { name: 'Submit' });
  const expectedClassName = buttonVariant({ size: 'medium', variant: 'secondary' });

  // buttonVariant returns a space-separated class list; every class it
  // produces for this size/variant combination must be on the button.
  expectedClassName
    .split(' ')
    .filter(Boolean)
    .forEach((className) => {
      expect(button).toHaveClass(className);
    });
});
```

This way the test stays correct as long as the component actually applies
whatever `buttonVariant` computes for its props — which is the behavior
that matters — regardless of what the compiled class names happen to be.
See [`Button.test.tsx`](./src/Button/Button.test.tsx) for the full example.
