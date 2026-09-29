import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseProgressCss = css`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  row-gap: ${semantic.gap.xs};
  column-gap: ${semantic.gap.sm};
  width: 100%;
  font-family: ${semantic.typography.labelMd.fontFamily};
  font-size: ${semantic.typography.labelMd.fontSize};
  font-weight: ${semantic.typography.labelMd.fontWeight};
  line-height: ${semantic.typography.labelMd.lineHeight};
  letter-spacing: ${semantic.typography.labelMd.letterSpacing};
`;

const sizes = {
  sm: css`
    --cascade-progress-height: ${component.progress.height.sm};
  `,
  md: css`
    --cascade-progress-height: ${component.progress.height.md};
  `,
};

const tones = {
  default: css`
    --cascade-progress-fill: ${component.progress.color.fill};
  `,
  success: css`
    --cascade-progress-fill: ${component.progress.color.fillSuccess};
  `,
  danger: css`
    --cascade-progress-fill: ${component.progress.color.fillDanger};
  `,
};

export const progressVariant = cva(baseProgressCss, {
  variants: {
    size: sizes,
    tone: tones,
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

export const progressLabelCss = css`
  grid-column: 1;
  color: ${semantic.color.text.primary};
`;

export const progressValueCss = css`
  grid-column: 2;
  color: ${semantic.color.text.secondary};
  font-variant-numeric: tabular-nums;
`;

export const progressTrackCss = css`
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
  height: var(--cascade-progress-height);
  border-radius: ${component.progress.radius};
  background-color: ${component.progress.color.track};
`;

export const progressIndicatorCss = css`
  @keyframes cascade-progress-indeterminate {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  display: block;
  height: 100%;
  border-radius: ${component.progress.radius};
  background-color: var(--cascade-progress-fill);
  transition-property: width;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.standard};

  /* With no value, a bar sweeps across the track to show work is ongoing. */
  &[data-indeterminate] {
    width: 100%;
    animation-name: cascade-progress-indeterminate;
    animation-duration: ${semantic.motion.duration.loop};
    animation-timing-function: ${semantic.motion.easing.standard};
    animation-iteration-count: infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &[data-indeterminate] {
      animation: none;
    }
  }
`;
