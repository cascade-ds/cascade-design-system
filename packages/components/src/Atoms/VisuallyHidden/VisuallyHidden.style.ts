import { css } from '@linaria/core';
import { cva } from 'class-variance-authority';

// These sr-only literals are structural, not design values, so they aren't tokens.
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
