import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseButtonCss = css`
  font-family: ${semantic.font.family.body};
  font-weight: ${component.button.fontWeight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${component.button.gap};
  box-sizing: border-box;
  border: ${component.button.border.width} solid transparent;
  border-radius: ${component.button.radius};
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: ${component.button.transition.duration};
  transition-timing-function: ${component.button.transition.easing};
  /* Focus ring and elevation are separate layers of one box-shadow, so
     focusing a raised button keeps its lift instead of replacing it. */
  box-shadow:
    var(--cascade-button-focus-shadow, 0 0 transparent),
    var(--cascade-button-elevation, 0 0 transparent);

  &:focus-visible {
    /* Invisible normally; forced-colors mode drops box-shadow and paints
       this outline instead, so focus still shows there. */
    outline: ${component.button.focusRing.width} solid transparent;
    outline-offset: ${component.button.focusRing.offset};
    --cascade-button-focus-shadow: ${component.button.focusRing.shadow};
  }

  &:disabled {
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Filled and outline variants sit raised, lift on hover and flatten when pressed.
const raisedCss = css`
  --cascade-button-elevation: ${component.button.shadow.default};

  &:hover:not(:disabled) {
    --cascade-button-elevation: ${component.button.shadow.hover};
  }

  &:active:not(:disabled) {
    --cascade-button-elevation: ${component.button.shadow.active};
  }
`;

const primaryCss = css`
  background-color: ${component.button.color.primary.background.default};
  border-color: ${component.button.color.primary.border.default};
  color: ${component.button.color.primary.text.default};

  &:hover:not(:disabled) {
    background-color: ${component.button.color.primary.background.hover};
    border-color: ${component.button.color.primary.border.hover};
  }

  &:active:not(:disabled) {
    background-color: ${component.button.color.primary.background.active};
    border-color: ${component.button.color.primary.border.hover};
  }

  &:disabled {
    background-color: ${component.button.color.primary.background.disabled};
    border-color: ${component.button.color.primary.border.disabled};
    color: ${component.button.color.primary.text.disabled};
  }
`;

const secondaryCss = css`
  background-color: ${component.button.color.secondary.background.default};
  border-color: ${component.button.color.secondary.border.default};
  color: ${component.button.color.secondary.text.default};

  &:hover:not(:disabled) {
    background-color: ${component.button.color.secondary.background.hover};
    border-color: ${component.button.color.secondary.border.hover};
  }

  &:active:not(:disabled) {
    background-color: ${component.button.color.secondary.background.active};
    border-color: ${component.button.color.secondary.border.hover};
  }

  &:disabled {
    background-color: ${component.button.color.secondary.background.disabled};
    border-color: ${component.button.color.secondary.border.disabled};
    color: ${component.button.color.secondary.text.disabled};
  }
`;

const outlineCss = css`
  background-color: ${component.button.color.outline.background.default};
  border-color: ${component.button.color.outline.border.default};
  color: ${component.button.color.outline.text.default};

  &:hover:not(:disabled) {
    background-color: ${component.button.color.outline.background.hover};
    border-color: ${component.button.color.outline.border.hover};
  }

  &:active:not(:disabled) {
    background-color: ${component.button.color.outline.background.active};
  }

  &:disabled {
    background-color: ${component.button.color.outline.background.disabled};
    border-color: ${component.button.color.outline.border.disabled};
    color: ${component.button.color.outline.text.disabled};
  }
`;

const dangerCss = css`
  background-color: ${component.button.color.danger.background.default};
  border-color: ${component.button.color.danger.border.default};
  color: ${component.button.color.danger.text.default};

  &:hover:not(:disabled) {
    background-color: ${component.button.color.danger.background.hover};
    border-color: ${component.button.color.danger.border.hover};
  }

  &:active:not(:disabled) {
    background-color: ${component.button.color.danger.background.active};
  }

  &:disabled {
    background-color: ${component.button.color.danger.background.disabled};
    border-color: ${component.button.color.danger.border.disabled};
    color: ${component.button.color.danger.text.disabled};
  }
`;

const ghostCss = css`
  background-color: ${component.button.color.ghost.background.default};
  color: ${component.button.color.ghost.text.default};

  &:hover:not(:disabled) {
    background-color: ${component.button.color.ghost.background.hover};
  }

  &:active:not(:disabled) {
    background-color: ${component.button.color.ghost.background.active};
  }

  &:disabled {
    background-color: ${component.button.color.ghost.background.disabled};
    color: ${component.button.color.ghost.text.disabled};
  }
`;

const linkCss = css`
  background-color: ${component.button.color.link.background.default};
  color: ${component.button.color.link.text.default};

  &:hover:not(:disabled) {
    color: ${component.button.color.link.text.hover};
    text-decoration: underline;
  }

  &:disabled {
    color: ${component.button.color.link.text.disabled};
  }
`;

const variants = {
  primary: [raisedCss, primaryCss],
  secondary: [raisedCss, secondaryCss],
  outline: [raisedCss, outlineCss],
  danger: [raisedCss, dangerCss],
  ghost: ghostCss,
  link: linkCss,
};

const sizes = {
  sm: css`
    min-height: ${component.button.size.sm.minHeight};
    padding-block: ${component.button.size.sm.paddingBlock};
    padding-inline: ${component.button.size.sm.paddingInline};
    font-size: ${semantic.font.size.sm};
    line-height: ${component.button.size.sm.typography.lineHeight};
    letter-spacing: ${component.button.size.sm.typography.letterSpacing};
    --cascade-button-icon-size: ${component.button.size.sm.iconSize};
  `,
  md: css`
    min-height: ${component.button.size.md.minHeight};
    padding-block: ${component.button.size.md.paddingBlock};
    padding-inline: ${component.button.size.md.paddingInline};
    font-size: ${semantic.font.size.md};
    line-height: ${component.button.size.md.typography.lineHeight};
    letter-spacing: ${component.button.size.md.typography.letterSpacing};
    --cascade-button-icon-size: ${component.button.size.md.iconSize};
  `,
  lg: css`
    min-height: ${component.button.size.lg.minHeight};
    padding-block: ${component.button.size.lg.paddingBlock};
    padding-inline: ${component.button.size.lg.paddingInline};
    font-size: ${semantic.font.size.lg};
    line-height: ${component.button.size.lg.typography.lineHeight};
    letter-spacing: ${component.button.size.lg.typography.letterSpacing};
    --cascade-button-icon-size: ${component.button.size.lg.iconSize};
  `,
};

// Button.Icon reads the icon size its parent Button's size variant sets.
export const buttonIconCss = css`
  width: var(--cascade-button-icon-size);
  height: var(--cascade-button-icon-size);
`;

export const buttonVariant = cva(baseButtonCss, {
  variants: {
    variant: variants,
    size: sizes,
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
