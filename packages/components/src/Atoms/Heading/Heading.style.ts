import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseHeadingCss = css`
  margin: ${semantic.spacing.none};
`;

// Visual scale, decoupled from the semantic `level` so e.g. an `h2` can look
// like an `h4`.
const sizes = {
  display: css`
    font-family: ${semantic.typography.display.fontFamily};
    font-size: ${semantic.typography.display.fontSize};
    font-weight: ${semantic.typography.display.fontWeight};
    line-height: ${semantic.typography.display.lineHeight};
    letter-spacing: ${semantic.typography.display.letterSpacing};
  `,
  h1: css`
    font-family: ${semantic.typography.h1.fontFamily};
    font-size: ${semantic.typography.h1.fontSize};
    font-weight: ${semantic.typography.h1.fontWeight};
    line-height: ${semantic.typography.h1.lineHeight};
    letter-spacing: ${semantic.typography.h1.letterSpacing};
  `,
  h2: css`
    font-family: ${semantic.typography.h2.fontFamily};
    font-size: ${semantic.typography.h2.fontSize};
    font-weight: ${semantic.typography.h2.fontWeight};
    line-height: ${semantic.typography.h2.lineHeight};
    letter-spacing: ${semantic.typography.h2.letterSpacing};
  `,
  h3: css`
    font-family: ${semantic.typography.h3.fontFamily};
    font-size: ${semantic.typography.h3.fontSize};
    font-weight: ${semantic.typography.h3.fontWeight};
    line-height: ${semantic.typography.h3.lineHeight};
    letter-spacing: ${semantic.typography.h3.letterSpacing};
  `,
  h4: css`
    font-family: ${semantic.typography.h4.fontFamily};
    font-size: ${semantic.typography.h4.fontSize};
    font-weight: ${semantic.typography.h4.fontWeight};
    line-height: ${semantic.typography.h4.lineHeight};
    letter-spacing: ${semantic.typography.h4.letterSpacing};
  `,
  h5: css`
    font-family: ${semantic.typography.h5.fontFamily};
    font-size: ${semantic.typography.h5.fontSize};
    font-weight: ${semantic.typography.h5.fontWeight};
    line-height: ${semantic.typography.h5.lineHeight};
    letter-spacing: ${semantic.typography.h5.letterSpacing};
  `,
  h6: css`
    font-family: ${semantic.typography.h6.fontFamily};
    font-size: ${semantic.typography.h6.fontSize};
    font-weight: ${semantic.typography.h6.fontWeight};
    line-height: ${semantic.typography.h6.lineHeight};
    letter-spacing: ${semantic.typography.h6.letterSpacing};
  `,
};

const colors = {
  primary: css`
    color: ${semantic.color.text.primary};
  `,
  secondary: css`
    color: ${semantic.color.text.secondary};
  `,
  brand: css`
    color: ${semantic.color.text.brand};
  `,
  inverse: css`
    color: ${semantic.color.text.inverse};
  `,
};

// `size` has no default here: Heading.tsx derives it from `level` when omitted.
export const headingVariant = cva(baseHeadingCss, {
  variants: {
    size: sizes,
    color: colors,
  },
  defaultVariants: {
    color: 'primary',
  },
});
