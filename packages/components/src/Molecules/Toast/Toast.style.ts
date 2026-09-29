import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Fixed to the bottom-right corner. Base UI lists the newest toast first, so
// the column is reversed to stack new toasts at the bottom, nearest the edge.
export const toastViewportCss = css`
  position: fixed;
  inset-block-end: ${component.toast.offset};
  inset-inline-end: ${component.toast.offset};
  z-index: ${component.toast.zIndex};
  display: flex;
  flex-direction: column-reverse;
  gap: ${component.toast.stackGap};
  /* Every toast gets the same width, narrowed on small screens. */
  width: min(${component.toast.width}, calc(100vw - 2 * ${component.toast.offset}));
  outline: none;
`;

// Swipe-to-dismiss moves the toast by Base UI's --toast-swipe-movement-*
// variables; `data-starting-style` / `data-ending-style` animate it in and out.
const baseToastCss = css`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: ${component.toast.gap};
  padding: ${component.toast.padding};
  border: ${component.toast.borderWidth} solid ${component.toast.color.border};
  border-radius: ${component.toast.radius};
  background-color: ${component.toast.color.background};
  box-shadow: ${component.toast.shadow};
  color: ${component.toast.color.text};
  font-family: ${component.toast.typography.fontFamily};
  font-size: ${component.toast.typography.fontSize};
  font-weight: ${component.toast.typography.fontWeight};
  line-height: ${component.toast.typography.lineHeight};
  letter-spacing: ${component.toast.typography.letterSpacing};
  transform: translateX(var(--toast-swipe-movement-x)) translateY(var(--toast-swipe-movement-y));
  transition-property: opacity, transform;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.enter};
  user-select: none;

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow}, ${component.toast.shadow};
  }

  &[data-swiping] {
    transition-duration: 0s;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translateY(${component.toast.offset});
  }

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }
  &[data-ending-style][data-swipe-direction='right'] {
    transform: translateX(calc(var(--toast-swipe-movement-x) + 100%));
  }
  &[data-ending-style][data-swipe-direction='down'] {
    transform: translateY(calc(var(--toast-swipe-movement-y) + 100%));
  }

  /* Over the provider's limit: kept mounted (and inert) by Base UI, but hidden. */
  &[data-limited] {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
    }
  }
`;

// Status tones mark the leading edge and the icon; the surface stays neutral
// so stacked toasts read as one group.
const tones = {
  neutral: '',
  info: css`
    border-inline-start: ${component.toast.accentWidth} solid ${component.toast.color.info.accent};
    --cascade-toast-icon-color: ${component.toast.color.info.accent};
  `,
  success: css`
    border-inline-start: ${component.toast.accentWidth} solid
      ${component.toast.color.success.accent};
    --cascade-toast-icon-color: ${component.toast.color.success.accent};
  `,
  warning: css`
    border-inline-start: ${component.toast.accentWidth} solid
      ${component.toast.color.warning.accent};
    --cascade-toast-icon-color: ${component.toast.color.warning.accent};
  `,
  danger: css`
    border-inline-start: ${component.toast.accentWidth} solid ${component.toast.color.danger.accent};
    --cascade-toast-icon-color: ${component.toast.color.danger.accent};
  `,
};

export const toastVariant = cva(baseToastCss, {
  variants: {
    tone: tones,
  },
  defaultVariants: {
    tone: 'neutral',
  },
});

export const toastIconCss = css`
  color: var(--cascade-toast-icon-color);
`;

export const toastContentCss = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${component.toast.contentGap};
  min-width: 0;
`;

export const toastTitleCss = css`
  margin: 0;
  font: inherit;
  font-weight: ${component.toast.titleFontWeight};
`;

export const toastDescriptionCss = css`
  margin: 0;
  color: ${component.toast.color.description};
`;

export const toastActionsCss = css`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${component.toast.actionsGap};
`;
