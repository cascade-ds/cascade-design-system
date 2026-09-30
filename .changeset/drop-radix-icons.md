---
'@cascade-ds/components': minor
---

Drop the `@radix-ui/react-icons` dependency. Components now ship only the icons they need to work (checkmark, chevrons, dismiss and remove ×). `Alert` and `Toast` no longer add a default tone icon: pass `icon` to `Alert`, or `icon` in the `Toast` options, to show one.
