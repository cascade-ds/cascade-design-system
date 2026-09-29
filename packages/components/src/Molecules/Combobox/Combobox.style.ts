import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

// The input itself uses Input's styles (the `input` tokens), so comboboxes
// line up with text fields and selects. These styles cover the rest, and
// Autocomplete shares them.

/** The chevron button over the input's end, which opens the popup. */
export const comboboxTriggerCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${component.combobox.color.icon};
  cursor: pointer;

  & > svg {
    width: ${component.combobox.iconSize};
    height: ${component.combobox.iconSize};
    transition-property: transform;
    transition-duration: ${semantic.motion.duration.fast};
    transition-timing-function: ${semantic.motion.easing.standard};
  }

  &[data-popup-open] > svg {
    transform: rotate(180deg);
  }

  &:disabled {
    color: ${semantic.color.icon.disabled};
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    & > svg {
      transition: none;
    }
  }
`;

export const comboboxPositionerCss = css`
  z-index: ${component.combobox.zIndex};
  outline: none;
`;

export const comboboxPopupCss = css`
  box-sizing: border-box;
  width: var(--anchor-width);
  max-width: var(--available-width);
  border: ${component.combobox.borderWidth} solid ${component.combobox.color.border};
  border-radius: ${component.combobox.radius};
  background-color: ${component.combobox.color.background};
  box-shadow: ${component.combobox.shadow};
  color: ${component.combobox.color.item.text};
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

  &[data-side='bottom'][data-starting-style],
  &[data-side='bottom'][data-ending-style] {
    transform: translateY(calc(-1 * ${component.combobox.offset}));
  }
  &[data-side='top'][data-starting-style],
  &[data-side='top'][data-ending-style] {
    transform: translateY(${component.combobox.offset});
  }

  &[data-side='bottom'] {
    margin-top: ${component.combobox.offset};
  }
  &[data-side='top'] {
    margin-bottom: ${component.combobox.offset};
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
    }
  }
`;

export const comboboxListCss = css`
  box-sizing: border-box;
  max-height: min(${component.combobox.maxHeight}, var(--available-height));
  padding: ${component.combobox.padding};
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding-block: ${component.combobox.padding};
  outline: none;

  &[data-empty] {
    display: none;
  }
`;

export const comboboxEmptyCss = css`
  color: ${component.combobox.color.empty};
  font-family: ${component.combobox.empty.typography.fontFamily};
  font-size: ${component.combobox.empty.typography.fontSize};
  font-weight: ${component.combobox.empty.typography.fontWeight};
  line-height: ${component.combobox.empty.typography.lineHeight};
  letter-spacing: ${component.combobox.empty.typography.letterSpacing};

  &:not(:empty) {
    padding: ${component.combobox.empty.padding};
  }
`;

/** What every option shares; Combobox and Autocomplete add their layout. */
export const comboboxOptionCss = css`
  box-sizing: border-box;
  min-height: ${component.combobox.item.height};
  padding-inline: ${component.combobox.item.paddingInline};
  border-radius: ${component.combobox.item.radius};
  color: ${component.combobox.color.item.text};
  font-family: ${component.combobox.item.typography.fontFamily};
  font-size: ${component.combobox.item.typography.fontSize};
  font-weight: ${component.combobox.item.typography.fontWeight};
  line-height: ${component.combobox.item.typography.lineHeight};
  letter-spacing: ${component.combobox.item.typography.letterSpacing};
  cursor: default;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background-color: ${component.combobox.color.item.backgroundHighlighted};
  }

  &[data-disabled] {
    color: ${component.combobox.color.item.textDisabled};
    cursor: not-allowed;
  }
`;

/** An option with a check-mark column. */
export const comboboxItemCss = css`
  display: grid;
  grid-template-columns: ${component.combobox.iconSize} 1fr;
  align-items: center;
  gap: ${component.combobox.item.gap};

  &[data-selected] {
    background-color: ${component.combobox.color.item.backgroundSelected};
  }
`;

export const comboboxItemIndicatorCss = css`
  grid-column: 1;
  display: inline-flex;
  width: ${component.combobox.iconSize};
  height: ${component.combobox.iconSize};
  color: ${component.combobox.color.item.indicator};

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

export const comboboxItemTextCss = css`
  grid-column: 2;
`;

export const comboboxGroupLabelCss = css`
  padding-inline: ${component.combobox.groupLabel.paddingInline};
  padding-block: ${component.combobox.groupLabel.paddingBlock};
  color: ${component.combobox.color.groupLabel};
  font-family: ${component.combobox.groupLabel.typography.fontFamily};
  font-size: ${component.combobox.groupLabel.typography.fontSize};
  font-weight: ${component.combobox.groupLabel.typography.fontWeight};
  line-height: ${component.combobox.groupLabel.typography.lineHeight};
  letter-spacing: ${component.combobox.groupLabel.typography.letterSpacing};
`;

export const comboboxSeparatorCss = css`
  height: ${component.combobox.borderWidth};
  margin-block: ${component.combobox.offset};
  border: none;
  background-color: ${component.combobox.color.separator};
`;
