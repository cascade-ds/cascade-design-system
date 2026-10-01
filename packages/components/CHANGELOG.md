# @cascade-ds/components

## 0.4.1

### Patch Changes

- ff101f5: Retheme to the Sunset (light) and Sunrise (dark) palette, and add color variants to more components.
  
  - **Palette.** New `sand` and `night` neutral ramps, retuned `orange`, `pink`, `purple`, `blue`, `green`, `red` and `yellow` ramps, a warm `alpha.ink` shadow tint, and a neutral focus ring (2px). Light and dark map the brand roles differently: ember and coral primary, afterglow rose and dawn-sky blue secondary, with new `brand.tertiary` and `brand.accent` roles. Light `text.tertiary` and `border.strong` now meet their contrast thresholds. Shadows are two-layer and tinted; dark shadows add a top highlight.
  - **Button.** New `tertiary`, `accent`, `success` and `info` variants. The filled variants get a matching border; outline and ghost use the translucent hover and pressed tints and stay flat. Font size now comes from the typography token.
  - **Accordion.** New `background` prop: `default`, `subtle`, `surface`, `brand` and `secondary`.
  - **Card.** New `background` prop (`default`, `subtle`, `brand`, `secondary`, `tertiary`, `accent`, `success`, `info`, `danger`) that sets the border with it, and a `hover` prop to remove the pointer hover effect of an `interactive` card.
  - **Switch, Slider, Spinner, Skeleton, Breadcrumb.** New `color` prop (`primary`, `secondary`, `tertiary`, `accent`, `success`, `info`, `danger`; Spinner adds `neutral`, Skeleton `gray`, Breadcrumb `neutral`).
  - **Badge and Tag.** Tone borders use each tone's solid color.
  - **Select and Input.** Focus uses the shared focus ring, and menu popups share one radius, shadow and item style.
  - **Tabs, Pagination, Tooltip.** The active tab text uses the brand color, the current page gets a border, and the tooltip shadow is lighter.
  - **Alert.** Light backgrounds and borders are stronger, and dark backgrounds are softer.
- Updated dependencies [ff101f5]
  - @cascade-ds/styles@0.4.1

## 0.4.0

### Minor Changes

- c5002aa: Add a `grow` variant to `Stack` that sets `flex: 1`, so it fills free space in a flex parent and `justify` can take effect.

### Patch Changes

- @cascade-ds/styles@0.4.0

## 0.3.3

### Patch Changes

- Updated dependencies [2b66d8a]
  - @cascade-ds/styles@0.3.3

## 0.3.2

### Patch Changes

- Updated dependencies [2c2fcdd]
  - @cascade-ds/styles@0.3.2

## 0.3.1

### Patch Changes

- cd15ff4: Emit one module per source file so bundlers can tree-shake. Importing a single export, such as `useTheme`, no longer pulls in Base UI for every component.
- @cascade-ds/styles@0.3.1

## 0.3.0

### Minor Changes

- 0e46e74: Drop the `@radix-ui/react-icons` dependency. Components now ship only the icons they need to work (checkmark, chevrons, dismiss and remove ×). `Alert` and `Toast` no longer add a default tone icon: pass `icon` to `Alert`, or `icon` in the `Toast` options, to show one.

### Patch Changes

- @cascade-ds/styles@0.3.0

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
