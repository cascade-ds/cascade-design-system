import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Each `color` variant only sets these two custom properties; the base styles
// and the shimmer read them, so there is a single animation for every color.
// The base stays solid while a highlight band sweeps across it, so the
// placeholder never fades into the page background.
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

// Each shape has a token-driven default size; `width` / `height` props
// override it inline.
const shapes = {
  rect: css`
    height: ${component.skeleton.height};
    border-radius: ${component.skeleton.radius};
  `,
  // A single line of body text.
  text: css`
    height: ${component.skeleton.text.height};
    border-radius: ${component.skeleton.text.radius};
  `,
  // Skeleton.tsx mirrors a lone `width` or `height` so it stays round.
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
