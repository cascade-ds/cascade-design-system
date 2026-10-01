import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
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
  border-color: ${component.spinner.color.track};
  border-top-color: var(--cascade-spinner-arc, ${component.spinner.color.primary});
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

const colors = {
  primary: '',
  neutral: css`
    --cascade-spinner-arc: ${component.spinner.color.neutral};
  `,
  secondary: css`
    --cascade-spinner-arc: ${component.spinner.color.secondary};
  `,
  tertiary: css`
    --cascade-spinner-arc: ${component.spinner.color.tertiary};
  `,
  accent: css`
    --cascade-spinner-arc: ${component.spinner.color.accent};
  `,
  success: css`
    --cascade-spinner-arc: ${component.spinner.color.success};
  `,
  info: css`
    --cascade-spinner-arc: ${component.spinner.color.info};
  `,
  danger: css`
    --cascade-spinner-arc: ${component.spinner.color.danger};
  `,
};

export const spinnerVariant = cva(baseSpinnerCss, {
  variants: {
    size: sizes,
    color: colors,
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
