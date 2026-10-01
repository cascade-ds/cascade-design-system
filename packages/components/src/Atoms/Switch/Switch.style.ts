import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseSwitchCss = css`
  font-family: ${semantic.font.family.body};
  font-size: ${semantic.font.size.md};
  line-height: ${semantic.font.lineHeight.body};
  color: ${semantic.color.text.primary};
  display: inline-flex;
  align-items: center;
  gap: ${semantic.gap.sm};
  cursor: pointer;
  vertical-align: middle;
`;

const disabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
    cursor: not-allowed;
  `,
};

const colors = {
  primary: '',
  secondary: css`
    --cascade-switch-on: ${component.switch.color.tone.secondary.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.secondary.onHover};
  `,
  tertiary: css`
    --cascade-switch-on: ${component.switch.color.tone.tertiary.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.tertiary.onHover};
  `,
  accent: css`
    --cascade-switch-on: ${component.switch.color.tone.accent.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.accent.onHover};
  `,
  success: css`
    --cascade-switch-on: ${component.switch.color.tone.success.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.success.onHover};
  `,
  info: css`
    --cascade-switch-on: ${component.switch.color.tone.info.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.info.onHover};
  `,
  danger: css`
    --cascade-switch-on: ${component.switch.color.tone.danger.on};
    --cascade-switch-on-hover: ${component.switch.color.tone.danger.onHover};
  `,
};

export const switchVariant = cva(baseSwitchCss, {
  variants: {
    disabled: disabledStates,
    color: colors,
  },
  defaultVariants: {
    color: 'primary',
  },
});

export const switchIconCss = css`
  width: ${component.switch.icon.size};
  height: ${component.switch.icon.size};
  color: ${component.switch.color.icon.default};
`;

export const switchIconOnCss = css``;

export const switchIconOffCss = css``;

export const switchControlCss = css`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${component.switch.track.width};
  height: ${component.switch.track.height};

  & > input {
    appearance: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
    border-radius: ${component.switch.track.radius};
    background-color: ${component.switch.color.track.off};
    cursor: inherit;
    transition: background-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:hover:not(:disabled) {
    background-color: ${component.switch.color.track.offHover};
  }

  & > input:checked {
    background-color: var(--cascade-switch-on, ${component.switch.color.track.on});
  }

  & > input:checked:hover:not(:disabled) {
    background-color: var(--cascade-switch-on-hover, ${component.switch.color.track.onHover});
  }

  & > input:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  & > input:disabled {
    background-color: ${component.switch.color.track.disabled};
  }

  & > span {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    top: calc((${component.switch.track.height} - ${component.switch.thumb.size}) / 2);
    left: calc((${component.switch.track.height} - ${component.switch.thumb.size}) / 2);
    width: ${component.switch.thumb.size};
    height: ${component.switch.thumb.size};
    border-radius: ${semantic.round.full};
    background-color: ${component.switch.color.thumb.default};
    box-shadow: ${semantic.elevation.sm};
    pointer-events: none;
    transition: transform ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:checked ~ span {
    transform: translateX(calc(${component.switch.track.width} - ${component.switch.track.height}));
  }

  & > input:disabled ~ span {
    background-color: ${component.switch.color.thumb.disabled};
    box-shadow: none;
  }

  & > input:checked ~ span > .${switchIconOffCss} {
    display: none;
  }

  & > input:not(:checked) ~ span > .${switchIconOnCss} {
    display: none;
  }

  & > input:disabled ~ span > .${switchIconCss} {
    color: ${component.switch.color.icon.disabled};
  }

  @media (prefers-reduced-motion: reduce) {
    & > input,
    & > span {
      transition: none;
    }
  }
`;
