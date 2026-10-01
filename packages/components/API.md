# @cascade-ds/components API

Reference for building UIs with `@cascade-ds/components`. Every prop, variant
value, and default below is taken from the source in `src/`, and the source wins
if the two ever disagree.

## Setup

```tsx
// App entry, once, before anything renders.
import '@cascade-ds/components/styles.css';
import '@fontsource/inter/400.css'; // fonts aren't bundled: load Inter
import '@fontsource/inter/500.css'; // in the four weights the tokens use
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css'; // code font
import { ThemeProvider, Toast } from '@cascade-ds/components';

<ThemeProvider>
  <Toast>{/* app */}</Toast>
</ThemeProvider>;
```

- `styles.css` holds the token custom properties and every component's styles.
  The JS never imports CSS, so without this import components render unstyled.
- Everything imports from the package root, except `MotionProvider`, which
  imports from `@cascade-ds/components/motion`.

## Rules that apply to every component

- **Styling.** Choose the look with variant props (`variant`, `tone`, `size`,
  …). Use `className` for layout (margins, grid placement, responsive
  rearranging), not to recolor a component. Component styles sit in the
  `cascade.components` cascade layer, so any unlayered `className` rule
  overrides them, whatever the specificity or load order. The same goes for
  global resets, so put those in a layer before `cascade`. Custom CSS reads
  tokens from `@cascade-ds/styles` (`semantic.*` / `component.*`), not
  hardcoded values, so it still works in dark mode.
- **Variant props** are optional. Omitting one, or passing `null`, applies
  the default listed below.
- **Native props.** Unless a component says otherwise, it renders one DOM
  element and forwards the rest of its props (`id`, `aria-*`, event handlers,
  `ref`, …) to that element.
- **Compound components.** Parts hang off the root: `Card.Title`,
  `Dialog.Content`, `Select.Item`. Each part is a separate component with its
  own props, and you nest the parts inside their root.
- **Triggers are Buttons.** `Dialog.Trigger`, `Dialog.Close`,
  `Popover.Trigger`, `Popover.Close`, `DropdownMenu.Trigger` and
  `Tooltip.Trigger` render a Cascade `Button` and take all of
  [Button](#button)'s props (`variant`, `size`, `Button.Icon` children, …).
  Don't nest another `Button` inside them.
- **Overlays** (`Dialog`, `Popover`, `DropdownMenu`, `Tooltip`, `Select`,
  `Combobox`, `Autocomplete`, `Toast`) portal to `<body>` but keep the theme of the nearest
  `ThemeProvider`. Their `open` / `defaultOpen` / `onOpenChange` props work the
  React way: pass `open` + `onOpenChange` for a controlled overlay, or nothing
  or `defaultOpen` for an uncontrolled one.
- **Icons** are any SVG React element, supplied by the consumer from the icon
  library of their choice. The package ships only the icons a component needs
  to work (checkmark, chevron, dismiss ×) and depends on no icon library.

## Contents

- Theme: [ThemeProvider / useTheme](#themeprovider--usetheme), [MotionProvider](#motionprovider)
- Viewport: [useBreakpoint](#usebreakpoint)
- Layout: [Box](#box), [Stack](#stack), [Grid](#grid), [Container](#container), [Divider](#divider)
- Typography: [Heading](#heading), [Text](#text), [Label](#label), [Link](#link), [Kbd](#kbd), [VisuallyHidden](#visuallyhidden)
- Actions: [Button](#button)
- Form controls: [FormField](#formfield), [Input](#input), [Select](#select), [Combobox](#combobox), [Autocomplete](#autocomplete), [Checkbox](#checkbox), [Radio](#radio), [Switch](#switch), [Slider](#slider), [Textarea](#textarea)
- Display: [Icon](#icon), [Avatar](#avatar), [Badge](#badge), [Tag](#tag), [Card](#card), [Accordion](#accordion), [Progress](#progress), [Spinner](#spinner), [Skeleton](#skeleton)
- Feedback: [Alert](#alert), [Toast](#toast)
- Overlays: [Dialog](#dialog), [Popover](#popover), [DropdownMenu](#dropdownmenu), [Tooltip](#tooltip)
- Navigation: [Tabs](#tabs), [Breadcrumb](#breadcrumb), [Pagination](#pagination)
- [Choosing a component](#choosing-a-component)

---

## Theme

### ThemeProvider / useTheme

| Prop          | Type                | Default                                  |
| ------------- | ------------------- | ---------------------------------------- |
| `initialMode` | `'light' \| 'dark'` | none: follows the OS until `setTheme` is called |

- Renders a `<div data-theme>` that paints `background` and text color.
  Providers nest, so a `ThemeProvider initialMode="dark"` inside a light page
  gives a dark subtree.
- `useTheme()` returns `{ theme: 'light' | 'dark', setTheme(mode) }` and
  throws outside a provider.

```tsx
const { theme, setTheme } = useTheme();
<Switch checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}>
  Dark mode
</Switch>;
```

### MotionProvider

`import { MotionProvider } from '@cascade-ds/components/motion'`. It needs the
optional `motion` peer dependency. It wraps `motion/react`'s `MotionConfig`
with the token duration and easing as defaults and `reducedMotion="user"`.
The only prop is `children`. Put it inside `ThemeProvider`.

---

## Viewport

### useBreakpoint

```ts
useBreakpoint(name: BreakpointName, options?: UseBreakpointOptions): boolean | undefined
// BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | '2xl', the keys of `media` from @cascade-ds/styles/media
// UseBreakpointOptions = { serverValue?: boolean }
```

Whether the viewport is at least as wide as a breakpoint. It reads the same
condition as CSS (`media.md === '(min-width: 48em)'`), so the hook and your
`@media` rules always agree. It needs no provider.

| Returns     | When                                                                          |
| ----------- | ----------------------------------------------------------------------------- |
| `true`      | the viewport matches `media[name]` (mobile-first, `min-width`)                |
| `false`     | it doesn't. "Below md" is `useBreakpoint('md') === false`                     |
| `undefined` | not measured yet: on the server and during hydration, when there's no `serverValue` |

- It re-renders when the viewport crosses the breakpoint.
- **Use it for behaviour and for choosing between subtrees**: a drawer
  instead of a sidebar, skipping a heavy chart on small screens, different
  keyboard handling. **Use CSS for layout**: columns, spacing, showing and
  hiding, and rearranging a `Stack` or `Grid` all go in a `className` with
  `@media ${media.md}` (see [Layout](#layout)).
- **Browser-only apps** (`createRoot`) get the measured value on the first
  render, so nothing jumps.
- **SSR apps** paint the server HTML, rendered with `undefined`, until
  hydration finishes, and then switch to the measured value. Anything the user
  sees immediately must come from CSS. Handle `undefined` explicitly (a
  placeholder, or the CSS-driven default) instead of treating it as `false`.
- **`serverValue`** is rendered on the server and during hydration instead of
  `undefined`, for SSR apps that guess the viewport per request (Client Hints
  such as `Sec-CH-Viewport-Width`, a cookie holding the last width, the
  User-Agent). The hook corrects it to the measured value right after
  hydration, so a right guess means no visible change. Reading the request is
  up to the app. A browser-only render ignores it.

```tsx
const isDesktop = useBreakpoint('md'); // SSR with a guess: useBreakpoint('md', { serverValue: guessedDesktop })

if (isDesktop === undefined) return <NavPlaceholder />;
return isDesktop ? <Sidebar /> : <NavDrawer />;
```

---

## Layout

Page breakpoints for your own media queries come from
`@cascade-ds/styles/media` (`@media ${media.md}`), or from
`@cascade-ds/styles/media.css` for PostCSS; see the styles README's
"Responsive layout" section. The components don't take responsive props:
to rearrange a section at a breakpoint, pass `className` with your own
`@media ${media.md}` rule. To render a different subtree per breakpoint, use
[useBreakpoint](#usebreakpoint).

Layout components take `as?: LayoutElement` to set the rendered element:
`'div'` (default) `| 'section' | 'article' | 'aside' | 'main' | 'header' |
'footer' | 'nav' | 'ul' | 'ol' | 'form' | 'fieldset'`.

### Box

An unstyled polymorphic element. `as` accepts any element or component
(default `div`), and all other props go to it. Use it when you need an
element with no styling at all; for spacing, use `Stack` / `Grid`.

### Stack

A flexbox that lays out children in one direction.

| Prop        | Values                                                   | Default    |
| ----------- | -------------------------------------------------------- | ---------- |
| `direction` | `column` `row`                                           | `column`   |
| `gap`       | `none` `xs` `sm` `md` `lg` `xl` `2xl`                    | `md`       |
| `align`     | `start` `center` `end` `stretch` (cross axis)            | `stretch`  |
| `justify`   | `start` `center` `end` `between` (main axis)             | `start`    |
| `wrap`      | `boolean`                                                | `false`    |
| `grow`      | `boolean` (`flex: 1`: fills free space in a flex parent) | `false`    |

`justify` only has an effect when the Stack has free space on its main axis.
Set `grow` (or a size) so a Stack inside a flex parent can fill it.

```tsx
<Stack direction="row" gap="sm" justify="end">
  <Button variant="ghost">Cancel</Button>
  <Button>Save</Button>
</Stack>
```

### Grid

A CSS grid of equal-width columns. It has no span prop: to make a child span
columns, give that child a `className` that sets `grid-column`.

| Prop      | Values                                        | Default   |
| --------- | --------------------------------------------- | --------- |
| `columns` | `1` `2` `3` `4` `6` `12`                      | `12`      |
| `gap`     | `none` `xs` `sm` `md` `lg` `xl` `gutter`      | `gutter`  |
| `align`   | `start` `center` `end` `stretch`              | `stretch` |

### Container

Centers content, adds a max width, and applies the layout gutter as
horizontal padding.

| Prop   | Values              | Default |
| ------ | ------------------- | ------- |
| `size` | `sm` `md` `lg` `xl` | `xl`    |

### Divider

An `<hr>`. It sets `aria-orientation="vertical"` when vertical. Use a vertical
divider inside a row `Stack`.

| Prop          | Values                      | Default      |
| ------------- | --------------------------- | ------------ |
| `orientation` | `horizontal` `vertical`     | `horizontal` |
| `tone`        | `subtle` `default` `strong` | `default`    |

---

## Typography

### Heading

| Prop    | Values                                                  | Default                        |
| ------- | ------------------------------------------------------- | ------------------------------ |
| `level` | `1`–`6`, which renders `h1`–`h6`                        | `2`                            |
| `size`  | `display` `h1` `h2` `h3` `h4` `h5` `h6`                 | matches `level`                |
| `color` | `primary` `secondary` `brand` `inverse`                 | `primary`                      |

Set `level` from the document outline and `size` from the visual design, e.g.
`<Heading level={2} size="h4">`.

### Text

| Prop      | Values                                                                                           | Default                                   |
| --------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `variant` | `body` `caption`                                                                                 | `body`                                    |
| `as`      | `p` `span` `div` `label` `strong` `em` `small` `figcaption` `legend` `li` `dt` `dd` `blockquote` `time` `abbr` | `p` for `body`, `span` for `caption` |
| `size`    | `xs` `sm` `md` `lg`                                                                              | set by `variant`                          |
| `weight`  | `regular` `medium` `semibold` `bold`                                                             | set by `variant`                          |
| `color`   | `primary` `secondary` `tertiary` `disabled` `brand` `inverse` `danger` `success` `warning` `info` | inherits                                 |

The props of the element you pick with `as` are typed, e.g.
`<Text as="time" dateTime="…">`.

### Label

A styled `<label>`. Pass `htmlFor` yourself. Inside a `FormField`, use
`FormField.Label`, which wires `htmlFor` for you.

| Prop       | Type / values | Default | Notes                                                                             |
| ---------- | ------------- | ------- | --------------------------------------------------------------------------------- |
| `size`     | `sm` `md`     | `md`    |                                                                                   |
| `disabled` | `boolean`     | `false` | dims the label                                                                    |
| `required` | `boolean`     | `false` | shows a visual `*` only, so the control still needs `required`                    |

### Link

An `<a>` that inherits the surrounding typography. For an action that doesn't
navigate, use a `Button` (`variant="link"` if it should look like a link).

| Prop       | Values / type                 | Default  | Notes                                                                 |
| ---------- | ----------------------------- | -------- | --------------------------------------------------------------------- |
| `variant`  | `inline` `standalone`         | `inline` | `inline` is always underlined (links in running text); `standalone` underlines on hover and focus |
| `external` | `boolean`                     | `false`  | sets `target="_blank"` + `rel="noopener noreferrer"`, shows an arrow and adds "(opens in a new tab)" for screen readers |
| `as`       | element or component          | `a`      | e.g. your router's link; it receives `href`/`to`, `className` and the rest |

```tsx
<Text>Read the <Link href="/docs">docs</Link> first.</Text>
<Link as={RouterLink} to="/settings" variant="standalone">Settings</Link>
```

### Kbd

A keyboard key (`<kbd>`). Render one per key: `<Kbd>⌘</Kbd> <Kbd>K</Kbd>`.
Give a symbol key a `title` / `aria-label` with its name (e.g. "Command").

### VisuallyHidden

Hides content visually but keeps it readable by screen readers. `as` accepts
any element (default `span`). Set `focusable` to show the content while it has
focus, e.g. for a skip link.

---

## Actions

### Button

| Prop      | Values                                                 | Default    |
| --------- | ------------------------------------------------------ | ---------- |
| `variant` | `primary` `secondary` `tertiary` `accent` `success` `info` `outline` `danger` `ghost` `link` | `primary` |
| `size`    | `sm` `md` `lg`                                         | `md`       |
| `type`    | native                                                 | `'button'` |

Every native `<button>` prop is accepted. Set `type="submit"` explicitly to
submit a form.

**`Button.Icon`** places an icon before or after the label and sizes it to
match the Button. It takes the SVG as `children` and is always decorative. An
icon-only Button needs `aria-label`:

```tsx
<Button variant="ghost" aria-label="Close">
  <Button.Icon><Cross2Icon /></Button.Icon>
</Button>
```

---

## Form controls

### FormField

Lays out a label, control, hint, and errors, and wires them together
(`htmlFor`, `aria-labelledby`, `aria-describedby`, `aria-invalid`). It holds
**no form state**: the value, validation, and error messages come from you
(`useState`, React Hook Form, server errors, …).

| Prop        | Type      | Default                                   |
| ----------- | --------- | ----------------------------------------- |
| `invalid`   | `boolean` | `true` while any `FormField.Error` is rendered |
| `disabled`  | `boolean` | passed to the control; dims the label     |
| `required`  | `boolean` | passed to the control; shows the label's `*` |
| `controlId` | `string`  | generated                                 |

Parts (all must be inside a `FormField`; `Label`, `Hint` and `Error` throw
outside one):

| Part                  | Renders                                   | Notes                                                                 |
| --------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `FormField.Label`     | `Label`                                   | `htmlFor`, `required`, `disabled` come from the field                 |
| `FormField.Input`     | `Input`                                   | takes `Input` props                                                   |
| `FormField.Textarea`  | `Textarea`                                | takes `Textarea` props                                                |
| `FormField.Control`   | render function                           | `{(props) => <MyInput {...props} />}`: wires any custom control       |
| `FormField.Hint`      | `<p>`                                     | becomes part of the control's description                             |
| `FormField.Error`     | `<div>`                                   | render it conditionally; it marks the field invalid while rendered    |

`useFormFieldControl(props)` is the hook version of `FormField.Control`. It
merges the field's wiring into props; props you set on the control win, and
outside a field the props come back unchanged. Cascade's `Select`, `Combobox`
and `Autocomplete` wire themselves.

Render the parts as direct children of `FormField` (fragments and
conditionals are fine) so they are wired on the first render.

```tsx
<FormField required invalid={!!errors.email}>
  <FormField.Label>Email</FormField.Label>
  <FormField.Input type="email" {...register('email')} />
  <FormField.Hint>We never share it.</FormField.Hint>
  {errors.email && <FormField.Error>{errors.email.message}</FormField.Error>}
</FormField>
```

### Input

A single-line text `<input>`. Props other than `start`, `end` and `className`
go to the input, and `ref` points to it. Inside a `FormField`, use
`FormField.Input`, which takes the same props. Without a label, name it with
`aria-label`.

| Prop    | Values / type | Default | Notes                                                                 |
| ------- | ------------- | ------- | --------------------------------------------------------------------- |
| `size`  | `sm` `md` `lg` | `md`   |                                                                       |
| `start` | `ReactNode`   | none    | before the text, sized as an icon (e.g. a search icon); clicks on it focus the input |
| `end`   | `ReactNode`   | none    | after the text, sized as an icon; a `button` or `a` here stays clickable (give it an `aria-label`) |

With `start` or `end`, the input is wrapped in a `<span>` that takes
`className`; without them `className` goes on the input.

```tsx
<Input type="search" aria-label="Search" start={<MagnifyingGlassIcon />} />
```

### Select

Picks one value from a list. Built on Base UI `Select.Root`, so it takes
all of its props (except `multiple`): `value`, `defaultValue`,
`onValueChange`, `items`, `name`, `disabled`, `required`, `open`,
`onOpenChange`, …. Pass `items` (an array of `{ value, label }` or a
`value → label` record) so the trigger shows the option's label rather than
its raw value. The root renders no element.

| Part                  | Props                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `Select.Label`        | the visible label when the Select is not inside a `FormField`                                   |
| `Select.Trigger`      | `size`: `sm` `md` `lg` (default `md`); `placeholder`; renders the value and a chevron itself     |
| `Select.Content`      | `alignItemWithTrigger` (default `true`, like a native select); `side`: `top` `bottom` (default `bottom`) |
| `Select.Item`         | `value` (required), `disabled`; `children` is the option label; shows a check mark while selected |
| `Select.Group`        | groups items                                                                                    |
| `Select.GroupLabel`   | names a group                                                                                   |
| `Select.Separator`    | a line between items or groups                                                                  |

Inside a `FormField`, the field's label, hint, error, `disabled` and
`required` apply automatically, so leave out `Select.Label`:

```tsx
const fruits = [{ value: 'apple', label: 'Apple' }, { value: 'pear', label: 'Pear' }];

<FormField>
  <FormField.Label>Fruit</FormField.Label>
  <Select items={fruits} value={fruit} onValueChange={setFruit}>
    <Select.Trigger placeholder="Pick one" />
    <Select.Content>
      {fruits.map((f) => <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>)}
    </Select.Content>
  </Select>
</FormField>
```

### Combobox

A Select whose options the user filters by typing, for long lists. The value
must be one of the options; for free text with suggestions, use
[Autocomplete](#autocomplete). Built on Base UI `Combobox.Root` (single
selection), so it takes all of its props: `items`, `value`, `defaultValue`,
`onValueChange`, `inputValue`, `filter`, `autoHighlight`, `name`, `disabled`,
`required`, `readOnly`, `open`, `onOpenChange`, …. Pass `items` and render
them from `Combobox.Content`'s function child, so filtering works out of the
box. For object items, set `itemToStringLabel`. The root renders no element.

| Part                  | Props                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `Combobox.Input`      | `size`: `sm` `md` `lg` (default `md`); `triggerLabel` names the chevron (default `"Show options"`); other input props; `className` goes on the wrapper |
| `Combobox.Content`    | `children`: items, or `(item) => <Combobox.Item …/>`; `emptyMessage` when nothing matches; `side`: `top` `bottom` (default `bottom`) |
| `Combobox.Item`       | `value` (required), `disabled`; `children` is the option label; shows a check mark while selected |
| `Combobox.Group`      | groups items; with grouped `items`, pass the group's `items`                                    |
| `Combobox.GroupLabel` | names a group                                                                                   |
| `Combobox.Collection` | inside a group, `(item) => …` renders the group's matching items                                |
| `Combobox.Separator`  | a line between items or groups                                                                  |

Name the input with a `FormField` (its label, hint, error, `disabled` and
`required` apply automatically), a `<label htmlFor>`, or `aria-label`.

```tsx
<FormField>
  <FormField.Label>Time zone</FormField.Label>
  <Combobox items={timezones} value={timezone} onValueChange={setTimezone}>
    <Combobox.Input placeholder="Search time zones" />
    <Combobox.Content emptyMessage="No time zones found.">
      {(tz: string) => <Combobox.Item key={tz} value={tz}>{tz}</Combobox.Item>}
    </Combobox.Content>
  </Combobox>
</FormField>
```

### Autocomplete

A text input that suggests values while the user types. The value is the
text itself (`value` / `defaultValue` / `onValueChange` are strings): picking
a suggestion fills the input, and any other text is allowed too. Built on
Base UI `Autocomplete.Root`, so it takes all of its props (`items`, `mode`,
`filter`, `name`, `disabled`, `required`, `open`, `onOpenChange`, …).

Parts match [Combobox](#combobox)'s: `Autocomplete.Content`,
`Autocomplete.Item` (no check mark), `Autocomplete.Group`,
`Autocomplete.GroupLabel`, `Autocomplete.Collection` and
`Autocomplete.Separator`. `Autocomplete.Input` takes `size` and `start` (an
icon before the text, as on [Input](#input)) instead of a chevron.

```tsx
<FormField>
  <FormField.Label>Label</FormField.Label>
  <Autocomplete items={tags}>
    <Autocomplete.Input start={<MagnifyingGlassIcon />} />
    <Autocomplete.Content emptyMessage="No matching labels.">
      {(tag: string) => <Autocomplete.Item key={tag} value={tag}>{tag}</Autocomplete.Item>}
    </Autocomplete.Content>
  </Autocomplete>
</FormField>
```

### Checkbox

A native `<input type="checkbox">`. Props other than `className` go to the
input, and `ref` points to the input. `children` is the inline label; when
`children` is set, the checkbox is wrapped in a `<label>`. Set
`indeterminate` to show the mixed state. Without `children`, name it with
`aria-label`. Group related checkboxes like radios: a shared `name`, inside a
`fieldset` with a `legend`.

### Radio

A native `<input type="radio">` with the same `children` / `className` / `ref`
behavior as Checkbox. Group radios with a shared `name`, and wrap the group in
a `fieldset` with a `legend` (e.g. `<Stack as="fieldset">` plus
`<Text as="legend">`).

### Switch

A native `<input type="checkbox" role="switch">`: use `checked` /
`defaultChecked` / `onChange`. It follows the same `children` / `className`
rules as Checkbox. Put `Switch.IconOn` / `Switch.IconOff` (SVG as `children`)
among the children to show an icon in the thumb; they're pulled out of the
label automatically. `color`: `primary` `secondary` `tertiary` `accent` `success` `info` `danger` (default `primary`) sets the on-state color.

```tsx
<Switch checked={on} onChange={(e) => setOn(e.target.checked)}>
  <Switch.IconOn><CheckIcon /></Switch.IconOn>
  Notifications
</Switch>
```

### Slider

Picks a number by dragging or with the arrow keys (Page Up/Down move by
`largeStep`, Home/End jump to `min`/`max`). Pass an array as `value` /
`defaultValue` for a range: one thumb per entry. Built on Base UI
`Slider.Root`, so it takes `value`, `defaultValue`, `onValueChange`,
`onValueCommitted`, `min` (`0`), `max` (`100`), `step` (`1`), `largeStep`,
`format`, `name`, `disabled`, ….

| Prop               | Type                                      | Notes                                                    |
| ------------------ | ----------------------------------------- | -------------------------------------------------------- |
| `label`            | `ReactNode`                               | visible label, which names the slider                    |
| `aria-label`       | `string`                                  | names a single-thumb slider without `label`              |
| `thumbLabels`      | `string[]`                                | names each thumb of a range, e.g. `['Minimum price', 'Maximum price']` |
| `color`            | `primary` `secondary` `tertiary` `accent` `success` `info` `danger` | fill and thumb border, default `primary`    |
| `showValue`        | `boolean`, default `false`                | shows the formatted value (`20 – 80` for a range)        |
| `getAriaValueText` | `(formatted, value, index) => string`     | spoken value when the number isn't enough, e.g. `"$40"`  |

```tsx
<Slider label="Price" defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} showValue />
```

### Textarea

A styled `<textarea>`. `size`: `sm` `md` `lg` (default `md`); `rows` defaults
to `3`. Inside a `FormField`, use `FormField.Textarea`.

---

## Display

### Icon

A box that sizes and colors an SVG, which you pass as `children`.

| Prop    | Values                                                   | Default   |
| ------- | -------------------------------------------------------- | --------- |
| `size`  | `xs` `sm` `md` `lg` `xl`                                 | `md`      |
| `color` | `current` `primary` `secondary` `brand` `inverse` `disabled` | `current` |
| `label` | `string`                                                 | none      |

With `label`, the icon is announced (`role="img"`). Without it, the icon is
decorative (`aria-hidden`). Inside a Button, use `Button.Icon` instead.

### Avatar

A person's picture, with their initials (or `fallback`) while the image
loads, when it fails, or without `src`. It is one image (`role="img"`) named
`name`.

| Prop       | Values / type               | Default                    |
| ---------- | --------------------------- | -------------------------- |
| `name`     | `string` (required)         | names it and gives the initials ("Ada Lovelace" → "AL") |
| `src`      | `string`                    | none                       |
| `fallback` | `ReactNode`                 | the initials of `name`     |
| `size`     | `xs` `sm` `md` `lg` `xl`    | `md`                       |

When the name is already shown next to it, pass `aria-hidden` so it isn't
announced twice.

### Badge

A short status label (`<span>`), not interactive.

| Prop   | Values                                                          | Default   |
| ------ | --------------------------------------------------------------- | --------- |
| `tone` | `neutral` `primary` `secondary` `success` `warning` `danger` `info` | `neutral` |
| `size` | `sm` `md`                                                       | `md`      |

### Tag

A Badge that can be removed. It takes the same `tone` / `size` as Badge.

| Prop          | Type                  | Notes                                                        |
| ------------- | --------------------- | ------------------------------------------------------------ |
| `onRemove`    | `(event) => void`     | when set, renders an × button that calls this handler        |
| `removeLabel` | `string`              | the × button's accessible name; defaults to `"Remove {children}"` |

### Card

A bordered surface. All parts are optional.

| Prop / part     | Notes                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| `as`            | `div` (default) `article` `section` `li`                                                 |
| `background`    | `default` `subtle` `brand` `secondary` `tertiary` `accent` `success` `info` `danger` (default `default`); each sets the fill and its own border (and the hover border of an `interactive` card) |
| `interactive`   | `boolean`, default `false`; lifts on hover and on focus inside. Use it for a card with one main link or button |
| `hover`         | `boolean`, default `true`; on an `interactive` card, `false` removes the pointer hover lift and border change (the focus lift stays) |
| `Card.Header`   | stacks the title and subtitle                                                            |
| `Card.Title`    | `as`: `h2` `h3` (default) `h4` `h5` `h6`; match it to the page outline                   |
| `Card.Subtitle` | `<p>`                                                                                    |
| `Card.Body`     | main content                                                                             |
| `Card.Footer`   | a row of actions aligned to the end                                                      |

```tsx
<Card as="article">
  <Card.Header>
    <Card.Title>Revenue</Card.Title>
    <Card.Subtitle>Last 30 days</Card.Subtitle>
  </Card.Header>
  <Card.Body>…</Card.Body>
  <Card.Footer><Button variant="secondary">Details</Button></Card.Footer>
</Card>
```

### Accordion

A stack of sections that expand and collapse. Each trigger is a button inside
a heading, and Enter/Space toggle it.

| Part / prop         | Notes                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------- |
| `Accordion`         | `value` + `onValueChange(values)` (controlled) or `defaultValue` (the open items' values); `background`: `default` `subtle` `surface` `brand` `secondary` (default `default`: transparent with dividers; the others are a filled, bordered, rounded block); `multiple` lets several stay open (default `false`); `disabled`; `hiddenUntilFound` lets find-in-page open matching panels |
| `Accordion.Item`    | `value` (`string \| number`, generated when unset), `disabled`                           |
| `Accordion.Trigger` | the section title; `headingLevel`: `2`–`6` (default `3`), to fit the page outline       |
| `Accordion.Panel`   | the section content                                                                     |

```tsx
<Accordion defaultValue={['billing']}>
  <Accordion.Item value="billing">
    <Accordion.Trigger>Billing</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Progress

A progress bar (`role="progressbar"`). Name it with `label` or `aria-label`.

| Prop               | Values / type                      | Default   | Notes                                                 |
| ------------------ | ---------------------------------- | --------- | ----------------------------------------------------- |
| `value`            | `number \| null` (required)        |           | `null` is indeterminate: a bar sweeps across the track |
| `min` / `max`      | `number`                           | `0` / `100` |                                                     |
| `label`            | `ReactNode`                        | none      | visible label above the bar                           |
| `showValue`        | `boolean`                          | `false`   | shows the formatted value (a percentage by default)   |
| `format`           | `Intl.NumberFormatOptions`         | percent   |                                                       |
| `getAriaValueText` | `(formatted, value) => string`     | none      | e.g. `"3 of 8 files"`                                 |
| `size`             | `sm` `md`                          | `md`      | track height                                          |
| `tone`             | `default` `success` `danger`       | `default` | fill color                                            |

### Spinner

A loading indicator with `role="status"`. `size`: `sm` `md` `lg` (default
`md`); `color`: `primary` `neutral` `secondary` `tertiary` `accent` `success` `info` `danger` (default `primary`); `label` is the announced text (default `"Loading"`).

### Skeleton

A decorative loading placeholder, hidden from assistive technology. Announce
the loading state elsewhere (`aria-busy` on the region, or a `Spinner`).

| Prop     | Values                        | Default                                        |
| -------- | ----------------------------- | ---------------------------------------------- |
| `shape`  | `rect` `text` `circle`        | `rect`                                         |
| `color`  | `gray` `primary` `secondary` `tertiary` `accent` `success` `info` `danger` | `gray`                  |
| `width`  | `number` (px) or CSS length   | full width (`circle`: token size)              |
| `height` | `number` (px) or CSS length   | token height; a `circle` needs only one of the two |

---

## Feedback

### Alert

An inline message that stays on the page. For a temporary notification, use
[Toast](#toast).

| Prop           | Values / type                          | Default                       |
| -------------- | -------------------------------------- | ----------------------------- |
| `tone`         | `info` `success` `warning` `danger`    | `info`                        |
| `layout`       | `inline` `banner` (edge-to-edge)        | `inline`                      |
| `icon`         | `ReactNode`                            | none                          |
| `onDismiss`    | `(event) => void`                      | when set, shows an × button   |
| `dismissLabel` | `string`                               | `"Dismiss"`                   |

- The role follows the tone: `warning` / `danger` get `role="alert"`, which
  interrupts; `info` / `success` get `role="status"`, which is announced
  politely. Pass `role` to override.
- Parts: `Alert.Title` (`<p>`) and `Alert.Description` (`<div>`).

### Toast

Mount `<Toast>` **once** near the root, inside `ThemeProvider`. It renders its
children plus the toast viewport.

| `Toast` prop   | Type             | Notes                                                    |
| -------------- | ---------------- | -------------------------------------------------------- |
| `timeout`      | `number` (ms)    | default auto-dismiss time; `0` turns auto-dismiss off    |
| `limit`        | `number`         | how many toasts show at once                             |
| `manager`      | `ToastManager`   | from `Toast.createManager()`, to show toasts outside React |
| `dismissLabel` | `string`         | default `"Dismiss"`                                      |

Show toasts from a component with `Toast.useToast()`, or from outside React
with `Toast.createManager()` (pass the manager to `<Toast manager>`). Both
return `{ add(options) => id, close(id?) }`.

`ToastOptions`: `title`, `description`, `icon`, `tone` (`neutral` (default) `info`
`success` `warning` `danger`), `timeout`, `priority` (`high` for `danger`,
`low` otherwise), `action: { label, onClick }` (renders one button, e.g.
Undo), `onClose`, and `id`. Adding a toast with the `id` of an open toast
updates that toast in place.

```tsx
const toast = Toast.useToast();
toast.add({ title: 'Saved', tone: 'success', action: { label: 'Undo', onClick: undo } });
```

---

## Overlays

All overlays share the root props `open`, `defaultOpen` and
`onOpenChange(open)`, and put their content in a `*.Content` part that
portals to `<body>`.

### Dialog

A modal window. It traps focus, locks page scroll, closes on Escape, a
backdrop click, or `Dialog.Close`, and returns focus to the trigger.

| Part                 | Notes                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| `Dialog.Trigger`     | a Button                                                                   |
| `Dialog.Content`     | backdrop plus the window; `size`: `sm` (default) `md`; `className`         |
| `Dialog.Title`       | `<h2>`; always include one, because it names the dialog                    |
| `Dialog.Description` | `<p>`                                                                      |
| `Dialog.Actions`     | a row of buttons aligned to the end                                        |
| `Dialog.Close`       | a Button that closes the dialog                                            |

```tsx
<Dialog>
  <Dialog.Trigger variant="danger">Delete</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Delete project?</Dialog.Title>
    <Dialog.Description>This can't be undone.</Dialog.Description>
    <Dialog.Actions>
      <Dialog.Close variant="ghost">Cancel</Dialog.Close>
      <Button variant="danger" onClick={remove}>Delete</Button>
    </Dialog.Actions>
  </Dialog.Content>
</Dialog>
```

To open a Dialog without `Dialog.Trigger` (e.g. from a menu item), control
it: `<Dialog open={open} onOpenChange={setOpen}>`.

### Popover

A non-modal panel anchored to its trigger. It opens on click and closes on
Escape, an outside click, or `Popover.Close`.

Parts: `Popover.Trigger` (Button); `Popover.Content` (`side`: `top`
`bottom` (default) `left` `right`; `align`: `start` `center` (default)
`end`; `className`); `Popover.Title` (`<h2>`); `Popover.Description`
(`<p>`); `Popover.Close` (Button).

### DropdownMenu

A list of actions opened from a button, with arrow-key navigation and
typeahead. Use it for actions; to choose a value, use [Select](#select).

| Part                      | Notes                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `DropdownMenu.Trigger`    | a Button                                                                                    |
| `DropdownMenu.Content`    | `side` (default `bottom`), `align` (default `start`), `className`                           |
| `DropdownMenu.Item`       | `onClick` (fires on click, Enter, or Space), `disabled`, `closeOnClick`; `variant`: `default` `danger` |
| `DropdownMenu.Group`      | groups items                                                                                |
| `DropdownMenu.GroupLabel` | names a group                                                                               |
| `DropdownMenu.Separator`  | a line between groups                                                                       |

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger variant="ghost" aria-label="More actions">
    <Button.Icon><DotsHorizontalIcon /></Button.Icon>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onClick={rename}>Rename</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item variant="danger" onClick={() => setConfirmOpen(true)}>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

### Tooltip

A short text hint shown on hover or keyboard focus. It is supplementary: the
trigger still needs its own accessible name (visible text or `aria-label`),
and anything essential belongs in a Popover or visible text instead.

| Part               | Notes                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| `Tooltip`          | root; also takes `disabled`                                               |
| `Tooltip.Provider` | wraps a group (e.g. a toolbar) to share `delay` / `closeDelay` (ms)       |
| `Tooltip.Trigger`  | a Button; also takes `delay` / `closeDelay`                               |
| `Tooltip.Content`  | `side` (default `top`), `align` (default `center`), `className`           |

```tsx
<Tooltip>
  <Tooltip.Trigger variant="ghost" aria-label="Copy">
    <Button.Icon><CopyIcon /></Button.Icon>
  </Tooltip.Trigger>
  <Tooltip.Content>Copy to clipboard</Tooltip.Content>
</Tooltip>
```

---

## Navigation

### Tabs

Switches between panels. Arrow keys move between tabs, and Home/End jump to
the first/last tab.

| Part         | Props                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `Tabs`       | `value` + `onValueChange(value)` (controlled) or `defaultValue` (default: the first enabled tab); values are `string \| number` |
| `Tabs.List`  | the tab row; add `aria-label` when nothing else names it; `activateOnFocus` switches tabs as focus moves |
| `Tabs.Tab`   | `value` (required); its text names the panel                                                           |
| `Tabs.Panel` | `value` (required, matches a Tab's `value`); `keepMounted` keeps it in the DOM while hidden            |

```tsx
<Tabs defaultValue="overview">
  <Tabs.List aria-label="Project">
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">…</Tabs.Panel>
  <Tabs.Panel value="settings">…</Tabs.Panel>
</Tabs>
```

### Breadcrumb

The path from the site root to the current page: a `nav` named "Breadcrumb"
(override with `aria-label`) around an ordered list, with a chevron between
items.

`color`: `neutral` `primary` `secondary` `tertiary` `accent` `success` `info` `danger` (default `neutral`) sets the text color of the whole trail.

`Breadcrumb.Item` is a link (`href`, and `as` for your router's link, like
[Link](#link)). Mark the last item `current`: it renders as text with
`aria-current="page"`.

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/projects">Projects</Breadcrumb.Item>
  <Breadcrumb.Item current>Cascade</Breadcrumb.Item>
</Breadcrumb>
```

### Pagination

Previous/next controls and page numbers in a `nav` named "Pagination"
(override with `aria-label`). Distant pages collapse into an ellipsis, and
the number of controls stays the same as the page changes. It holds no
state: pass `page` and update it in `onPageChange`.

| Prop            | Type                          | Default                 | Notes                                            |
| --------------- | ----------------------------- | ----------------------- | ------------------------------------------------ |
| `page`          | `number` (required)           |                         | the current page, starting at 1                  |
| `pageCount`     | `number` (required)           |                         |                                                  |
| `onPageChange`  | `(page) => void`              |                         | not called for the current page                  |
| `getHref`       | `(page) => string`            | none                    | makes the pages links instead of buttons         |
| `siblingCount`  | `number`                      | `1`                     | pages on each side of the current one            |
| `size`          | `sm` `md`                     | `md`                    |                                                  |
| `previousLabel` / `nextLabel` | `string`        | `"Previous page"` / `"Next page"` |                                        |
| `getPageLabel`  | `(page) => string`            | `` (page) => `Page ${page}` `` | each page control's name                  |

```tsx
<Pagination page={page} pageCount={20} onPageChange={setPage} />
```

---

## Choosing a component

| Need                                              | Use                                       |
| ------------------------------------------------- | ----------------------------------------- |
| Message that stays on the page                    | `Alert`                                   |
| Temporary notification after an action            | `Toast` (`useToast().add`)                |
| Confirmation or focused task that blocks the page | `Dialog`                                  |
| Extra content or a small form next to a control   | `Popover`                                 |
| A list of actions                                 | `DropdownMenu`                            |
| Choose one value from a list                      | `Select` (in a `FormField`)               |
| Choose one value from a long list, by typing      | `Combobox`                                |
| Free text with suggestions (search, labels)       | `Autocomplete`                            |
| Pick a number or range on a scale                 | `Slider`                                  |
| Choose one of 2–5 visible options                 | `Radio` group                             |
| On/off setting that applies immediately           | `Switch`                                  |
| On/off inside a form that's submitted later       | `Checkbox`                                |
| Text input with a label and validation            | `FormField` + `FormField.Input`           |
| Text input without a field (search bar, filter)   | `Input` with `aria-label`                 |
| Navigate to another page                          | `Link` (an action that doesn't navigate: `Button`) |
| Sections that expand and collapse                 | `Accordion`                               |
| Progress of a task with a known length            | `Progress`                                |
| A person                                          | `Avatar`                                  |
| Where the current page sits in the hierarchy      | `Breadcrumb`                              |
| Move between pages of a list or table             | `Pagination`                              |
| Show a keyboard shortcut                          | `Kbd`                                     |
| Static status label                               | `Badge`                                   |
| Removable filter or selection chip                | `Tag` with `onRemove`                     |
| Hint for an icon-only button                      | `Tooltip` (plus `aria-label` on the trigger) |
| Loading content with a known shape                | `Skeleton`                                |
| Loading of unknown shape, or an action in progress | `Spinner`                                |
| Spacing between siblings                          | `Stack` / `Grid` `gap`, not margins       |
| Rearrange layout at a breakpoint                  | `className` with `@media ${media.md}`     |
| Render a different subtree at a breakpoint        | `useBreakpoint`                           |
