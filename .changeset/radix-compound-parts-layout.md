---
'@cascade-ds/components': minor
'@cascade-ds/styles': minor
---

Compound components follow the Radix pattern, and the layout components get new options.

- **Breaking: compound parts are namespaces.** Parts are no longer attached as properties (`Dialog.Trigger = DialogTrigger`), which broke SSR and server/client boundaries. Each compound is now a namespace, and its root is `Name.Root`: write `<Dialog.Root>`, `<Button.Root>` and `<Card.Root>` instead of `<Dialog>`, `<Button>` and `<Card>`. Affects Accordion, Alert, Autocomplete, Breadcrumb, Button, Card, Combobox, Dialog, DropdownMenu, FormField, Popover, Select, Switch, Tabs, Toast and Tooltip. `Toast.useToast` and `Toast.createManager` stay on the namespace.
- **Stack.** `align` adds `baseline`, `justify` adds `around` and `evenly`, and a new `padding` variant (`none` to `xl`).
- **Grid.** New `justify` and `padding` variants, plus `columns="auto"` with `minChildWidth` for card grids that reflow without media queries.
- **Button.** The `ghost` variant fills with the primary color on hover and press, with `on-primary` text.
- **Card.** In light mode the default card has a stronger outline, and the secondary, tertiary and accent cards have stronger fills and borders. Dark mode is unchanged.
- **Tokens.** New `semantic.color.border.card` and `semantic.color.brand.{secondary,tertiary,accent}-{surface,border}`, plus `component.button.color.ghost.text.{hover,active}`.
