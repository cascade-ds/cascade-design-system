import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseTextCss = css`
  margin: ${semantic.spacing.none};
`;

// `size`, `weight` and `color` are declared after `variant` so that, at equal specificity, they override its defaults.
const variants = {
  body: css`
    font-family: ${semantic.typography.bodyMd.fontFamily};
    font-size: ${semantic.typography.bodyMd.fontSize};
    font-weight: ${semantic.typography.bodyMd.fontWeight};
    line-height: ${semantic.typography.bodyMd.lineHeight};
    letter-spacing: ${semantic.typography.bodyMd.letterSpacing};
    color: ${semantic.color.text.primary};
  `,
  caption: css`
    font-family: ${semantic.typography.caption.fontFamily};
    font-size: ${semantic.typography.caption.fontSize};
    font-weight: ${semantic.typography.caption.fontWeight};
    line-height: ${semantic.typography.caption.lineHeight};
    letter-spacing: ${semantic.typography.caption.letterSpacing};
    color: ${semantic.color.text.secondary};
  `,
};

const sizes = {
  xs: css`
    font-size: ${semantic.font.size.xs};
  `,
  sm: css`
    font-size: ${semantic.font.size.sm};
  `,
  md: css`
    font-size: ${semantic.font.size.md};
  `,
  lg: css`
    font-size: ${semantic.font.size.lg};
  `,
};

const weights = {
  regular: css`
    font-weight: ${semantic.font.weight.regular};
  `,
  medium: css`
    font-weight: ${semantic.font.weight.medium};
  `,
  semibold: css`
    font-weight: ${semantic.font.weight.semibold};
  `,
  bold: css`
    font-weight: ${semantic.font.weight.bold};
  `,
};

const colors = {
  primary: css`
    color: ${semantic.color.text.primary};
  `,
  secondary: css`
    color: ${semantic.color.text.secondary};
  `,
  tertiary: css`
    color: ${semantic.color.text.tertiary};
  `,
  disabled: css`
    color: ${semantic.color.text.disabled};
  `,
  brand: css`
    color: ${semantic.color.text.brand};
  `,
  inverse: css`
    color: ${semantic.color.text.inverse};
  `,
  danger: css`
    color: ${semantic.color.feedback.dangerText};
  `,
  success: css`
    color: ${semantic.color.feedback.successText};
  `,
  warning: css`
    color: ${semantic.color.feedback.warningText};
  `,
  info: css`
    color: ${semantic.color.feedback.infoText};
  `,
};

// `size`, `weight` and `color` have no default: when omitted, the values baked into `variant` apply.
export const textVariant = cva(baseTextCss, {
  variants: {
    variant: variants,
    size: sizes,
    weight: weights,
    color: colors,
  },
  defaultVariants: {
    variant: 'body',
  },
});
