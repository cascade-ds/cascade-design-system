# @cascade-ds/components

## 0.2.3

### Patch Changes

- 3e7c5fb: Version both packages together: a release of one always releases the other at the same version.
- Updated dependencies [3e7c5fb]
  - @cascade-ds/styles@0.2.3

## 0.2.2

### Patch Changes

- 771c15a: Publish to npm under the MIT license. Previous versions were private, on GitHub Packages, under a proprietary license.
- Updated dependencies [771c15a]
  - @cascade-ds/styles@0.2.1

## 0.2.1

### Patch Changes

- 9a74a61: Fix broken type declarations: the published `.d.ts` files imported through the internal `#/` alias, which consumers' TypeScript can't resolve, so props such as `children` and `as` were missing on `Grid`, `Stack`, `Container` and others. The source now uses relative imports only, and ESLint blocks path aliases.

## 0.2.0

### Minor Changes

- 2190731: First private release on GitHub Packages: token-driven components and the generated design tokens, themes and motion values.

### Patch Changes

- Updated dependencies [2190731]
  - @cascade-ds/styles@0.2.0
