import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseIconCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const sizes = {
  xs: css`
    width: ${semantic.size.icon.xs};
    height: ${semantic.size.icon.xs};
  `,
  sm: css`
    width: ${semantic.size.icon.sm};
    height: ${semantic.size.icon.sm};
  `,
  md: css`
    width: ${semantic.size.icon.md};
    height: ${semantic.size.icon.md};
  `,
  lg: css`
    width: ${semantic.size.icon.lg};
    height: ${semantic.size.icon.lg};
  `,
  xl: css`
    width: ${semantic.size.icon.xl};
    height: ${semantic.size.icon.xl};
  `,
};

const colors = {
  current: '',
  primary: css`
    color: ${semantic.color.icon.primary};
  `,
  secondary: css`
    color: ${semantic.color.icon.secondary};
  `,
  brand: css`
    color: ${semantic.color.icon.brand};
  `,
  inverse: css`
    color: ${semantic.color.icon.inverse};
  `,
  disabled: css`
    color: ${semantic.color.icon.disabled};
  `,
};

export const iconVariant = cva(baseIconCss, {
  variants: {
    size: sizes,
    color: colors,
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});
