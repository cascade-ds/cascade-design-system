# Todo

## Theme the scrollbar to follow the set theme

- Add semantic color tokens `scrollbar.thumb` and `scrollbar.track` with light and dark values (`packages/tokens/themes/color-*.tokens.json`), then `pnpm build:style`.
- In `ThemeProvider`, set `scrollbar-color: thumb track` and `color-scheme: light | dark` on the root div. `scrollbar-color` is inherited, so nested scroll areas follow it.
- Open problem: the page scrollbar belongs to `<html>`, not the provider div, so an explicit `data-theme` would not reach it. Options: a `useEffect` setting `data-theme` / `color-scheme` on `<html>`, or a `:root` rule in the generated CSS that follows only the system theme.
- `scrollbar-color` cannot style hover or rounded thumbs. Supported in Chrome 121+, Firefox, Safari 18.2+.
