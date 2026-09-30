---
'@cascade-ds/components': patch
---

Emit one module per source file so bundlers can tree-shake. Importing a single export, such as `useTheme`, no longer pulls in Base UI for every component.
