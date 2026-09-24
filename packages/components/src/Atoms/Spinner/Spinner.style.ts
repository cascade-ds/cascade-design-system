import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseSpinnerCss = css`
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }

  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
  vertical-align: middle;
  border-style: solid;
  border-width: ${semantic.border.width.strong};
  border-color: ${semantic.color.border.subtle};
  border-top-color: ${semantic.color.brand.primary};
  border-radius: ${semantic.round.full};
  animation-name: spin;
  animation-duration: ${semantic.motion.duration.loop};
  animation-timing-function: ${semantic.motion.easing.linear};
  animation-iteration-count: infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const sizes = {
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
};

export const spinnerVariant = cva(baseSpinnerCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'md',
  },
});
