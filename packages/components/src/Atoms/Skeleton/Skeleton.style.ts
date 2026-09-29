import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseSkeletonCss = css`
  @keyframes cascade-skeleton-shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--cascade-skeleton-base);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      to right,
      ${semantic.color.background.transparent},
      var(--cascade-skeleton-highlight),
      ${semantic.color.background.transparent}
    );
    transform: translateX(-100%);
    animation-name: cascade-skeleton-shimmer;
    animation-duration: ${component.skeleton.duration};
    animation-timing-function: ${semantic.motion.easing.standard};
    animation-iteration-count: infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
      display: none;
    }
  }
`;

const colors = {
  gray: css`
    --cascade-skeleton-base: ${component.skeleton.color.base};
    --cascade-skeleton-highlight: ${component.skeleton.color.highlight};
  `,
  primary: css`
    --cascade-skeleton-base: ${component.skeleton.color.primary.base};
    --cascade-skeleton-highlight: ${component.skeleton.color.primary.highlight};
  `,
  secondary: css`
    --cascade-skeleton-base: ${component.skeleton.color.secondary.base};
    --cascade-skeleton-highlight: ${component.skeleton.color.secondary.highlight};
  `,
};

const shapes = {
  rect: css`
    height: ${component.skeleton.height};
    border-radius: ${component.skeleton.radius};
  `,
  text: css`
    height: ${component.skeleton.text.height};
    border-radius: ${component.skeleton.text.radius};
  `,
  circle: css`
    width: ${component.skeleton.height};
    height: ${component.skeleton.height};
    border-radius: ${semantic.round.full};
  `,
};

export const skeletonVariant = cva(baseSkeletonCss, {
  variants: {
    color: colors,
    shape: shapes,
  },
  defaultVariants: {
    color: 'gray',
    shape: 'rect',
  },
});
