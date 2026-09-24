import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseCheckboxCss = css`
  font-family: ${semantic.font.family.body};
  font-size: ${semantic.font.size.md};
  line-height: ${semantic.font.lineHeight.body};
  color: ${component.checkbox.color.label};
  display: inline-flex;
  align-items: center;
  gap: ${component.checkbox.gap};
  cursor: pointer;
  vertical-align: middle;
`;

const disabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
    cursor: not-allowed;
  `,
};

export const checkboxVariant = cva(baseCheckboxCss, {
  variants: {
    disabled: disabledStates,
  },
});

// The native input is restyled (appearance: none) to become the visible box,
// so it keeps focus, hover, checked and disabled states natively. The check /
// dash glyphs are siblings shown via `:checked` / `:indeterminate`.
export const checkboxControlCss = css`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${component.checkbox.size};
  height: ${component.checkbox.size};

  & > input {
    appearance: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    border: ${semantic.border.width.default} solid ${component.checkbox.color.border.default};
    border-radius: ${component.checkbox.radius};
    background-color: ${component.checkbox.color.background.default};
    cursor: inherit;
    transition:
      background-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard},
      border-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:hover:not(:disabled) {
    border-color: ${component.checkbox.color.border.hover};
  }

  & > input[aria-invalid='true']:not(:disabled) {
    border-color: ${component.checkbox.color.border.invalid};
  }

  & > input:checked,
  & > input:indeterminate {
    background-color: ${component.checkbox.color.background.checked};
    border-color: ${component.checkbox.color.border.checked};
  }

  & > input:checked:hover:not(:disabled),
  & > input:indeterminate:hover:not(:disabled) {
    background-color: ${component.checkbox.color.background.checkedHover};
  }

  & > input:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  & > input:disabled {
    background-color: ${component.checkbox.color.background.disabled};
    border-color: ${component.checkbox.color.border.disabled};
  }

  & > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: none;
    pointer-events: none;
    color: ${component.checkbox.color.indicator.default};
  }

  & > input:checked:not(:indeterminate) ~ svg[data-indicator='check'],
  & > input:indeterminate ~ svg[data-indicator='dash'] {
    display: block;
  }

  & > input:disabled ~ svg {
    color: ${component.checkbox.color.indicator.disabled};
  }
`;
