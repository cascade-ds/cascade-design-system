import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseLabelCss = css`
  color: ${semantic.color.text.primary};
  cursor: default;
`;

const sizes = {
  sm: css`
    font-family: ${semantic.typography.labelSm.fontFamily};
    font-size: ${semantic.typography.labelSm.fontSize};
    font-weight: ${semantic.typography.labelSm.fontWeight};
    line-height: ${semantic.typography.labelSm.lineHeight};
    letter-spacing: ${semantic.typography.labelSm.letterSpacing};
  `,
  md: css`
    font-family: ${semantic.typography.labelMd.fontFamily};
    font-size: ${semantic.typography.labelMd.fontSize};
    font-weight: ${semantic.typography.labelMd.fontWeight};
    line-height: ${semantic.typography.labelMd.lineHeight};
    letter-spacing: ${semantic.typography.labelMd.letterSpacing};
  `,
};

const disabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
    cursor: not-allowed;
  `,
  false: '',
};

export const labelVariant = cva(baseLabelCss, {
  variants: {
    size: sizes,
    disabled: disabledStates,
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

const baseRequiredIndicatorCss = css`
  margin-inline-start: ${semantic.spacing.xs};
  color: ${semantic.color.feedback.dangerText};
`;

const requiredIndicatorDisabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
  `,
  false: '',
};

export const requiredIndicatorVariant = cva(baseRequiredIndicatorCss, {
  variants: {
    disabled: requiredIndicatorDisabledStates,
  },
  defaultVariants: {
    disabled: false,
  },
});
