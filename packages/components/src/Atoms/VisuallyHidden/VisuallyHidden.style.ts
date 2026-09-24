import { css } from '@linaria/core';
import { cva } from 'class-variance-authority';

// The standard "sr-only" mechanics. These literals are structural (they
// remove the box from view while keeping it in the accessibility tree), not
// design values, so they are intentionally not tokens.
const srOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

const hiddenCss = css`
  ${srOnly}
`;

// Hidden only while nothing inside it has focus, so a skip link becomes
// visible (with its own natural styles) when a keyboard user tabs to it.
const focusableCss = css`
  &:not(:focus):not(:focus-within) {
    ${srOnly}
  }
`;

export const visuallyHiddenVariant = cva('', {
  variants: {
    focusable: {
      false: hiddenCss,
      true: focusableCss,
    },
  },
  defaultVariants: {
    focusable: false,
  },
});
