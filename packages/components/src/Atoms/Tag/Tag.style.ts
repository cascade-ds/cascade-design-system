import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';
import { badgeBaseCss, badgeSizes, badgeTones } from '../Badge/Badge.style';

// Tag reuses the badge tokens (`component.badge` is "badge / status pill /
// tag"), so its shape and tones stay in lockstep with Badge.
export const tagVariant = cva(badgeBaseCss, {
  variants: {
    tone: badgeTones,
    size: badgeSizes,
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});

export const tagRemoveButtonCss = css`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  margin: 0;
  padding: ${semantic.spacing.xs};
  border: ${semantic.border.width.none};
  border-radius: ${component.badge.radius};
  background-color: ${semantic.color.background.transparent};
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: background-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};

  /* Invisible hit area so the target meets the minimum pointer size without
     growing the tag. */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${component.badge.remove.hitArea};
    height: ${component.badge.remove.hitArea};
    transform: translate(-50%, -50%);
  }

  &:hover {
    background-color: ${component.badge.remove.color.background.hover};
  }

  &:active {
    background-color: ${component.badge.remove.color.background.active};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  & > svg {
    width: ${component.badge.remove.iconSize};
    height: ${component.badge.remove.iconSize};
    pointer-events: none;
  }
`;
