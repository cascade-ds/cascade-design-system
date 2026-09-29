import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseInputCss = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: ${component.input.border.width} solid ${component.input.color.border.default};
  border-radius: ${component.input.radius};
  background-color: ${component.input.color.background.default};
  color: ${component.input.color.text.default};
  padding-inline: var(--cascade-input-padding-inline);
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
  }

  &:disabled::placeholder {
    color: ${component.input.color.text.disabled};
  }

  /* Room for the start/end slots: the slot's icon plus a gap. */
  &[data-start] {
    padding-inline-start: calc(
      var(--cascade-input-padding-inline) + ${semantic.size.icon.sm} + ${semantic.gap.sm}
    );
  }

  &[data-end] {
    padding-inline-end: calc(
      var(--cascade-input-padding-inline) + ${semantic.size.icon.sm} + ${semantic.gap.sm}
    );
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const sizes = {
  sm: css`
    --cascade-input-padding-inline: ${component.input.size.sm.paddingInline};
    min-height: ${component.input.size.sm.minHeight};
    padding-block: ${component.input.size.sm.paddingBlock};
    font-family: ${component.input.size.sm.typography.fontFamily};
    font-size: ${component.input.size.sm.typography.fontSize};
    font-weight: ${component.input.size.sm.typography.fontWeight};
    line-height: ${component.input.size.sm.typography.lineHeight};
    letter-spacing: ${component.input.size.sm.typography.letterSpacing};
  `,
  md: css`
    --cascade-input-padding-inline: ${component.input.size.md.paddingInline};
    min-height: ${component.input.size.md.minHeight};
    padding-block: ${component.input.size.md.paddingBlock};
    font-family: ${component.input.size.md.typography.fontFamily};
    font-size: ${component.input.size.md.typography.fontSize};
    font-weight: ${component.input.size.md.typography.fontWeight};
    line-height: ${component.input.size.md.typography.lineHeight};
    letter-spacing: ${component.input.size.md.typography.letterSpacing};
  `,
  lg: css`
    --cascade-input-padding-inline: ${component.input.size.lg.paddingInline};
    min-height: ${component.input.size.lg.minHeight};
    padding-block: ${component.input.size.lg.paddingBlock};
    font-family: ${component.input.size.lg.typography.fontFamily};
    font-size: ${component.input.size.lg.typography.fontSize};
    font-weight: ${component.input.size.lg.typography.fontWeight};
    line-height: ${component.input.size.lg.typography.lineHeight};
    letter-spacing: ${component.input.size.lg.typography.letterSpacing};
  `,
};

export const inputVariant = cva(baseInputCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

const baseWrapperCss = css`
  position: relative;
  display: block;
  width: 100%;
`;

const wrapperSizes = {
  sm: css`
    --cascade-input-padding-inline: ${component.input.size.sm.paddingInline};
  `,
  md: css`
    --cascade-input-padding-inline: ${component.input.size.md.paddingInline};
  `,
  lg: css`
    --cascade-input-padding-inline: ${component.input.size.lg.paddingInline};
  `,
};

/** Positions the start/end slots over the input. Only rendered with a slot. */
export const inputWrapperVariant = cva(baseWrapperCss, {
  variants: {
    size: wrapperSizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

const baseSlotCss = css`
  position: absolute;
  inset-block: 0;
  display: flex;
  align-items: center;
  color: ${component.input.color.icon};
  pointer-events: none;

  & svg {
    display: block;
    width: ${semantic.size.icon.sm};
    height: ${semantic.size.icon.sm};
  }

  & :is(button, a) {
    pointer-events: auto;
  }

  :has(> input:disabled) > & {
    color: ${semantic.color.icon.disabled};
  }
`;

export const inputSlotVariant = cva(baseSlotCss, {
  variants: {
    side: {
      start: css`
        inset-inline-start: var(--cascade-input-padding-inline);
      `,
      end: css`
        inset-inline-end: var(--cascade-input-padding-inline);
      `,
    },
  },
});
