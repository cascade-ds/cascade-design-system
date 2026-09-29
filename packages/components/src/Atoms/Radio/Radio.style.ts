import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseRadioCss = css`
  font-family: ${semantic.font.family.body};
  font-size: ${semantic.font.size.md};
  line-height: ${semantic.font.lineHeight.body};
  color: ${component.radio.color.label};
  display: inline-flex;
  align-items: center;
  gap: ${component.radio.gap};
  cursor: pointer;
  vertical-align: middle;
`;

const disabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
    cursor: not-allowed;
  `,
};

export const radioVariant = cva(baseRadioCss, {
  variants: {
    disabled: disabledStates,
  },
});

export const radioControlCss = css`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${component.radio.size};
  height: ${component.radio.size};

  & > input {
    appearance: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    border: ${semantic.border.width.default} solid ${component.radio.color.border.default};
    border-radius: ${component.radio.radius};
    background-color: ${component.radio.color.background.default};
    cursor: inherit;
    transition:
      background-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard},
      border-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:hover:not(:disabled) {
    border-color: ${component.radio.color.border.hover};
  }

  & > input[aria-invalid='true']:not(:disabled) {
    border-color: ${component.radio.color.border.invalid};
  }

  & > input:checked {
    background-color: ${component.radio.color.background.checked};
    border-color: ${component.radio.color.border.checked};
  }

  & > input:checked:hover:not(:disabled) {
    background-color: ${component.radio.color.background.checkedHover};
  }

  & > input:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  & > input:disabled {
    background-color: ${component.radio.color.background.disabled};
    border-color: ${component.radio.color.border.disabled};
  }

  & > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: none;
    pointer-events: none;
    color: ${component.radio.color.indicator.default};
  }

  & > input:checked ~ svg {
    display: block;
  }

  & > input:disabled ~ svg {
    color: ${component.radio.color.indicator.disabled};
  }
`;
