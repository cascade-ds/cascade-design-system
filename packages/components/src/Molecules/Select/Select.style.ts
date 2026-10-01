import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseTriggerCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${semantic.gap.sm};
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: ${component.input.border.width} solid ${component.input.color.border.default};
  border-radius: ${component.input.radius};
  background-color: ${component.input.color.background.default};
  color: ${component.input.color.text.default};
  text-align: start;
  cursor: pointer;
  transition-property: border-color, box-shadow;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover:not([data-disabled]):not([data-readonly]):not([aria-invalid='true']):not(:focus-visible) {
    border-color: ${component.input.color.border.hover};
  }

  &[aria-invalid='true']:not([data-disabled]) {
    border-color: ${component.input.color.border.invalid};
  }

  /* Keyboard focus and the open state both draw the input focus ring. The
     transparent outline is what forced-colors mode paints. */
  &:focus-visible,
  &[data-popup-open] {
    border-color: ${component.input.color.border.focus};
    outline: ${semantic.focus.ring.width} solid transparent;
    box-shadow: ${semantic.focus.shadow};
  }

  &[aria-invalid='true']:focus-visible,
  &[aria-invalid='true'][data-popup-open] {
    border-color: ${component.input.color.border.invalid};
    box-shadow: 0 0 0 ${semantic.focus.ring.width} ${component.input.color.border.invalid};
  }

  &[data-readonly]:not([data-disabled]) {
    background-color: ${component.input.color.background.readonly};
    cursor: default;
  }

  &[data-disabled] {
    background-color: ${component.input.color.background.disabled};
    border-color: ${component.input.color.border.disabled};
    color: ${component.input.color.text.disabled};
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const triggerSizes = {
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

export const selectTriggerVariant = cva(baseTriggerCss, {
  variants: {
    size: triggerSizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

export const selectValueCss = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &[data-placeholder] {
    color: ${component.input.color.text.placeholder};
  }

  [data-disabled] > & {
    color: ${component.input.color.text.disabled};
  }
`;

export const selectIconCss = css`
  display: inline-flex;
  flex-shrink: 0;
  width: ${semantic.size.icon.sm};
  height: ${semantic.size.icon.sm};
  color: ${component.input.color.icon};

  & > svg {
    width: 100%;
    height: 100%;
  }

  [data-disabled] > & {
    color: ${semantic.color.icon.disabled};
  }
`;

export const selectLabelCss = css`
  color: ${component.input.label.color};
  font-family: ${component.input.label.typography.fontFamily};
  font-size: ${component.input.label.typography.fontSize};
  font-weight: ${component.input.label.typography.fontWeight};
  line-height: ${component.input.label.typography.lineHeight};
  letter-spacing: ${component.input.label.typography.letterSpacing};
  cursor: default;
`;

export const selectPositionerCss = css`
  z-index: ${component.select.zIndex};
  outline: none;
`;

export const selectPopupCss = css`
  box-sizing: border-box;
  min-width: var(--anchor-width);
  max-height: var(--available-height);
  padding: ${component.select.padding};
  border: ${component.select.borderWidth} solid ${component.select.color.border};
  border-radius: ${component.select.radius};
  background-color: ${component.select.color.background};
  box-shadow: ${component.select.shadow};
  color: ${component.select.color.item.text};
  overflow-y: auto;
  outline: none;
  transform-origin: var(--transform-origin);
  transition-property: opacity, transform;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.enter};

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  /* Aligned over the trigger (data-side="none") the popup only fades;
     placed below or above it, it also moves out of the trigger. */
  &[data-side='bottom'][data-starting-style],
  &[data-side='bottom'][data-ending-style] {
    transform: translateY(calc(-1 * ${component.select.offset}));
  }
  &[data-side='top'][data-starting-style],
  &[data-side='top'][data-ending-style] {
    transform: translateY(${component.select.offset});
  }

  &[data-side='bottom'] {
    margin-top: ${component.select.offset};
  }
  &[data-side='top'] {
    margin-bottom: ${component.select.offset};
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
    }
  }
`;

export const selectListCss = css`
  outline: none;
`;

export const selectItemCss = css`
  display: grid;
  grid-template-columns: ${semantic.size.icon.sm} 1fr;
  align-items: center;
  gap: ${component.select.item.gap};
  box-sizing: border-box;
  min-height: ${component.select.item.height};
  padding-inline: ${component.select.item.paddingInline};
  border-radius: ${component.select.item.radius};
  color: ${component.select.color.item.text};
  font-family: ${component.select.item.typography.fontFamily};
  font-size: ${component.select.item.typography.fontSize};
  font-weight: ${component.select.item.typography.fontWeight};
  line-height: ${component.select.item.typography.lineHeight};
  letter-spacing: ${component.select.item.typography.letterSpacing};
  cursor: default;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background-color: ${component.select.color.item.backgroundHighlighted};
  }

  &[data-selected] {
    background-color: ${component.select.color.item.backgroundSelected};
  }

  &[data-disabled] {
    color: ${component.select.color.item.textDisabled};
    cursor: not-allowed;
  }
`;

export const selectItemIndicatorCss = css`
  grid-column: 1;
  display: inline-flex;
  width: ${semantic.size.icon.sm};
  height: ${semantic.size.icon.sm};
  color: ${component.select.color.item.indicator};

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

export const selectItemTextCss = css`
  grid-column: 2;
`;

export const selectGroupLabelCss = css`
  padding-inline: ${component.select.groupLabel.paddingInline};
  padding-block: ${component.select.groupLabel.paddingBlock};
  color: ${component.select.color.groupLabel};
  font-family: ${component.select.groupLabel.typography.fontFamily};
  font-size: ${component.select.groupLabel.typography.fontSize};
  font-weight: ${component.select.groupLabel.typography.fontWeight};
  line-height: ${component.select.groupLabel.typography.lineHeight};
  letter-spacing: ${component.select.groupLabel.typography.letterSpacing};
`;

export const selectSeparatorCss = css`
  height: ${component.select.borderWidth};
  margin-block: ${component.select.offset};
  border: none;
  background-color: ${component.select.color.separator};
`;
