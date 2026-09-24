import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseTextareaCss = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: ${component.input.border.width} solid ${component.input.color.border.default};
  border-radius: ${component.input.radius};
  background-color: ${component.input.color.background.default};
  color: ${component.input.color.text.default};
  resize: vertical;
  transition-property: border-color, outline-color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &::placeholder {
    color: ${component.input.color.text.placeholder};
    opacity: 1;
  }

  &:hover:not(:disabled):not(:read-only):not(:focus):not([aria-invalid='true']) {
    border-color: ${component.input.color.border.hover};
  }

  &[aria-invalid='true']:not(:disabled) {
    border-color: ${component.input.color.border.invalid};
  }

  /* Text fields show focus for pointer and keyboard alike. The outline is
     pulled inward over the border so the thicker focus border causes no
     layout shift. */
  &:focus {
    border-color: ${component.input.color.border.focus};
    outline: ${component.input.border.widthFocus} solid ${component.input.color.border.focus};
    outline-offset: calc(${component.input.border.width} * -1);
  }

  &[aria-invalid='true']:focus {
    border-color: ${component.input.color.border.invalid};
    outline-color: ${component.input.color.border.invalid};
  }

  &:read-only:not(:disabled) {
    background-color: ${component.input.color.background.readonly};
  }

  &:disabled {
    background-color: ${component.input.color.background.disabled};
    border-color: ${component.input.color.border.disabled};
    color: ${component.input.color.text.disabled};
    cursor: not-allowed;
    resize: none;
  }

  &:disabled::placeholder {
    color: ${component.input.color.text.disabled};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const sizes = {
  sm: css`
    min-height: ${component.input.size.sm.minHeight};
    padding-inline: ${component.input.size.sm.paddingInline};
    padding-block: ${component.input.size.sm.paddingBlock};
    font-family: ${component.input.size.sm.typography.fontFamily};
    font-size: ${component.input.size.sm.typography.fontSize};
    font-weight: ${component.input.size.sm.typography.fontWeight};
    line-height: ${component.input.size.sm.typography.lineHeight};
    letter-spacing: ${component.input.size.sm.typography.letterSpacing};
  `,
  md: css`
    min-height: ${component.input.size.md.minHeight};
    padding-inline: ${component.input.size.md.paddingInline};
    padding-block: ${component.input.size.md.paddingBlock};
    font-family: ${component.input.size.md.typography.fontFamily};
    font-size: ${component.input.size.md.typography.fontSize};
    font-weight: ${component.input.size.md.typography.fontWeight};
    line-height: ${component.input.size.md.typography.lineHeight};
    letter-spacing: ${component.input.size.md.typography.letterSpacing};
  `,
  lg: css`
    min-height: ${component.input.size.lg.minHeight};
    padding-inline: ${component.input.size.lg.paddingInline};
    padding-block: ${component.input.size.lg.paddingBlock};
    font-family: ${component.input.size.lg.typography.fontFamily};
    font-size: ${component.input.size.lg.typography.fontSize};
    font-weight: ${component.input.size.lg.typography.fontWeight};
    line-height: ${component.input.size.lg.typography.lineHeight};
    letter-spacing: ${component.input.size.lg.typography.letterSpacing};
  `,
};

export const textareaVariant = cva(baseTextareaCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'md',
  },
});
