---
'@cascade-ds/components': patch
'@cascade-ds/styles': patch
---

Retheme to the Sunset (light) and Sunrise (dark) palette, and add color variants to more components.

- **Palette.** New `sand` and `night` neutral ramps, retuned `orange`, `pink`, `purple`, `blue`, `green`, `red` and `yellow` ramps, a warm `alpha.ink` shadow tint, and a neutral focus ring (2px). Light and dark map the brand roles differently: ember and coral primary, afterglow rose and dawn-sky blue secondary, with new `brand.tertiary` and `brand.accent` roles. Light `text.tertiary` and `border.strong` now meet their contrast thresholds. Shadows are two-layer and tinted; dark shadows add a top highlight.
- **Button.** New `tertiary`, `accent`, `success` and `info` variants. The filled variants get a matching border; outline and ghost use the translucent hover and pressed tints and stay flat. Font size now comes from the typography token.
- **Accordion.** New `background` prop: `default`, `subtle`, `surface`, `brand` and `secondary`.
- **Card.** New `background` prop (`default`, `subtle`, `brand`, `secondary`, `tertiary`, `accent`, `success`, `info`, `danger`) that sets the border with it, and a `hover` prop to remove the pointer hover effect of an `interactive` card.
- **Switch, Slider, Spinner, Skeleton, Breadcrumb.** New `color` prop (`primary`, `secondary`, `tertiary`, `accent`, `success`, `info`, `danger`; Spinner adds `neutral`, Skeleton `gray`, Breadcrumb `neutral`).
- **Badge and Tag.** Tone borders use each tone's solid color.
- **Select and Input.** Focus uses the shared focus ring, and menu popups share one radius, shadow and item style.
- **Tabs, Pagination, Tooltip.** The active tab text uses the brand color, the current page gets a border, and the tooltip shadow is lighter.
- **Alert.** Light backgrounds and borders are stronger, and dark backgrounds are softer.
