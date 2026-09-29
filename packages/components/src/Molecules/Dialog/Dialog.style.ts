import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

export const dialogBackdropCss = css`
  position: fixed;
  inset: 0;
  z-index: ${component.modal.zIndex};
  background-color: ${component.modal.color.overlay};
  transition-property: opacity;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.enter};

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const baseDialogPopupCss = css`
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: ${component.modal.zIndex};
  display: flex;
  flex-direction: column;
  gap: ${component.modal.gap};
  /* Keeps the viewport inset on every side, so the dialog never touches
     the edges on small screens. */
  width: calc(100% - 2 * ${component.modal.viewportInset});
  max-height: calc(100dvh - 2 * ${component.modal.viewportInset});
  overflow-y: auto;
  padding: ${component.modal.padding};
  border: ${semantic.border.width.default} solid ${component.modal.color.border};
  border-radius: ${component.modal.radius};
  background-color: ${component.modal.color.background};
  box-shadow: ${component.modal.shadow};
  color: ${component.modal.color.body};
  font-family: ${component.modal.body.fontFamily};
  font-size: ${component.modal.body.fontSize};
  font-weight: ${component.modal.body.fontWeight};
  line-height: ${component.modal.body.lineHeight};
  letter-spacing: ${component.modal.body.letterSpacing};
  transform: translate(-50%, -50%);
  transition-property: opacity, transform;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.enter};

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow}, ${component.modal.shadow};
  }

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }

  /* Fades in while growing from the enter scale. */
  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(${component.modal.enterScale});
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: translate(-50%, -50%);
    }
  }
`;

const sizes = {
  sm: css`
    max-width: ${component.modal.width.sm};
  `,
  md: css`
    max-width: ${component.modal.width.md};
  `,
};

export const dialogPopupVariant = cva(baseDialogPopupCss, {
  variants: { size: sizes },
  defaultVariants: { size: 'sm' },
});

export const dialogTitleCss = css`
  margin: 0;
  color: ${component.modal.color.title};
  font-family: ${component.modal.title.fontFamily};
  font-size: ${component.modal.title.fontSize};
  font-weight: ${component.modal.title.fontWeight};
  line-height: ${component.modal.title.lineHeight};
  letter-spacing: ${component.modal.title.letterSpacing};
`;

export const dialogDescriptionCss = css`
  margin: 0;
  color: ${component.modal.color.body};
`;

export const dialogActionsCss = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${component.modal.actionsGap};
`;
