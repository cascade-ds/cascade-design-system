---
'@cascade-ds/components': patch
---

Fix broken type declarations: the published `.d.ts` files imported through the internal `#/` alias, which consumers' TypeScript can't resolve, so props such as `children` and `as` were missing on `Grid`, `Stack`, `Container` and others. The source now uses relative imports only, and ESLint blocks path aliases.
